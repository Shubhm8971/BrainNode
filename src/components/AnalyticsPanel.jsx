import { useDashboard } from './DashboardContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AnalyticsPanel() {
  const { totalCount, searchedTopics } = useDashboard();
  
  // Calculate counts
  const doneCount = searchedTopics.filter(t => t.status === 'Done').length;
  const pendingCount = totalCount - doneCount;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Prepare data for Recharts
  const data = [
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Done', value: doneCount, color: '#10b981' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Your Productivity</h2>
      
      {/* Stats Row */}
      <div className="flex gap-8 mb-6">
        <div>
          <p className="text-3xl font-bold text-blue-600">{completionRate}%</p>
          <p className="text-sm text-gray-500">Completion Rate</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-green-600">{doneCount}</p>
          <p className="text-sm text-gray-500">Topics Finished</p>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}