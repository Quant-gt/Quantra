export default function StaticPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-white mb-4">SEBI Regulations</h1>
        <p className="text-gray-400">Quantra acts as a technology provider. Users must comply with SEBI regulations for automated trading.</p>
        <a href="/" className="inline-block mt-8 text-[#58A6FF] hover:underline">Return Home</a>
      </div>
    </div>
  );
}