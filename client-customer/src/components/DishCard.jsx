import { useCart } from "../context/CartContext";
import { API_BASE } from "../constants";
import { getFinalPrice, getDiscountBadgeText } from "../utils/priceHelper";

function StarRating() {
  return (
    <div className="flex gap-0.5 text-cafe-400" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function DishCard({ product, onAddToCart }) {
  const { addToCart } = useCart();
  const imgSrc = product.image ? `${API_BASE}${product.image}` : null;

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }
    addToCart(product);
  };

  // Calculate final price with discount
  const priceData = getFinalPrice(
    product.price,
    product.discountEnabled,
    product.discountType,
    product.discountValue
  );

  return (
    <article className="dish-card group flex min-w-65 max-w-70 shrink-0 flex-col sm:min-w-0 sm:max-w-none">
      <div className="mx-auto -mt-2 mb-4 h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-cafe ring-2 ring-cafe-100 sm:h-40 sm:w-40 relative">
        {imgSrc ? (
          <img src={imgSrc} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cafe-100 text-sm font-semibold text-cafe-700">
            {product.name?.charAt(0) || "?"}
          </div>
        )}
        {product.discountEnabled && product.discountValue > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
            {getDiscountBadgeText(product.discountType, product.discountValue)}
          </div>
        )}
      </div>
      <h3 className="text-center font-display text-lg font-bold text-ink-900">{product.name}</h3>
      <div className="mt-2 flex justify-center">
        <StarRating />
      </div>
      <p className="mt-3 line-clamp-2 text-center text-sm leading-relaxed text-ink-700">
        {product.description || "Fresh from our kitchen — made to order."}
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-cafe-100 pt-4">
        <div className="flex flex-col items-center">
          {product.discountEnabled && product.discountValue > 0 ? (
            <>
              <p className="text-xs text-gray-500 line-through">
                £ {product.price}
              </p>
              <p className="font-display text-xl font-bold text-red-600">
                £ {priceData.finalPrice.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-display text-xl font-bold text-cafe-600">
              £ {product.price}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-cafe-300 bg-white px-4 py-2 text-xs font-bold text-ink-900 transition hover:border-cafe-400 hover:bg-cafe-50"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-cafe-400 text-white">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </span>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default DishCard;
