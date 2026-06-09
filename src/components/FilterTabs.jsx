export default function FilterTabs({ currentFilter, onChangeFilter }) {
  const tabs = [
    { key: 'all', label: '전체' },
    { key: 'active', label: '진행 중' },
    { key: 'completed', label: '완료' }
  ]

  return (
    <div className="filter-container">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`filter-tab ${currentFilter === tab.key ? 'active' : ''}`}
          onClick={() => onChangeFilter(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
