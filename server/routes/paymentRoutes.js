const express = require("express");
const router = express.Router();

const {
  createPayment,
  getPayments,
  updatePayment,
  updatePaymentByOrder,
} = require("../controllers/paymentController");

router.post("/", createPayment);
router.get("/", getPayments);
router.put("/by-order/:orderId", updatePaymentByOrder);
router.put("/:id", updatePayment);

module.exports = router;