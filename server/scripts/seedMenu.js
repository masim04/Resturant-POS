/**
 * Bulk-import Cafe Rubab menu into MongoDB.
 *
 * Usage (from server folder):
 *   node scripts/seedMenu.js          # add menu (keeps existing data)
 *   node scripts/seedMenu.js --clear  # wipe categories + products first
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const menu = require("../data/menuSeed");
const Category = require("../models/Category");
const Product = require("../models/Products");

const CLEAR = process.argv.includes("--clear");

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI missing in server/.env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  if (CLEAR) {
    const p = await Product.deleteMany({});
    const c = await Category.deleteMany({});
    console.log(`Cleared ${p.deletedCount} products, ${c.deletedCount} categories`);
  }

  let productCount = 0;

  for (const section of menu) {
    let category = await Category.findOne({ name: section.category });
    if (!category) {
      category = await Category.create({ name: section.category });
      console.log(`+ Category: ${section.category}`);
    }

    for (const p of section.products) {
      const exists = await Product.findOne({
        name: p.name,
        category: category._id,
      });
      if (exists) continue;

      await Product.create({
        name: p.name,
        price: p.price,
        description: p.description || "",
        category: category._id,
        available: true,
        image: "",
      });
      productCount++;
    }
  }

  const totalCategories = await Category.countDocuments();
  const totalProducts = await Product.countDocuments();

  console.log(`\nDone! Added ${productCount} new products.`);
  console.log(`Database now has ${totalCategories} categories, ${totalProducts} products.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
