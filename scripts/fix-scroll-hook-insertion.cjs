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

function rewriteImports(lines, file) {
    const importLine = `import useScrollToFirstError from "${relImport(file)}";`;

    // remove existing hook import lines
    const filtered = lines.filter(
        (l) => !l.trim().startsWith("import useScrollToFirstError from")
    );

    // if file doesn't reference hook at all anymore, skip adding (caller will decide)
    // Find end of import block (handle multi-line imports)
    let lastImportEnd = -1;
    let inImport = false;
    for (let i = 0; i < filtered.length; i++) {
        const line = filtered[i];
        if (!inImport && line.trim().startsWith("import ")) {
            inImport = true;
        }
        if (inImport && line.includes(";")) {
            lastImportEnd = i;
            inImport = false;
        }
        // stop scanning once non-import code starts and we already passed import block
        if (lastImportEnd !== -1 && !inImport) {
            const next = filtered[i + 1];
            if (next && !next.trim().startsWith("import ") && next.trim() !== "") {
                // ok
            }
        }
    }

    if (lastImportEnd >= 0) {
        filtered.splice(lastImportEnd + 1, 0, importLine);
    } else {
        filtered.unshift(importLine);
    }

    return filtered;
}

function removeExistingHookCalls(lines) {
    return lines.filter((l) => !l.includes("useScrollToFirstError(errors)") && !l.includes("useScrollToFirstError( errors )"));
}

function insertHookCallAfterErrorsState(lines) {
    const startRe = /const\s*\[\s*errors\s*,\s*setErrors\s*\]\s*=\s*useState\s*\(/;

    for (let i = 0; i < lines.length; i++) {
        if (!startRe.test(lines[i])) continue;

        const indent = (lines[i].match(/^\s*/) || [""])[0];

        // Find the end of this statement by looking for a line that contains ");" OR ");" variants
        for (let j = i; j < Math.min(lines.length, i + 80); j++) {
            if (lines[j].includes(");")) {
                // insert after this line
                lines.splice(j + 1, 0, `${indent}useScrollToFirstError(errors);`);
                return true;
            }
        }

        // fallback: insert right after line i
        lines.splice(i + 1, 0, `${indent}useScrollToFirstError(errors);`);
        return true;
    }

    return false;
}

function fixFile(file) {
    const before = fs.readFileSync(file, "utf8");
    if (!before.includes("useScrollToFirstError")) return false;

    let lines = before.split(/\r?\n/);

    // remove any wrongly inserted hook call lines, then reinsert correctly
    lines = removeExistingHookCalls(lines);

    // ensure import is placed correctly (after full import block)
    lines = rewriteImports(lines, file);

    // only add hook call if errors state exists
    const hasErrorsState = lines.some((l) => /\[\s*errors\s*,\s*setErrors\s*\]/.test(l) && l.includes("useState"));
    if (hasErrorsState) {
        insertHookCallAfterErrorsState(lines);
    }

    const after = lines.join("\n");
    if (after === before) return false;
    fs.writeFileSync(file, after, "utf8");
    return true;
}

const targetDir = path.join(baseDir, "components");
const files = walk(targetDir);
let changed = 0;
for (const f of files) {
    if (fixFile(f)) {
        changed++;
        console.log("fixed:", f.replace(/\\/g, "/"));
    }
}
console.log("done. fixed files:", changed);
