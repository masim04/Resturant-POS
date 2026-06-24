const Order = require("../models/Order");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, orderType, items, total } = req.body;

    if (!customerName || !phone || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Missing customer details or items" });
    }

    if (orderType === "delivery" && !address) {
      return res.status(400).json({ message: "Address required for delivery" });
    }

    const source = req.body.source === "online" ? "online" : "pos";
    
    // Process items to ensure customizations are properly stored
    const processedItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      customizations: item.customizations || {},
      customizationPrice: item.customizationPrice || 0,
    }));

    const order = await Order.create({
      ...req.body,
      items: processedItems,
      source,
    });

    const Payment = require("../models/Payment");
    global.io.emit("newOrder", order);
    const method = ["cash", "card", "online"].includes(order.paymentMethod)
      ? order.paymentMethod
      : "cash";

    await Payment.create({
      orderId: order._id,
      amount: order.total,
      method,
      status: order.paymentStatus === "paid" ? "paid" : "pending",
      paidAt: order.paymentStatus === "paid" ? new Date() : null,
    });
    res.json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ALL ORDERS (admin)
const getOrders = async (req, res) => {
  try {
    const { phone, source } = req.query;

    let filter = {};
    if (phone) {
      filter.phone = phone;
    }
    if (source === "pos" || source === "online") {
      filter.source = source;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE ORDER
const updateOrderStatus = async (req, res) => {
  try {
    const updateData = {};
    if (req.body.status) updateData.status = req.body.status;
    if (req.body.paymentStatus) updateData.paymentStatus = req.body.paymentStatus;
    if (req.body.paymentMethod) updateData.paymentMethod = req.body.paymentMethod;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.body.paymentStatus === "paid") {
      const Payment = require("../models/Payment");
      await Payment.findOneAndUpdate(
        { orderId: order._id },
        {
          status: "paid",
          method: req.body.paymentMethod || order.paymentMethod || "cash",
          paidAt: new Date(),
        },
      );
    }

    global.io.emit("orderUpdated", order);
    res.json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
