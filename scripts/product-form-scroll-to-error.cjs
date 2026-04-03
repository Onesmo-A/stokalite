/* eslint-disable no-console */
const fs = require("fs");

const path = "resources/pos/src/components/product/ProductForm.js";
let s = fs.readFileSync(path, "utf8");

function mustInclude(needle) {
  if (!s.includes(needle)) {
    throw new Error(`Missing expected text: ${needle}`);
  }
}

// 1) Inject scrollToFirstError helper (once)
if (!s.includes("const scrollToFirstError")) {
  mustInclude("const handleValidation = () => {");
  s = s.replace(
    "const handleValidation = () => {",
    `const scrollToFirstError = (errs) => {
        try {
            const keys = Object.keys(errs || {});
            if (!keys.length) return;
            const key = keys[0];

            const direct = document.querySelector(\`[name=\"\${key}\"]\`);
            const field =
                direct ||
                document.querySelector(\`[data-field=\"\${key}\"]\`) ||
                document.getElementById(\`field-\${key}\`);

            if (!field) return;

            field.scrollIntoView({ behavior: "smooth", block: "center" });
            const focusTarget =
                field.matches?.("input,select,textarea")
                    ? field
                    : field.querySelector?.(
                          "input,select,textarea,button,[tabindex]:not([tabindex='-1'])"
                      );
            focusTarget?.focus?.({ preventScroll: true });
        } catch (e) {
            // ignore
        }
    };

    const handleValidation = () => {`
  );
}

// 2) Call scroll when invalid
if (!s.includes("scrollToFirstError(errorss)")) {
  mustInclude("setErrors(errorss);");
  s = s.replace(
    "        setErrors(errorss);\n        return isValid;",
    "        setErrors(errorss);\n        if (!isValid && Object.keys(errorss).length) {\n            scrollToFirstError(errorss);\n        }\n        return isValid;"
  );
}

// 3) Add ids/data-field wrappers for selects used in validation
const wrapMap = [
  [
    '    <div className="col-md-6 mb-3">\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.input.product-category.label"',
    '    <div className="col-md-6 mb-3" id="field-product_category_id" data-field="product_category_id">\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.input.product-category.label"'
  ],
  [
    '    <div className="col-md-6 mb-3">\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.input.brand.label"',
    '    <div className="col-md-6 mb-3" id="field-brand_id" data-field="brand_id">\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.input.brand.label"'
  ],
  [
    '    <div className="col-md-6 mb-3">\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.input.barcode-symbology.label"',
    '    <div className="col-md-6 mb-3" id="field-barcode_symbol" data-field="barcode_symbol">\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.input.barcode-symbology.label"'
  ],
  [
    '    <div className="col-md-6 mb-3">\n                                        <InputGroup className="flex-nowrap dropdown-side-btn">',
    '    <div className="col-md-6 mb-3" id="field-product_unit" data-field="product_unit">\n                                        <InputGroup className="flex-nowrap dropdown-side-btn">'
  ],
  [
    '    <div className="col-md-6 mb-3">\n                                        <ReactSelect\n                                            className="position-relative"\n                                            title={getFormattedMessage(\n                                                "product.input.sale-unit.label"',
    '    <div className="col-md-6 mb-3" id="field-sale_unit" data-field="sale_unit">\n                                        <ReactSelect\n                                            className="position-relative"\n                                            title={getFormattedMessage(\n                                                "product.input.sale-unit.label"'
  ],
  [
    '    <div className="col-md-6 mb-3">\n                                        <ReactSelect\n                                            className="position-relative"\n                                            title={getFormattedMessage(\n                                                "product.input.purchase-unit.label"',
    '    <div className="col-md-6 mb-3" id="field-purchase_unit" data-field="purchase_unit">\n                                        <ReactSelect\n                                            className="position-relative"\n                                            title={getFormattedMessage(\n                                                "product.input.purchase-unit.label"'
  ],
  [
    '                                    <div className="col-md-12 mb-3">\n                                        <ReactSelect\n                                            data={warehouses}',
    '                                    <div className="col-md-12 mb-3" id="field-warehouse_id" data-field="warehouse_id">\n                                        <ReactSelect\n                                            data={warehouses}'
  ],
  [
    '                                    <div className="col-md-12 mb-3">\n                                        <ReactSelect\n                                            data={suppliers}',
    '                                    <div className="col-md-12 mb-3" id="field-supplier_id" data-field="supplier_id">\n                                        <ReactSelect\n                                            data={suppliers}'
  ],
  [
    '                                    <div className="col-md-12 mb-3">\n                                        <ReactSelect\n                                            multiLanguageOption={\n                                                statusFilterOptions',
    '                                    <div className="col-md-12 mb-3" id="field-status_id" data-field="status_id">\n                                        <ReactSelect\n                                            multiLanguageOption={\n                                                statusFilterOptions'
  ],
  [
    '                                <div className="col-md-4 mb-3">\n                                    {!singleProduct ?\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.type.label"',
    '                                <div className="col-md-4 mb-3" id="field-product_type" data-field="product_type">\n                                    {!singleProduct ?\n                                        <ReactSelect\n                                            title={getFormattedMessage(\n                                                "product.type.label"'
  ],
  [
    '                                            <div className="col-md-4 mb-3">\n                                                <ReactSelect\n                                                    title={getFormattedMessage(\n                                                        "variations.title"',
    '                                            <div className="col-md-4 mb-3" id="field-variation" data-field="variation">\n                                                <ReactSelect\n                                                    title={getFormattedMessage(\n                                                        "variations.title"'
  ],
  [
    '                                        <div className="col-md-4 mb-3">\n                                            <ReactMultiSelect\n                                                title={getFormattedMessage(\n                                                    "variation.variation_types"',
    '                                        <div className="col-md-4 mb-3" id="field-variation_type" data-field="variation_type">\n                                            <ReactMultiSelect\n                                                title={getFormattedMessage(\n                                                    "variation.variation_types"'
  ],
  [
    '                                <div className="col-md-3 mb-3">\n                                    <ReactSelect\n                                        title={getFormattedMessage(\n                                            "product.input.tax-type.label"',
    '                                <div className="col-md-3 mb-3" id="field-tax_type" data-field="tax_type">\n                                    <ReactSelect\n                                        title={getFormattedMessage(\n                                            "product.input.tax-type.label"'
  ]
];

for (const [from, to] of wrapMap) {
  if (s.includes(from)) {
    s = s.replace(from, to);
  }
}

// 4) Add is-invalid class to top required inputs
s = s.replace(
  'className="form-control"\n                                            autoFocus={true}',
  'className={`form-control ${errors["name"] ? "is-invalid" : ""}`}\n                                            autoFocus={true}'
);

s = s.replace(
  'name="code"\n                                            className=" form-control"',
  'name="code"\n                                            className={`form-control ${errors["code"] ? "is-invalid" : ""}`}'
);

fs.writeFileSync(path, s, "utf8");
console.log("updated:", path);
