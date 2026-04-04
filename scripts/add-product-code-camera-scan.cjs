/* eslint-disable no-console */
const fs = require("fs");

const path = "resources/pos/src/components/product/ProductForm.js";
let s = fs.readFileSync(path, "utf8");

function ensure(cond, msg) {
    if (!cond) throw new Error(msg);
}

// import
if (!s.includes("CameraBarcodeScannerModal")) {
    const anchor = 'import { toUpper } from "lodash";';
    ensure(s.includes(anchor), "import anchor not found");
    s = s.replace(
        anchor,
        `${anchor}\nimport CameraBarcodeScannerModal from "../../frontend/shared/CameraBarcodeScannerModal";`
    );
}

// state
if (!s.includes("showCodeScanner")) {
    const anchor = "const [errors, setErrors] = useState({});";
    ensure(s.includes(anchor), "errors state anchor not found");
    s = s.replace(
        anchor,
        `${anchor}\n    const [showCodeScanner, setShowCodeScanner] = useState(false);`
    );
}

// handler
if (!s.includes("onDetectedProductCode")) {
    const anchor = "const onChangeInput = (e) => {";
    ensure(s.includes(anchor), "onChangeInput anchor not found");

    // insert after onChangeInput function block end: find the first occurrence of "setErrors({});\n    };" after anchor
    const startIdx = s.indexOf(anchor);
    const endNeedle = "setErrors({});\n    };";
    const endIdx = s.indexOf(endNeedle, startIdx);
    ensure(endIdx !== -1, "onChangeInput end needle not found");

    const insertPos = endIdx + endNeedle.length;
    const insert = `\n\n    const onDetectedProductCode = (value) => {\n        const clean = (value || \"\").trim();\n        if (!clean) return;\n        setProductValue((prev) => ({ ...prev, code: clean }));\n        setErrors({});\n        setShowCodeScanner(false);\n    };`;

    s = s.slice(0, insertPos) + insert + s.slice(insertPos);
}

// JSX: wrap code input with InputGroup + camera button
if (!s.includes("product-code-scan-btn")) {
    const re = /<span className="required" \/>\s*\n\s*<input\s*\n\s*type="text"\s*\n\s*name="code"([\s\S]*?)\/>/m;
    const m = s.match(re);
    ensure(m, "code input block not found");

    const inputBlock = m[0];
    // Extract current input element (including props) so we keep className/errors bindings
    const inputRe = /<input[\s\S]*?name="code"[\s\S]*?\/>/m;
    const inputMatch = inputBlock.match(inputRe);
    ensure(inputMatch, "input element not found");

    const inputEl = inputMatch[0];

    const replacement = `<span className="required" />\n                                        <InputGroup className="flex-nowrap">\n                                            ${inputEl}\n                                            <Button\n                                                type="button"\n                                                variant="outline-secondary"\n                                                className="product-code-scan-btn"\n                                                onClick={() => setShowCodeScanner(true)}\n                                            >\n                                                <i className="bi bi-camera" />\n                                            </Button>\n                                        </InputGroup>`;

    s = s.replace(inputBlock, replacement);
}

// Add modal near bottom (inside card, after UnitsForm)
if (!s.includes("title=\"Scan barcode\"")) {
    const anchor = "            {unitModel && (";
    ensure(s.includes(anchor), "UnitsForm anchor not found");

    // Insert after UnitsForm conditional block end: locate the closing "            )}\n        </div>" nearest after anchor
    const idx = s.indexOf(anchor);
    const afterIdx = s.indexOf("            )}", idx);
    ensure(afterIdx !== -1, "UnitsForm close not found");

    const insertPos = afterIdx + "            )}".length;

    const modal = `\n            <CameraBarcodeScannerModal\n                show={showCodeScanner}\n                onHide={() => setShowCodeScanner(false)}\n                onDetected={onDetectedProductCode}\n                title=\"Scan barcode\"\n            />`;

    s = s.slice(0, insertPos) + modal + s.slice(insertPos);
}

fs.writeFileSync(path, s, "utf8");
console.log("updated:", path);
