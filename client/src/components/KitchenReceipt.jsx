import { forwardRef } from "react";

const KitchenReceipt = forwardRef(({ order }, ref) => {
  if (!order) return null;

  return (
    <div
      ref={ref}
      style={{
        width: "80mm",
        maxWidth: "220px",
        padding: "8px",
        fontFamily: "monospace",
        background: "white",
        color: "black",
        fontSize: "12px",
        lineHeight: "1.3",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "13px" }}>KITCHEN</h3>
        <p style={{ margin: "2px 0", fontSize: "10px" }}>
          {order.createdAt ? new Date(order.createdAt).toLocaleString("en-US", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) : ""}
        </p>
      </div>

      <hr />

      {/* ORDER INFO */}
      <div style={{ marginBottom: 8, fontSize: "11px" }}>
        <p style={{ margin: "2px 0" }}>
          <b>Customer:</b> {order.customerName}
        </p>

        <p style={{ margin: "2px 0" }}>
          <b>Type:</b> {order.orderType}
        </p>

        {order.address && (
          <p style={{ margin: "2px 0", wordBreak: "break-word" }}>
            <b>Addr:</b> {order.address.substring(0, 35)}
          </p>
        )}
      </div>

      <hr />

      {/* ITEMS */}
      <div>
        {order.items.map((item, i) => (
          <div
            key={`${item.productId}-${i}-${item.customizations ? JSON.stringify(item.customizations) : 'base'}`}
            style={{
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: "1px dashed #ccc",
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                fontSize: "13px",
                marginBottom: "4px",
              }}
            >
              {item.quantity}x {item.name}
            </div>

            {/* CUSTOMIZATIONS */}
            {item.customizations &&
              Object.keys(item.customizations).length > 0 && (
                <div
                  style={{
                    marginLeft: 12,
                    fontSize: "11px",
                    color: "#333",
                  }}
                >
                  {Object.values(item.customizations).map((custom, idx) => {
                    const hasDealSelection = custom.dealOptionName;
                    const label = hasDealSelection
                      ? `${custom.optionName} - ${custom.dealOptionName}`
                      : custom.optionName;

                    const extraPrice = (custom.extraPrice || 0) + (custom.dealExtraPrice || 0);
                    const priceSuffix = extraPrice > 0 ? ` (+£${extraPrice.toFixed(2)})` : "";

                    return (
                      <div key={`custom-${idx}`} style={{ margin: "2px 0" }}>
                        • {label}
                        {priceSuffix}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        ))}
      </div>

      {/* NOTES */}
      {order.extraNotes && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <div style={{ fontSize: "11px", marginBottom: 8 }}>
            <b>Notes:</b>
            <p style={{ margin: "4px 0" }}>{order.extraNotes.substring(0, 60)}</p>
          </div>
        </>
      )}

      <hr style={{ margin: "6px 0", borderTop: "2px solid #000" }} />

      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          fontWeight: "bold",
          fontSize: "12px",
          padding: "6px",
        }}
      >
        PREPARE ORDER
      </div>
    </div>
  );
});

KitchenReceipt.displayName = "KitchenReceipt";

export default KitchenReceipt;