const fs = require('fs');

const targetFile = 'c:/Users/ssbis/Downloads/Stock market/sigmaspire/apps/web/lib/blog-data.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const indexToRemove = content.indexOf('{    id: "buyer-customer-journey"');
const alternativeIndex = content.indexOf('  {\r\n    id: "buyer-customer-journey"');
const thirdIndex = content.indexOf('  {\n    id: "buyer-customer-journey"');

let cutIndex = Math.max(indexToRemove, alternativeIndex, thirdIndex);

if (cutIndex !== -1) {
  content = content.substring(0, cutIndex);
  content += '];\n';
  fs.writeFileSync(targetFile, content, 'utf8');
  console.log('Removed old duplicate posts from the bottom.');
} else {
  console.log('Could not find the start of the old posts.');
}
