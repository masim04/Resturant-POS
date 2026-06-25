const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  description: String,
  image: String,
  available: {
    type: Boolean,
    default: true,
  },
  discountEnabled: {
    type: Boolean,
    default: false,
  },
  discountType: {
    type: String,
    enum: ["percentage", "fixed"],
    default: "percentage",
  },
  discountValue: {
    type: Number,
    default: 0,
  },
  customizationGroups: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      required: Boolean,
      multiSelect: Boolean,
      options: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          name: String,
          extraPrice: { type: Number, default: 0 },
          isDeal: { type: Boolean, default: false },
          dealOptions: [
            {
              _id: mongoose.Schema.Types.ObjectId,
              name: String,
              extraPrice: { type: Number, default: 0 },
            },
          ],
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
