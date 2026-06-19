export default function DashboardStats({ remainingCount, totalCount }) {
  return (
    <div className="grid grid-cols-2 gap-4 my-6">
      <div className="bg-blue-100 p-4 rounded-xl border border-blue-200">
        <p className="text-sm text-blue-600 font-bold uppercase tracking-wide">Total Topics</p>
        <p className="text-3xl font-black text-blue-900">{totalCount}</p>
      </div>
      <div className="bg-amber-100 p-4 rounded-xl border border-amber-200">
        <p className="text-sm text-amber-600 font-bold uppercase tracking-wide">Remaining</p>
        <p className="text-3xl font-black text-amber-900">{remainingCount}</p>
      </div>
    </div>
  );
}