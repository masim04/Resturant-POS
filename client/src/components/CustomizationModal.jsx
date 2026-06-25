import { useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function CustomizationModal({ product, isOpen, onClose, onConfirm }) {
  const [selections, setSelections] = useState({});

  const customizationPrice = useMemo(() => {
    let total = 0;
    if (product?.customizationGroups) {
      product.customizationGroups.forEach((group) => {
        if (group.multiSelect && selections[group._id]) {
          selections[group._id].forEach((optId) => {
            const option = group.options?.find((o) => o._id === optId);
            if (option) {
              total += option.extraPrice || 0;
              if (option.isDeal && selections[`${group._id}-${option._id}`]) {
                const dealOption = option.dealOptions?.find((o) => o._id === selections[`${group._id}-${option._id}`]);
                if (dealOption) total += dealOption.extraPrice || 0;
              }
            }
          });
        } else if (!group.multiSelect && selections[group._id]) {
          const option = group.options?.find((o) => o._id === selections[group._id]);
          if (option) {
            total += option.extraPrice || 0;
            if (option.isDeal && selections[`${group._id}-${option._id}`]) {
              const dealOption = option.dealOptions?.find((o) => o._id === selections[`${group._id}-${option._id}`]);
              if (dealOption) total += dealOption.extraPrice || 0;
            }
          }
        }
      });
    }
    return total;
  }, [selections, product]);

  const finalPrice = (parseFloat(product?.price || 0) + customizationPrice).toFixed(2);

  const handleSave = () => {
    // Validate required groups
    if (product?.customizationGroups) {
      for (const group of product.customizationGroups) {
        if (group.required && !selections[group._id]) {
          toast.error(`Please select ${group.title}`);
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
                const dealSelection = option.isDeal ? selections[`${group._id}-${optionId}`] : null;
                const dealOption = dealSelection
                  ? option.dealOptions?.find((o) => o._id === dealSelection)
                  : null;

                customizationDetails[`${group._id}-${idx}`] = {
                  groupTitle: group.title,
                  optionName: option.name,
                  extraPrice: option.extraPrice || 0,
                  dealOptionName: dealOption?.name || null,
                  dealExtraPrice: dealOption?.extraPrice || 0,
                };
              }
            });
          } else {
            // For single select
            const option = group.options?.find((o) => o._id === selections[group._id]);
            if (option) {
              const dealSelection = option.isDeal ? selections[`${group._id}-${option._id}`] : null;
              const dealOption = dealSelection
                ? option.dealOptions?.find((o) => o._id === dealSelection)
                : null;

              customizationDetails[group._id] = {
                groupTitle: group.title,
                optionName: option.name,
                extraPrice: option.extraPrice || 0,
                dealOptionName: dealOption?.name || null,
                dealExtraPrice: dealOption?.extraPrice || 0,
              };
            }
          }
        }
      });
    }

    onConfirm(customizationDetails, customizationPrice, product);
    setSelections({});
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg max-h-full overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-2xl font-bold text-pos-text">{product.name}</h2>
          <button
            onClick={onClose}
            aria-label="Close customization modal"
            className="ml-4 rounded-full p-1 text-pos-muted hover:bg-pos-bg hover:text-pos-text focus:outline-none focus:ring-2 focus:ring-pos-orange"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {/* Customization Groups */}
        {product.customizationGroups && product.customizationGroups.length > 0 ? (
          <div className="space-y-4 mb-6">
            {product.customizationGroups.map((group) => (
              <div key={group._id} className="p-3 border border-pos-border rounded-lg bg-pos-bg">
                <h3 className="font-semibold text-pos-text mb-2">
                  {group.title}
                  {group.required && <span className="text-red-500 ml-1">*</span>}
                </h3>

                {group.multiSelect ? (
                  // Multiple selection
                  <div className="space-y-2">
                    {group.options?.map((option) => (
                      <div key={option._id} className="rounded-lg border border-pos-border bg-white p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selections[group._id]?.includes(option._id) || false}
                            onChange={(e) => {
                              const current = selections[group._id] || [];
                              const nextSelections = { ...selections };
                              if (e.target.checked) {
                                nextSelections[group._id] = [...current, option._id];
                              } else {
                                nextSelections[group._id] = current.filter((id) => id !== option._id);
                                delete nextSelections[`${group._id}-${option._id}`];
                              }
                              setSelections(nextSelections);
                            }}
                          />
                          <span className="text-sm text-pos-text">
                            {option.name}
                            {option.extraPrice > 0 && (
                              <span className="text-pos-muted"> +£{option.extraPrice.toFixed(2)}</span>
                            )}
                          </span>
                        </label>
                        {option.isDeal && selections[group._id]?.includes(option._id) && (
                          <div className="mt-3 ml-6 space-y-2">
                            {option.dealOptions?.map((dealOption) => (
                              <label key={dealOption._id} className="flex items-center gap-2 text-sm">
                                <input
                                  type="radio"
                                  name={`${group._id}-${option._id}`}
                                  checked={selections[`${group._id}-${option._id}`] === dealOption._id}
                                  onChange={() =>
                                    setSelections({
                                      ...selections,
                                      [`${group._id}-${option._id}`]: dealOption._id,
                                    })
                                  }
                                />
                                <span>{dealOption.name}</span>
                                {dealOption.extraPrice > 0 && (
                                  <span className="text-pos-orange">+£{dealOption.extraPrice.toFixed(2)}</span>
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single selection
                  <div className="space-y-2">
                    {group.options?.map((option) => (
                      <div key={option._id} className="rounded-lg border border-pos-border bg-white p-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={group._id}
                            checked={selections[group._id] === option._id}
                            onChange={() => {
                              const nextSelections = { ...selections };
                              nextSelections[group._id] = option._id;
                              delete nextSelections[`${group._id}-${option._id}`];
                              setSelections(nextSelections);
                            }}
                          />
                          <span className="text-sm text-pos-text">
                            {option.name}
                            {option.extraPrice > 0 && (
                              <span className="text-pos-muted"> +£{option.extraPrice.toFixed(2)}</span>
                            )}
                          </span>
                        </label>
                        {option.isDeal && selections[group._id] === option._id && (
                          <div className="mt-3 ml-6 space-y-2">
                            {option.dealOptions?.map((dealOption) => (
                              <label key={dealOption._id} className="flex items-center gap-2 text-sm">
                                <input
                                  type="radio"
                                  name={`${group._id}-${option._id}`}
                                  checked={selections[`${group._id}-${option._id}`] === dealOption._id}
                                  onChange={() =>
                                    setSelections({
                                      ...selections,
                                      [`${group._id}-${option._id}`]: dealOption._id,
                                    })
                                  }
                                />
                                <span>{dealOption.name}</span>
                                {dealOption.extraPrice > 0 && (
                                  <span className="text-pos-orange">+£{dealOption.extraPrice.toFixed(2)}</span>
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-pos-muted text-sm mb-6">No customizations available</p>
        )}

        {/* Price Display */}
        <div className="border-t border-pos-border pt-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-pos-text">Base Price:</span>
            <span className="font-semibold text-pos-text">£{product.price?.toFixed(2)}</span>
          </div>
          {customizationPrice > 0 && (
            <div className="flex justify-between mb-2">
              <span className="text-pos-text">Customizations:</span>
              <span className="font-semibold text-pos-orange">+£{customizationPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg">
            <span className="font-bold text-pos-text">Total:</span>
            <span className="font-bold text-pos-orange">£{finalPrice}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-md bg-pos-orange px-4 py-2 font-semibold text-white hover:bg-pos-orange-hover"
          >
            Add to Cart - £{finalPrice}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-pos-border bg-white px-4 py-2 font-semibold text-pos-text hover:bg-pos-bg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
