import { getFinalPrice, getDiscountBadgeText } from "../utils/priceHelper";

function TodaysOffers({ products, onAddToCart }) {
  // Filter products that have discount enabled
  const discountedProducts = products.filter(
    (p) => p.discountEnabled && p.discountValue > 0
  );

  // Don't show section if no discounted products
  if (discountedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 overflow-hidden">
      {/* Section Title */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl">⭐</span>
        <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          Today's Offers
        </h2>
      </div>

      {/* Scrollable Container - Mobile horizontal scroll, Desktop grid */}
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {discountedProducts.map((product) => {
          const priceData = getFinalPrice(
            product.price,
            product.discountEnabled,
            product.discountType,
            product.discountValue
          );

          const badgeText = getDiscountBadgeText(
            product.discountType,
            product.discountValue
          );

          return (
            <article
              key={product._id}
              className="group shrink-0 w-64 md:w-auto card-surface flex flex-col overflow-hidden shadow-cafe transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-cafe-lg cursor-pointer"
              onClick={() => onAddToCart(product)}
            >
              {/* Product Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-cafe-100">
                {product.image ? (
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-linear-to-br from-cafe-100 to-cafe-50 text-sm font-medium text-cafe-700/80">
                    Photo coming soon
                  </div>
                )}

                {/* Discount Badge */}
                <div className="absolute right-3 top-3 rounded-full border-2 border-white bg-red-500 px-3 py-1 text-center text-[0.7rem] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-sm">
                  {badgeText}
                </div>

                {/* Hot Offer Fire Icon */}
                <div className="absolute bottom-3 left-3 text-2xl animate-bounce">
                  🔥
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                {/* Product Name */}
                <h3 className="font-display text-lg font-semibold text-ink-900 sm:text-xl">
                  {product.name}
                </h3>

                {/* Price Section */}
                <div className="mt-4 flex flex-col gap-1">
                  {/* Original Price - Line Through */}
                  <p className="text-sm font-medium text-gray-500 line-through">
                    £{priceData.originalPrice.toFixed(2)}
                  </p>

                  {/* Discounted Price - Bold */}
                  <p className="font-display text-2xl font-bold text-red-600">
                    £{priceData.finalPrice.toFixed(2)}
                  </p>

                  {/* Savings Info */}
                  <p className="text-xs font-semibold text-green-600 mt-1">
                    Save £{priceData.discountAmount.toFixed(2)}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="btn-primary mt-4 w-full gap-2 py-2.5 text-sm"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add to cart
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mt-10 border-t border-cafe-100" />
    </section>
  );
}

export default TodaysOffers;
