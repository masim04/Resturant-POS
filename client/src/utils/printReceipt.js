import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Receipt from "../components/Receipt";
import KitchenReceipt from "../components/KitchenReceipt";

function printHtml(bodyHtml, title) {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute(
      "style",
      "position:fixed;right:0;bottom:0;width:0;height:0;border:0;",
    );
    document.body.appendChild(iframe);

    const win = iframe.contentWindow;
    const doc = win?.document;

    if (!win || !doc) {
      iframe.remove();
      reject(new Error("Print iframe could not be created"));
      return;
    }

    const cleanup = () => {
      iframe.remove();
    };

    const doPrint = () => {
      try {
        win.focus();
        win.print();
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        window.setTimeout(cleanup, 1000);
      }
    };

    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      @page { size: 80mm auto; margin: 4mm; }
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        color: #000;
      }
    </style>
  </head>
  <body>${bodyHtml}</body>
</html>`);
    doc.close();

    window.setTimeout(doPrint, 300);
  });
}

function printComponent(Component, props, title) {
  const html = renderToStaticMarkup(createElement(Component, props));
  return printHtml(html, title);
}

export async function printOrderReceipts(order) {
  if (!order) return;

  await printComponent(KitchenReceipt, { order }, "Cafe Rubab - Kitchen");
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  await printComponent(Receipt, { order }, "Cafe Rubab - Receipt");
}
