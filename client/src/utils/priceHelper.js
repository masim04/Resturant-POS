/**
 * Calculate final price with discount
 * @param {number} price - Original price
 * @param {boolean} discountEnabled - Whether discount is enabled
 * @param {string} discountType - Type of discount ("percentage" or "fixed")
 * @param {number} discountValue - Discount value
 * @returns {{originalPrice: number, discountAmount: number, finalPrice: number}}
 */
export const getFinalPrice = (price, discountEnabled, discountType, discountValue) => {
  const originalPrice = parseFloat(price) || 0;

  if (!discountEnabled || !discountValue || discountValue <= 0) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
    };
  }

  let discountAmount = 0;

  if (discountType === "percentage") {
    discountAmount = (originalPrice * discountValue) / 100;
  } else if (discountType === "fixed") {
    discountAmount = discountValue;
  }

  // Ensure final price never goes negative
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  return {
    originalPrice,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
  };
};

/**
 * Format discount badge text
 * @param {string} discountType - Type of discount ("percentage" or "fixed")
 * @param {number} discountValue - Discount value
 * @returns {string}
 */
export const getDiscountBadgeText = (discountType, discountValue) => {
  if (discountType === "percentage") {
    return `${discountValue}% OFF`;
  } else if (discountType === "fixed") {
    return `SAVE £${discountValue.toFixed(2)}`;
  }
  return "";
};
