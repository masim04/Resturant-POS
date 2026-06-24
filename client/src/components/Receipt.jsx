const Receipt = ({ order, ref }) => {
  if (!order) return null;

  // Calculate base subtotal WITHOUT discounts to detect actual discount
  const baseSubtotal = order.items.reduce((sum, item) => {
    return sum + (item.price + (item.customizationPrice || 0)) * item.quantity;
  }, 0);

  // Calculate subtotal WITH discounts applied
  const subtotal = order.items.reduce((sum, item) => {
    const originalTotal = (item.price + (item.customizationPrice || 0)) * item.quantity;
    const discountTotal = (item.discountAmount || 0) * item.quantity;
    const itemFinal = originalTotal - discountTotal;
    return sum + itemFinal;
  }, 0);

  // Detect if there's a discount by comparing order.total with expected
  const expectedTotalWithoutDiscount = baseSubtotal + (order.deliveryCharges || 0);
  const totalDiscount = expectedTotalWithoutDiscount - parseFloat(order.total);
  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        maxWidth: "220px",
        padding: "8px",
        fontFamily: "monospace",
        color: "black",
        background: "white",
        fontSize: "11px",
        lineHeight: "1.2",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "1px dashed #000",
          paddingBottom: 6,
          marginBottom: 8,
        }}
      >
        <h3 style={{ margin: "0 0 2px 0", fontSize: "13px" }}>Cafe Rubab</h3>
        <p style={{ margin: "2px 0", fontSize: "10px" }}>POS Receipt</p>
        <small style={{ fontSize: "9px" }}>Islamabad, Pakistan</small>
      </div>

      {/* ORDER INFO */}
      <div style={{ marginBottom: 8, fontSize: "10px" }}>
        <p style={{ margin: "2px 0" }}><b>Customer:</b> {order.customerName}</p>
        <p style={{ margin: "2px 0" }}>{order.phone}</p>
        <p style={{ margin: "2px 0" }}><b>Type:</b> {order.orderType}</p>

        {order.address && (
          <p style={{ margin: "2px 0" }}><b>Addr:</b> {order.address.substring(0, 30)}</p>
        )}

        <p style={{ margin: "2px 0" }}><b>Pay:</b> {order.paymentMethod}</p>
        <p style={{ margin: "2px 0" }}><b>Status:</b> {order.paymentStatus}</p>

        <p style={{ margin: "2px 0" }}>
          {order.createdAt ? new Date(order.createdAt).toLocaleString("en-US", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}
        </p>
      </div>

      <hr />

      {/* ITEMS */}
      <div>
        {order.items.map((item, i) => {
          // item.price is the BASE price (before discount)
          // item.discountAmount is the discount per item
          // item.customizationPrice is the extra price for customizations
          
          const customizationTotal = (item.customizationPrice || 0) * item.quantity;
          const discountTotal = (item.discountAmount || 0) * item.quantity;
          
          // Original = base + customizations
          const originalTotal = (item.price + (item.customizationPrice || 0)) * item.quantity;
          
          // Final = original - discount
          const itemFinalTotal = originalTotal - discountTotal;
          
          const hasDiscount = item.discountEnabled && (item.discountAmount || 0) > 0;
          
          return (
            <div key={`${item.productId}-${i}-${item.customizations ? JSON.stringify(item.customizations) : 'base'}`} style={{ marginBottom: 8, fontSize: "10px" }}>
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "2px",
                }}
              >
                {item.quantity}x {item.name}
              </div>

              {/* CUSTOMIZATIONS */}
              {item.customizations &&
                Object.keys(item.customizations).length > 0 && (
                  <div
                    style={{
                      marginLeft: 8,
                      marginBottom: 4,
                      fontSize: 9,
                      color: "#555",
                    }}
                  >
                    {Object.values(item.customizations).map(
                      (custom, idx) => (
                        <div key={`custom-${idx}`} style={{ margin: "1px 0" }}>
                          + {custom.groupTitle}: {custom.optionName}
                          {custom.extraPrice > 0 &&
                            ` (+£${custom.extraPrice})`}
                        </div>
                      ),
                    )}
                  </div>
                )}

              {hasDiscount && (
                <div style={{ marginLeft: 8, fontSize: 9, marginTop: 4, marginBottom: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#999" }}>
                    <span>Original</span>
                    <span>£{originalTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#d32f2f" }}>
                    <span>Discount</span>
                    <span>-£{discountTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* FINAL PRICE */}
              <div
                style={{
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: 11,
                  marginTop: "4px",
                  borderTop: hasDiscount ? "1px solid #ddd" : "none",
                  paddingTop: hasDiscount ? "2px" : "0",
                }}
              >
                £{itemFinalTotal.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      <hr style={{ margin: "6px 0" }} />

      {/* TOTALS */}
      <div style={{ marginTop: 6, fontSize: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "2px 0",
          }}
        >
          <span>Subtotal</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>

        {order.deliveryCharges > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "2px 0",
            }}
          >
            <span>Delivery</span>
            <span>£{order.deliveryCharges.toFixed(2)}</span>
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            fontWeight: "bold",
            fontSize: 12,
            borderTop: "1px dashed #000",
            paddingTop: 4,
          }}
        >
          <span>TOTAL</span>
          <span>£{order.total}</span>
        </div>
      </div>

      {/* NOTES */}
      {order.extraNotes && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <p style={{ margin: "4px 0", fontSize: "9px" }}>
            <b>Notes:</b> {order.extraNotes.substring(0, 60)}
          </p>
        </>
      )}

      {/* FOOTER */}
      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontSize: 9,
          color: "#666",
        }}
      >
        Thank you! ❤️
      </div>
    </div>
  );
};

export default Receipt;