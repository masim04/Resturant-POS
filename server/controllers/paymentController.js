const Payment = require("../models/Payment");
const Order = require("../models/Order");

const syncOrderPayment = async (orderId, { status, method }) => {
  if (!orderId) return;
  const update = {};
  if (status === "paid") update.paymentStatus = "paid";
  if (method) update.paymentMethod = method;
  if (Object.keys(update).length > 0) {
    await Order.findByIdAndUpdate(orderId, update);
  }
};

// create payment
const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update payment status
const updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (req.body.status === "paid") {
      await syncOrderPayment(updated.orderId, {
        status: "paid",
        method: req.body.method || updated.method,
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updatePaymentByOrder = async (req, res) => {
  try {
    const updated = await Payment.findOneAndUpdate(
      { orderId: req.params.orderId },
      req.body,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Payment not found for order" });
    }

    if (req.body.status === "paid") {
      await syncOrderPayment(req.params.orderId, {
        status: "paid",
        method: req.body.method || updated.method,
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  updatePayment,
  updatePaymentByOrder,
};
