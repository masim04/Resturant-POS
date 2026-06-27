import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Receipt from "../components/Receipt";
import KitchenReceipt from "../components/KitchenReceipt";

function buildPrintDocument(bodyHtml, title) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      @media print {
        @page {
          margin: 4mm;
        }
      }
      html, body {
        margin: 0;
        padding: 8px;
        background: #fff;
        color: #000;
        font-family: monospace;
      }
    </style>
  </head>
  <body>${bodyHtml}</body>
</html>`;
}

function printHtml(bodyHtml, title) {
  return new Promise((resolve, reject) => {
    const content = bodyHtml?.trim();
    if (!content) {
      reject(new Error("Receipt content is empty"));
      return;
    }

    const printWindow = window.open("", "_blank", "width=360,height=640");
    if (!printWindow) {
      reject(new Error("Popup blocked. Allow popups for this site to print receipts."));
      return;
    }

    const doc = printWindow.document;
    doc.open();
    doc.write(buildPrintDocument(content, title));
    doc.close();

    const triggerPrint = () => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (error) {
        printWindow.close();
        reject(error);
        return;
      }

      const finish = () => {
        if (!printWindow.closed) {
          printWindow.close();
        }
        resolve();
      };

      printWindow.onafterprint = finish;
      window.setTimeout(finish, 2000);
    };

    if (printWindow.document.readyState === "complete") {
      window.setTimeout(triggerPrint, 250);
    } else {
      printWindow.onload = () => window.setTimeout(triggerPrint, 250);
    }
  });
}

function printComponent(Component, props, title) {
  const html = renderToStaticMarkup(createElement(Component, props));
  if (!html?.trim()) {
    return Promise.reject(new Error(`Failed to render ${title}`));
  }
  return printHtml(html, title);
}

export async function printOrderReceipts(order) {
  if (!order?.items?.length) {
    throw new Error("Order has no items to print");
  }

  const kitchenHtml = renderToStaticMarkup(
    createElement(KitchenReceipt, { order }),
  );
  const receiptHtml = renderToStaticMarkup(createElement(Receipt, { order }));

  if (!kitchenHtml?.trim() || !receiptHtml?.trim()) {
    throw new Error("Failed to render receipt documents");
  }

  const combinedHtml = `
    <div style="page-break-after: always;">${kitchenHtml}</div>
    <div>${receiptHtml}</div>
  `;

  return printHtml(combinedHtml, "Cafe Rubab - Receipts");
}
