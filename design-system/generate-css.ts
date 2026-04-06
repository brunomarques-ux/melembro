import { tokens } from "./tokens";
import { tokenKeyToCssVar, sidebarKeyToCssVar } from "./utils";
import fs from "fs";
import path from "path";

const CSS_PATH = path.join(process.cwd(), "app", "globals.css");
const START = "  /* DESIGN-TOKENS:START */";
const END = "  /* DESIGN-TOKENS:END */";

function generateRootBlock(): string {
  const lines: string[] = [START];
  for (const [key, value] of Object.entries(tokens.colors)) {
    lines.push(`  ${tokenKeyToCssVar(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.sidebar)) {
    lines.push(`  ${sidebarKeyToCssVar(key)}: ${value};`);
  }
  lines.push(`  --radius: ${tokens.radius.md};`);
  lines.push(END);
  return lines.join("\n");
}

const css = fs.readFileSync(CSS_PATH, "utf-8");
const isCheck = process.argv.includes("--check");

const startIdx = css.indexOf(START);
const endIdx = css.indexOf(END);

if (startIdx === -1 || endIdx === -1) {
  if (isCheck) {
    console.error("Design tokens block not found in globals.css");
    process.exit(1);
  }
  const rootIdx = css.indexOf(":root {");
  const rootEnd = css.indexOf("}", rootIdx) + 1;
  const before = css.slice(0, rootIdx + ":root {\n".length - 1);
  const after = css.slice(rootEnd - 1);
  const newCss = before + "\n" + generateRootBlock() + "\n" + after;
  fs.writeFileSync(CSS_PATH, newCss, "utf-8");
  console.log("Design tokens injected into globals.css");
} else {
  const newBlock = generateRootBlock();
  const newCss = css.slice(0, startIdx) + newBlock + css.slice(endIdx + END.length);
  if (isCheck && newCss !== css) {
    console.error("globals.css is out of sync with tokens.ts. Run: npm run tokens");
    process.exit(1);
  }
  fs.writeFileSync(CSS_PATH, newCss, "utf-8");
  console.log("Design tokens synced in globals.css");
}
