/* eslint-disable no-console */
const fs = require("fs");

function rewrite(path) {
    let s = fs.readFileSync(path, "utf8");
    const marker = "/* POS mobile bottom-sheet cart */";
    const idx = s.indexOf(marker);
    if (idx === -1) {
        throw new Error(`Marker not found in ${path}`);
    }

    s = s.slice(0, idx).trimEnd();

    const block = `

${marker}
:root {
    --pos-cart-height: 52vh;
}

.pos-screen--mobile .pos-right-scs {
    padding-bottom: calc(var(--pos-cart-height) + 16px + env(safe-area-inset-bottom, 0px));
}

.pos-screen--mobile .pos-cart-col {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(var(--pos-cart-height) + env(safe-area-inset-bottom, 0px));
    z-index: 1020;
}

.pos-screen--mobile .pos-cart-panel {
    height: var(--pos-cart-height) !important;
    max-height: var(--pos-cart-height) !important;
    display: flex !important;
    flex-direction: column;
    overflow: hidden !important;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    box-shadow: 0 -12px 32px rgba(0, 0, 0, 0.14);
}

/* Ensure legacy table sizing doesn't break flex layout */
.pos-screen--mobile .pos-cart-panel .main-table {
    min-height: 0 !important;
    max-height: none !important;
    height: auto !important;
}

/* Only the items list scrolls */
.pos-screen--mobile .pos-cart-items {
    flex: 1 1 0;
    min-height: 0 !important;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

.pos-screen--mobile .pos-cart-table th,
.pos-screen--mobile .pos-cart-table td {
    padding: 0.35rem 0.4rem;
    font-size: 0.9rem;
}

.pos-screen--mobile .pos-cart-table thead th:nth-child(3),
.pos-screen--mobile .pos-cart-table tbody td:nth-child(3) {
    display: none;
}

.pos-screen--mobile .pos-cart-table .product-name {
    font-size: 0.95rem;
    line-height: 1.2;
    margin-bottom: 2px;
}

.pos-screen--mobile .pos-cart-table .product-sku {
    display: none;
}

.pos-screen--mobile .pos-custom-qty .btn {
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 10px;
}

.pos-screen--mobile .pos-custom-qty input {
    width: 56px;
    font-size: 0.95rem;
}

.pos-screen--mobile .pos-cart-totals {
    margin-top: 0.5rem !important;
    flex: 0 0 auto;
}

.pos-screen--mobile .pos-cart-totals .fs-3 {
    font-size: 0.95rem !important;
}

.pos-screen--mobile .pos-cart-totals .fs-1 {
    font-size: 1.15rem !important;
}

.pos-screen--mobile .pos-payment-actions {
    flex: 0 0 auto;
    gap: 8px;
    flex-wrap: wrap;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
}

.pos-screen--mobile .pos-payment-actions .pos-pay-btn {
    flex: 1 0 100%;
    order: 3;
    padding-top: 0.6rem !important;
    padding-bottom: 0.6rem !important;
}

.pos-screen--mobile .pos-payment-actions .bg-btn-pink,
.pos-screen--mobile .pos-payment-actions .btn-danger {
    flex: 1 1 0;
    order: 1;
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
}`;

    fs.writeFileSync(path, s + block + "\n", "utf8");
    console.log("rewrote:", path);
}

rewrite("resources/pos/src/assets/css/mobile.css");
rewrite("resources/pos/src/assets/css/mobile.rtl.css");
