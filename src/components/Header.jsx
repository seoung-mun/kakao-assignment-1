import { useEffect, useRef, useState } from 'react'

function StatItem({ value, label }) {
  const [displayValue, setDisplayValue] = useState(value)
  const [bounce, setBounce] = useState(false)
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setDisplayValue(value)
      setBounce(true)
      
      // 애니메이션 복원 시간
      const timer = setTimeout(() => {
        setBounce(false)
      }, 150)
      
      prevValueRef.current = value
      return () => clearTimeout(timer)
    }
  }, [value])

  return (
    <div className="stat-item">
      <span 
        className="stat-number"
        style={{
          display: 'inline-block',
          transform: bounce ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {displayValue}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function Header({ total, completed, remaining }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-icon" aria-hidden="true">✦</div>
        <h1 className="header-title">Todo</h1>
        <p className="header-subtitle">오늘 할 일을 정리하세요</p>
      </div>
      <div className="header-stats">
        <StatItem value={total} label="전체" />
        <div className="stat-divider"></div>
        <StatItem value={completed} label="완료" />
        <div className="stat-divider"></div>
        <StatItem value={remaining} label="남은 할 일" />
      </div>
    </header>
  )
}
