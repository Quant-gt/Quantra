const fs = require('fs');
let content = fs.readFileSync('lib/blog-data.tsx', 'utf8');

content = content.replace(/id:\s*"([^"]+)",\s*title:\s*"([^"]+)"/g, (match, id, title) => {
  const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `id: "${newId}",\n    title: "${title}"`;
});

fs.writeFileSync('lib/blog-data.tsx', content);
console.log("Updated blog-data.tsx");
