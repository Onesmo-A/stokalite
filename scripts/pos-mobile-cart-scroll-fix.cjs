/* eslint-disable no-console */
const fs = require("fs");

function read(path) {
  return fs.readFileSync(path, "utf8");
}

function write(path, contents) {
  fs.writeFileSync(path, contents, "utf8");
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

function appendIfMissing(path, marker, block) {
  update(path, (s) => {
    if (s.includes(marker)) return s;
    return s + "\n\n" + block + "\n";
  });
}

const cssFix = `/* Keep Pay button visible: only items scroll */
.pos-screen--mobile .pos-cart-panel {
    min-height: 0;
    overflow: hidden;
}

.pos-screen--mobile .pos-cart-items {
    flex: 1 1 0;
    min-height: 0;
}

.pos-screen--mobile .pos-cart-totals,
.pos-screen--mobile .pos-payment-actions {
    flex: 0 0 auto;
}`;

appendIfMissing(
  "resources/pos/src/assets/css/mobile.css",
  ".pos-screen--mobile .pos-cart-items {\n    flex: 1 1 0;",
  cssFix
);

appendIfMissing(
  "resources/pos/src/assets/css/mobile.rtl.css",
  ".pos-screen--mobile .pos-cart-items {\n    flex: 1 1 0;",
  cssFix
);
