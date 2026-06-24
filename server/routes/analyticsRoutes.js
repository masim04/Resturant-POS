const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.get("/dashboard", async (req, res) => {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Total Revenue
    const totalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    // Total Orders
    const totalOrders = await Order.countDocuments();

    //Total products which are in database
    const totalProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    // Today's Date
   
    // Today's Revenue
    const todayRevenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
        },
      },
    ]);

    // Total products sold
    const productsSoldData = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);

    // Today's products sold
    const todayProductsSoldData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    // Payment Methods
    const payments = await Order.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$total" },
        },
      },
    ]);

    // Top Products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]);

    // Top Products Today
    const topProductsToday = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.price"],
            },
          },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]);

    // Recent Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id total paymentMethod paymentStatus createdAt");

    const totalRevenue = totalRevenueData[0]?.total || 0;
    const todayRevenue = todayRevenueData[0]?.total || 0;
    const totalProductsSold = productsSoldData[0]?.totalQuantity || 0;
    const todayProductsSold = todayProductsSoldData[0]?.totalQuantity || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const todayAvgOrderValue = todayOrders > 0 ? todayRevenue / todayOrders : 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts: totalProducts[0]?.count || 0,
      totalProductsSold,
      todayRevenue,
      todayOrders,
      todayProductsSold,
      avgOrderValue,
      todayAvgOrderValue,
      payments,
      topProducts,
      topProductsToday,
      recentOrders,
    });
  } catch (err) {
    console.error("Analytics Route Error:");
    console.error(err);

    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  }
});

module.exports = router;
