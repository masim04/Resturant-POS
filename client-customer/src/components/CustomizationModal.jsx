import { useState, useMemo } from "react";
import { getFinalPrice, getDiscountBadgeText } from "../utils/priceHelper";
import { assetUrl } from "../constants";

export default function CustomizationModal({ product, isOpen, onClose, onConfirm }) {
  const [selections, setSelections] = useState({});

  const customizationPrice = useMemo(() => {
    let total = 0;
    if (product?.customizationGroups) {
      product.customizationGroups.forEach((group) => {
        if (group.multiSelect && selections[group._id]) {
          selections[group._id].forEach((optId) => {
            const option = group.options?.find((o) => o._id === optId);
            if (option) total += option.extraPrice || 0;
          });
        } else if (!group.multiSelect && selections[group._id]) {
          const option = group.options?.find((o) => o._id === selections[group._id]);
          if (option) total += option.extraPrice || 0;
        }
      });
    }
    return total;
  }, [selections, product]);

  // Calculate base price with discount
  const priceData = useMemo(() => {
    return getFinalPrice(
      product?.price,
      product?.discountEnabled,
      product?.discountType,
      product?.discountValue
    );
  }, [product]);

  const finalPrice = (priceData.finalPrice + customizationPrice).toFixed(2);
  const badgeText = useMemo(() => {
    if (product?.discountEnabled && product?.discountValue > 0) {
      return getDiscountBadgeText(product?.discountType, product?.discountValue);
    }
    return null;
  }, [product]);

  const handleSave = () => {
    // Validate required groups
    if (product?.customizationGroups) {
      for (const group of product.customizationGroups) {
        if (group.required && !selections[group._id]) {
          alert(`Please select ${group.title}`);
          return;
        }
      }
    }

    // Transform selections to include group titles and option names
    const customizationDetails = {};
    if (product?.customizationGroups) {
      product.customizationGroups.forEach((group) => {
        if (selections[group._id]) {
          if (group.multiSelect) {
            // For multi-select, create an entry for each selected option
            selections[group._id].forEach((optionId, idx) => {
              const option = group.options?.find((o) => o._id === optionId);
              if (option) {
                customizationDetails[`${group._id}-${idx}`] = {
                  groupTitle: group.title,
                  optionName: option.name,
                  extraPrice: option.extraPrice || 0,
                };
              }
            });
          } else {
            // For single select
            const option = group.options?.find((o) => o._id === selections[group._id]);
            if (option) {
              customizationDetails[group._id] = {
                groupTitle: group.title,
                optionName: option.name,
                extraPrice: option.extraPrice || 0,
              };
            }
          }
        }
      });
    }

    onConfirm(customizationDetails, customizationPrice);
    setSelections({});
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="card-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Product Header with Image */}
        {product.image && (
          <div className="relative h-48 overflow-hidden bg-cafe-100">
            <img
              src={assetUrl(product.image)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          </div>
        )}

        {/* Product Info */}
        <div className="border-b border-cafe-100 bg-linear-to-b from-cream to-white px-6 py-6 sm:px-8">
          <h2 className="font-display text-3xl font-bold text-ink-900 mb-2">
            {product.name}
          </h2>
          {product.description && (
            <p className="text-sm text-ink-700 max-w-2xl">
              {product.description}
            </p>
          )}
        </div>

        {/* Customization Groups */}
        <div className="px-6 py-6 sm:px-8">
          {product.customizationGroups && product.customizationGroups.length > 0 ? (
            <div className="space-y-6">
              {product.customizationGroups.map((group) => (
                <div
                  key={group._id}
                  className="rounded-xl border border-cafe-200 bg-white p-5 shadow-sm hover:border-cafe-300 transition"
                >
                  <h3 className="font-display text-lg font-semibold text-ink-900 mb-4 flex items-center gap-2">
                    {group.title}
                    {group.required && (
                      <span className="text-red-500 text-xl leading-none" title="Required">
                        *
                      </span>
                    )}
                  </h3>

                  {group.multiSelect ? (
                    // Multiple selection - Checkboxes
                    <div className="space-y-3">
                      {group.options?.map((option) => (
                        <label
                          key={option._id}
                          className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cafe-50 transition"
                        >
                          <input
                            type="checkbox"
                            checked={
                              selections[group._id]?.includes(option._id) ||
                              false
                            }
                            onChange={(e) => {
                              const current = selections[group._id] || [];
                              if (e.target.checked) {
                                setSelections({
                                  ...selections,
                                  [group._id]: [...current, option._id],
                                });
                              } else {
                                setSelections({
                                  ...selections,
                                  [group._id]: current.filter(
                                    (id) => id !== option._id
                                  ),
                                });
                              }
                            }}
                            className="h-5 w-5 rounded border-cafe-300 text-cafe-400 focus:ring-cafe-400 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="text-base font-medium text-ink-900">
                              {option.name}
                            </span>
                            {option.extraPrice > 0 && (
                              <span className="ml-2 text-sm font-semibold text-cafe-600">
                                +£{option.extraPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    // Single selection - Radio Buttons
                    <div className="space-y-3">
                      {group.options?.map((option) => (
                        <label
                          key={option._id}
                          className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-cafe-50 transition"
                        >
                          <input
                            type="radio"
                            name={group._id}
                            checked={
                              selections[group._id] === option._id
                            }
                            onChange={() => {
                              setSelections({
                                ...selections,
                                [group._id]: option._id,
                              });
                            }}
                            className="h-5 w-5 border-cafe-300 text-cafe-400 focus:ring-cafe-400 cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="text-base font-medium text-ink-900">
                              {option.name}
                            </span>
                            {option.extraPrice > 0 && (
                              <span className="ml-2 text-sm font-semibold text-cafe-600">
                                +£{option.extraPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-ink-700 py-8 text-base">
              No customizations available
            </p>
          )}
        </div>

        {/* Price Display */}
        <div className="border-t border-cafe-100 bg-linear-to-t from-cream to-white px-6 py-6 sm:px-8">
          <div className="space-y-3 mb-6">
            {/* Discount Badge */}
            {priceData.discountAmount > 0 && badgeText && (
              <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <span className="text-xs font-bold uppercase text-red-600 tracking-wider">
                  {badgeText}
                </span>
                <span className="text-xs font-bold text-green-600">
                  Save £{priceData.discountAmount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Original Price (if discount) */}
            {priceData.discountAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  Original Price
                </span>
                <span className="font-display text-base font-semibold text-gray-500 line-through">
                  £{priceData.originalPrice.toFixed(2)}
                </span>
              </div>
            )}

            {/* Base Price (after discount) */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-ink-700">
                {priceData.discountAmount > 0 ? "Discounted Price" : "Base Price"}
              </span>
              <span
                className={`font-display text-lg font-semibold ${
                  priceData.discountAmount > 0 ? "text-cafe-600" : "text-ink-900"
                }`}
              >
                £{priceData.finalPrice.toFixed(2)}
              </span>
            </div>

            {/* Customizations */}
            {customizationPrice > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-ink-700">
                  Customizations
                </span>
                <span className="font-display text-lg font-semibold text-cafe-600">
                  +£{customizationPrice.toFixed(2)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-cafe-200 pt-3 flex justify-between items-center bg-cafe-50/50 -mx-2 px-2 py-3 rounded-lg">
              <span className="font-display text-lg font-bold text-ink-900">
                Total
              </span>
              <span className="font-display text-2xl font-bold text-cafe-600">
                £{finalPrice}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary flex-1 py-3.5 font-semibold text-base shadow-cafe hover:shadow-cafe-lg"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add to cart - £{finalPrice}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border-2 border-cafe-300 bg-white px-4 py-3.5 font-semibold text-cafe-800 hover:bg-cafe-50 hover:border-cafe-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
