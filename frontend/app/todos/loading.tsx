export default function Loading() {
  return (
    <div className="h-full flex flex-col p-6 max-w-md mx-auto w-full bg-white shadow-xl animate-pulse">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-4 w-24 bg-gray-100 rounded-md"></div>
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-100"></div>
      </div>
      
      <div className="mb-4">
        <div className="h-10 bg-gray-100 rounded-lg w-full mb-2"></div>
        <div className="h-16 bg-gray-50 rounded-lg w-full"></div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="h-10 bg-gray-100 rounded-lg w-full"></div>
        <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
      </div>

      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-white border border-gray-100 rounded-xl flex items-center px-4 gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
