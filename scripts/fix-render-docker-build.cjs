/* eslint-disable no-console */
const fs = require("fs");

function patchDockerfile() {
  const p = "Dockerfile";
  let s = fs.readFileSync(p, "utf8");
  const before = s;

  // Remove COPY public step in js stage; public may not be in repo or may be ignored.
  s = s.replace(/^COPY public \.\/public\r?\n/m, "");

  // Ensure public exists before running mix
  if (!s.includes("RUN mkdir -p public")) {
    s = s.replace(
      /COPY webpack\.mix\.js webpack-rtl\.config\.js \./,
      (m) => `${m}\nRUN mkdir -p public`
    );
  }

  if (s === before) {
    console.log("no changes:", p);
    return;
  }
  fs.writeFileSync(p, s, "utf8");
  console.log("updated:", p);
}

function patchDockerignore() {
  const p = ".dockerignore";
  let s = fs.readFileSync(p, "utf8");
  const before = s;

  // Don't ignore all pngs; the app uses images under resources/images and public/images.
  s = s
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "*.png")
    .join("\n");

  if (s === before) {
    console.log("no changes:", p);
    return;
  }
  fs.writeFileSync(p, s.replace(/\n+$/,"\n"), "utf8");
  console.log("updated:", p);
}

patchDockerfile();
patchDockerignore();
