/* eslint-disable no-console */
const fs = require("fs");

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function write(path, contents) {
  fs.writeFileSync(path, contents, "utf8");
}

function ensureIncludes(path, needle) {
  const s = read(path);
  if (!s.includes(needle)) {
    throw new Error(`Expected to find needle in ${path}: ${needle}`);
  }
}

function update(path, transform) {
  const before = read(path);
  const after = transform(before);
  if (after === before) {
    console.log("no changes:", path);
    return;
  }
  write(path, after);
  console.log("updated:", path);
}

update("resources/pos/src/frontend/components/PosMainPage.js", (s) => {
  if (!s.includes('import useMediaQuery from "../shared/useMediaQuery";')) {
    const anchor = 'import PaymentSlipModal from "./paymentSlipModal/PaymentSlipModal";';
    ensureIncludes("resources/pos/src/frontend/components/PosMainPage.js", anchor);
    s = s.replace(anchor, `${anchor}\nimport useMediaQuery from "../shared/useMediaQuery";`);
  }

  if (!s.includes('const isLgDown = useMediaQuery("(max-width: 991.98px)");')) {
    const anchor = "const navigate = useNavigate();";
    ensureIncludes("resources/pos/src/frontend/components/PosMainPage.js", anchor);
    s = s.replace(anchor, `${anchor}\n    const isLgDown = useMediaQuery(\"(max-width: 991.98px)\");`);
  }

  s = s.replace(
    '<Container className="pos-screen px-2 px-sm-3" fluid>',
    '<Container className={`pos-screen px-2 px-sm-3 ${isLgDown ? "pos-screen--mobile" : ""}`} fluid>'
  );

  // add row class (first render row)
  s = s.replace("\n            <Row>\n", "\n            <Row className=\"pos-main-row\">\n");

  // cart column class
  s = s.replace(
    'className="pos-left-scs order-2 order-lg-1"',
    'className="pos-left-scs pos-cart-col order-2 order-lg-1"'
  );

  // wrap first PosHeader (cart side) with conditional
  if (!s.includes("{!isLgDown && (") && s.includes("<PosHeader")) {
    s = s.replace(
      /\n(\s*)<PosHeader([\s\S]*?)\/>\n/, 
      (m, indent, rest) => `\n${indent}{!isLgDown && (\n${indent}    <PosHeader${rest}/>\n${indent})}\n`
    );
  }

  // cart panel classes
  s = s.replace(
    '<div className="left-content custom-card mb-3 p-3">',
    '<div className={`left-content custom-card p-3 pos-cart-panel ${isLgDown ? "mb-0" : "mb-3"}`}>'
  );

  s = s.replace(
    '<div className="main-table overflow-auto">',
    '<div className="main-table pos-cart-items">'
  );

  s = s.replace(
    '<Table className="mb-0">',
    '<Table className="mb-0 pos-cart-table">'
  );

  // insert PosHeader on the right side (mobile)
  if (!s.includes("isLgDown && (\n                                <PosHeader")) {
    const marker = "<ProductSearchbar";
    const insertAt = s.indexOf(marker);
    if (insertAt !== -1) {
      const snippet =
        "{isLgDown && (\n" +
        "                                <PosHeader\n" +
        "                                    setSelectedCustomerOption={\n" +
        "                                        setSelectedCustomerOption\n" +
        "                                    }\n" +
        "                                    selectedCustomerOption={\n" +
        "                                        selectedCustomerOption\n" +
        "                                    }\n" +
        "                                    setSelectedOption={setSelectedOption}\n" +
        "                                    selectedOption={selectedOption}\n" +
        "                                    customerModel={customerModel}\n" +
        "                                    updateCustomer={modalShowCustomer}\n" +
        "                                />\n" +
        "                            )}\n";

      s = s.replace("                            <ProductSearchbar", `                            ${snippet}                            <ProductSearchbar`);
    }
  }

  return s;
});

update("resources/pos/src/frontend/components/cart-product/CartItemMainCalculation.js", (s) => {
  return s.replace('className="calculation mt-5"', 'className="calculation mt-5 pos-cart-totals"');
});

update("resources/pos/src/frontend/components/cart-product/PaymentButton.js", (s) => {
  s = s.replace(
    'className="d-flex align-items-center justify-content-between"',
    'className="d-flex align-items-center justify-content-between pos-payment-actions"'
  );

  s = s.replace(
    /\{getFormattedMessage\(\"pos\.hold-list-btn\.title\"\)\}\{\" \"\}/,
    '{/* text hidden on xs */}<span className="d-none d-sm-inline">{getFormattedMessage("pos.hold-list-btn.title")} </span>'
  );

  s = s.replace(
    /\{getFormattedMessage\(\"date-picker\.filter\.reset\.label\"\)\}\{\" \"\}/,
    '{/* text hidden on xs */}<span className="d-none d-sm-inline">{getFormattedMessage("date-picker.filter.reset.label")} </span>'
  );

  return s;
});

function appendCss(path) {
  update(path, (s) => {
    if (s.includes(".pos-screen--mobile .pos-cart-col")) return s;
    return (
      s +
      "\n\n/* POS mobile bottom-sheet cart */\n" +
      ".pos-screen--mobile .pos-right-scs {\n" +
      "    padding-bottom: calc(52vh + 16px + env(safe-area-inset-bottom, 0px));\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-col {\n" +
      "    position: fixed;\n" +
      "    left: 0;\n" +
      "    right: 0;\n" +
      "    bottom: 0;\n" +
      "    height: calc(52vh + env(safe-area-inset-bottom, 0px));\n" +
      "    z-index: 1020;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-panel {\n" +
      "    height: 52vh;\n" +
      "    display: flex;\n" +
      "    flex-direction: column;\n" +
      "    border-top-left-radius: 16px;\n" +
      "    border-top-right-radius: 16px;\n" +
      "    box-shadow: 0 -12px 32px rgba(0, 0, 0, 0.14);\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-items {\n" +
      "    flex: 1 1 auto;\n" +
      "    overflow: auto;\n" +
      "    -webkit-overflow-scrolling: touch;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-table th,\n" +
      ".pos-screen--mobile .pos-cart-table td {\n" +
      "    padding: 0.35rem 0.4rem;\n" +
      "    font-size: 0.9rem;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-table thead th:nth-child(3),\n" +
      ".pos-screen--mobile .pos-cart-table tbody td:nth-child(3) {\n" +
      "    display: none;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-table .product-name {\n" +
      "    font-size: 0.95rem;\n" +
      "    line-height: 1.2;\n" +
      "    margin-bottom: 2px;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-table .product-sku {\n" +
      "    display: none;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-custom-qty .btn {\n" +
      "    width: 32px;\n" +
      "    height: 32px;\n" +
      "    padding: 0;\n" +
      "    border-radius: 10px;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-custom-qty input {\n" +
      "    width: 56px;\n" +
      "    font-size: 0.95rem;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-totals {\n" +
      "    margin-top: 0.5rem !important;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-totals .fs-3 {\n" +
      "    font-size: 0.95rem !important;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-cart-totals .fs-1 {\n" +
      "    font-size: 1.15rem !important;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-payment-actions {\n" +
      "    gap: 8px;\n" +
      "    flex-wrap: wrap;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-payment-actions .pos-pay-btn {\n" +
      "    flex: 1 0 100%;\n" +
      "    order: 3;\n" +
      "    padding-top: 0.6rem !important;\n" +
      "    padding-bottom: 0.6rem !important;\n" +
      "}\n\n" +
      ".pos-screen--mobile .pos-payment-actions .bg-btn-pink,\n" +
      ".pos-screen--mobile .pos-payment-actions .btn-danger {\n" +
      "    flex: 1 1 0;\n" +
      "    order: 1;\n" +
      "    padding-top: 0.5rem !important;\n" +
      "    padding-bottom: 0.5rem !important;\n" +
      "}\n"
    );
  });
}

appendCss("resources/pos/src/assets/css/mobile.css");
appendCss("resources/pos/src/assets/css/mobile.rtl.css");
