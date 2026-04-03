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

const cssFix = `/* Sticky Pay actions (prevents items area collapsing to 0) */
.pos-screen--mobile .pos-cart-panel {
    overflow: auto;
}

.pos-screen--mobile .pos-cart-items {
    flex: 0 0 auto;
    min-height: 140px;
}

.pos-screen--mobile .pos-payment-actions {
    position: sticky;
    bottom: 0;
    background: #fff;
    padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    margin-top: 8px;
}`;

appendIfMissing(
  "resources/pos/src/assets/css/mobile.css",
  "Sticky Pay actions (prevents items area collapsing to 0)",
  cssFix
);

appendIfMissing(
  "resources/pos/src/assets/css/mobile.rtl.css",
  "Sticky Pay actions (prevents items area collapsing to 0)",
  cssFix
);
