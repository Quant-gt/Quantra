const fs = require('fs');
const path = require('path');

const files = [
  'apps/web/app/admin/ai-creator/page.tsx',
  'apps/web/app/admin/engine/page.tsx',
  'apps/web/app/creator/publish/page.tsx',
  'apps/web/app/dashboard/deployments/page.tsx',
  'apps/web/app/dashboard/subscriptions/page.tsx',
];

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if toast is already imported
    if (!content.includes('import { toast } from "sonner"') && !content.includes("import { toast } from 'sonner'")) {
      // Add import after the first import or use client
      if (content.includes('"use client";')) {
        content = content.replace('"use client";\n', '"use client";\nimport { toast } from "sonner";\n');
      } else {
        content = 'import { toast } from "sonner";\n' + content;
      }
    }

    // Replace alert("error") with toast.error("error")
    content = content.replace(/alert\((.*Error.*|.*Failed.*|.*Network.*)\)/ig, 'toast.error($1)');
    // Replace alert("success") with toast.success("success")
    content = content.replace(/alert\((.*successfully.*|.*COMPLETE.*)\)/ig, 'toast.success($1)');
    // Replace remaining alerts with toast.info
    content = content.replace(/alert\(/g, 'toast.info(');

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
});
