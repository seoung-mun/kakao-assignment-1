'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'all';

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    if (filter === 'all') {
      params.delete('filter');
    } else {
      params.set('filter', filter);
    }
    router.push(`?${params.toString()}`);
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' }
  ];

  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleFilterChange(tab.id)}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
            currentFilter === tab.id
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
