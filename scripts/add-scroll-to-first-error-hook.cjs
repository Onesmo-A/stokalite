/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const baseDir = path.join("resources", "pos", "src");
const hookPath = path.join(baseDir, "shared", "hooks", "useScrollToFirstError");

function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const out = [];
    for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...walk(full));
        else if (ent.isFile() && full.endsWith(".js")) out.push(full);
    }
    return out;
}

function relImport(fromFile) {
    const fromDir = path.dirname(fromFile);
    let rel = path.relative(fromDir, hookPath).replace(/\\/g, "/");
    if (!rel.startsWith(".")) rel = "./" + rel;
    return rel;
}

function hasHookImport(s) {
    return s.includes("useScrollToFirstError");
}

function insertImport(s, fromFile) {
    const importLine = `import useScrollToFirstError from "${relImport(fromFile)}";`;
    if (s.includes(importLine)) return s;

    const lines = s.split(/\r?\n/);
    const lastImportIdx = (() => {
        let idx = -1;
        for (let i = 0; i < lines.length; i++) {
            if (/^import\s/.test(lines[i])) idx = i;
        }
        return idx;
    })();

    if (lastImportIdx >= 0) {
        lines.splice(lastImportIdx + 1, 0, importLine);
        return lines.join("\n");
    }

    // fallback: top
    return importLine + "\n" + s;
}

function insertHookCall(s) {
    // Only if component defines errors state
    const stateRe = /const\s*\[\s*errors\s*,\s*setErrors\s*\]\s*=\s*useState\(/;
    if (!stateRe.test(s)) return s;

    // avoid duplicates
    if (s.includes("useScrollToFirstError(errors)")) return s;

    // Insert right after the errors state line
    const lines = s.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
        if (stateRe.test(lines[i])) {
            lines.splice(i + 1, 0, "    useScrollToFirstError(errors);");
            return lines.join("\n");
        }
    }

    return s;
}

function patchFile(file) {
    const before = fs.readFileSync(file, "utf8");

    // must be React file using useState
    if (!before.includes("useState")) return false;
    if (!/\[\s*errors\s*,\s*setErrors\s*\]/.test(before)) return false;

    let after = before;
    after = insertImport(after, file);
    after = insertHookCall(after);

    if (after === before) return false;

    fs.writeFileSync(file, after, "utf8");
    return true;
}

const targetDir = path.join(baseDir, "components");
const files = walk(targetDir);

let changed = 0;
for (const file of files) {
    if (patchFile(file)) {
        changed++;
        console.log("patched:", file.replace(/\\/g, "/"));
    }
}

console.log("done. patched files:", changed);
