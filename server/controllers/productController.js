const Product = require("../models/Products");
const mongoose = require("mongoose");
// CREATE
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      discountEnabled,
      discountType,
      discountValue,
    } = req.body;

    const product = new Product({
      name,
      price,
      category,
      discountEnabled: discountEnabled === "true" || discountEnabled === true,
      discountType: discountType || "percentage",
      discountValue: parseFloat(discountValue) || 0,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// READ ALL
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE


const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // FIX CATEGORY
    if (updateData.category) {
      updateData.category =
        updateData.category._id || updateData.category;
    }

    // image
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Handle discount fields
    if (updateData.discountEnabled !== undefined) {
      updateData.discountEnabled =
        updateData.discountEnabled === "true" ||
        updateData.discountEnabled === true;
    }
    if (updateData.discountValue !== undefined) {
      updateData.discountValue = parseFloat(updateData.discountValue) || 0;
    }
    if (updateData.discountType !== undefined) {
      updateData.discountType = updateData.discountType || "percentage";
    }

    // customization groups
    if (updateData.customizationGroups) {
      if (typeof updateData.customizationGroups === "string") {
        updateData.customizationGroups = JSON.parse(
          updateData.customizationGroups
        );
      }

      updateData.customizationGroups =
        updateData.customizationGroups.map((group) => ({
          _id: group._id || new mongoose.Types.ObjectId(),
          title: group.title || "",
          required: group.required || false,
          multiSelect: group.multiSelect || false,

          options: (group.options || []).map((opt) => ({
            _id: opt._id || new mongoose.Types.ObjectId(),
            name: opt.name || "",
            extraPrice: parseFloat(opt.extraPrice) || 0,
            isDeal: opt.isDeal === true || opt.isDeal === "true",
            dealOptions: (opt.dealOptions || []).map((dealOpt) => ({
              _id: dealOpt._id || new mongoose.Types.ObjectId(),
              name: dealOpt.name || "",
              extraPrice: parseFloat(dealOpt.extraPrice) || 0,
            })),
          })),
        }));
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};