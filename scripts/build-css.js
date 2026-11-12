const { Scanner } = require('@tailwindcss/oxide');
const { compile } = require('@tailwindcss/node');
const fs = require('fs');
const path = require('path');

async function build() {
  const root = path.resolve(__dirname, '..');
  const scanner = new Scanner({
    sources: [{ base: root, pattern: 'app/**/*.{ts,tsx,js,jsx}', negated: false }],
  });
  const candidates = scanner.scan();
  const srcCss = fs.readFileSync(path.join(root, 'app/globals.src.css'), 'utf8');
  const compiled = await compile(srcCss, {
    base: root,
    onDependency: () => {},
  });
  const finalCss = compiled.build(candidates);
  fs.writeFileSync(path.join(root, 'app/globals.css'), finalCss);
  console.log(`Generated app/globals.css (${finalCss.length} bytes, ${candidates.length} candidate classes)`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});

