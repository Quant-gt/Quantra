const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'app/status/page.tsx', title: 'System Status', desc: 'All systems are operational. Execution engine latency is currently under 15ms.' },
  { path: 'app/terms/page.tsx', title: 'Terms of Service', desc: 'By using SigmaSpire, you agree to our terms of service regarding algorithmic trading and API usage.' },
  { path: 'app/privacy/page.tsx', title: 'Privacy Policy', desc: 'We take your privacy seriously. Your trading data and API keys are encrypted at rest and in transit.' },
  { path: 'app/risk-disclosure/page.tsx', title: 'Risk Disclosure', desc: 'Algorithmic trading involves significant risk of loss. Past performance is not indicative of future results.' },
  { path: 'app/sebi/page.tsx', title: 'SEBI Regulations', desc: 'SigmaSpire acts as a technology provider. Users must comply with SEBI regulations for automated trading.' },
  { path: 'app/github/page.tsx', title: 'Github Repository', desc: 'Our open-source SDKs and client libraries will be available on Github soon.' },
  { path: 'app/features/page.tsx', title: 'Features', desc: 'Explore our visual strategy builder, backtesting engine, and live execution dashboard.' },
];

pages.forEach(p => {
  const fullDir = path.join(__dirname, '..', 'apps/web', path.dirname(p.path));
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }
  
  const content = `export default function StaticPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-4">${p.title}</h1>
        <p className="text-gray-400">${p.desc}</p>
        <a href="/" className="inline-block mt-8 text-[#58A6FF] hover:underline">Return Home</a>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(path.join(__dirname, '..', 'apps/web', p.path), content);
  console.log(`Created ${p.path}`);
});
