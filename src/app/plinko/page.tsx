import PlinkoComponent from "@/components/mobile/plinko/plinkoComponent_8_row";

export default function PlinkoPage() {
  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Plinko Game Demo
        </h1>
        <PlinkoComponent rows={8} />
      </div>
    </div>
  );
}