/* eslint-disable no-console */
const fs = require("fs");

function fix(path) {
    let s = fs.readFileSync(path, "utf8");
    const start = s.indexOf("/* Keep Pay button visible: only items scroll */");

    if (start !== -1) {
        s = s.slice(0, start).trimEnd();
    }

    const final = `

/* Mobile cart scroll: keep totals + Pay always visible */
.pos-screen--mobile .pos-cart-panel {
    overflow: hidden;
    min-height: 0;
}

.pos-screen--mobile .pos-cart-items {
    flex: 1 1 0;
    min-height: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

.pos-screen--mobile .pos-cart-totals,
.pos-screen--mobile .pos-payment-actions {
    flex: 0 0 auto;
}

.pos-screen--mobile .pos-payment-actions {
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
}`;

    if (!s.includes("Mobile cart scroll: keep totals + Pay always visible")) {
        s += final;
    }

    fs.writeFileSync(path, s + "\n", "utf8");
    console.log("fixed:", path);
}

fix("resources/pos/src/assets/css/mobile.css");
fix("resources/pos/src/assets/css/mobile.rtl.css");
