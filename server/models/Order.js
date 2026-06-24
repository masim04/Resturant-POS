const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
        customizations: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        customizationPrice: { type: Number, default: 0 },
      },
    ],

    customerName: String,
    phone: String,
    address: {
      type: String,
      default: "", // only NEEDED for delivery
    },
    extraNotes: {
      type: String,
      default: "",
    },
    orderType: {
      type: String,
      enum: ["delivery", "walk-in"],
      required: true,
    },
    source: {
      type: String,
      enum: ["pos", "online"],
      default: "pos",
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    paymentType: {
      type: String,
      enum: ["paid", "cod"],
      default: "cod",
    },
    status: {
      type: String,
      default: "Pending", // Pending Prearing Ready Completed Cancelled BLAH BLAH
    },

    total: Number,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
