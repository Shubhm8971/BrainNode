export default function Skeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className="w-full h-20 bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}