import { useReducer, useEffect } from 'react'

export function useLocalStorageReducer(key, reducer, defaultValue = []) {
  // useReducer의 lazy initialization 기능 사용
  const init = () => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // 기존 Todo 데이터 마이그레이션 (date 필드가 없는 레거시 데이터 보완)
        let isMigrated = false
        const migrated = parsed.map(todo => {
          if (!todo.date) {
            isMigrated = true
            const createdDate = todo.createdAt ? new Date(todo.createdAt) : new Date()
            const year = createdDate.getFullYear()
            const month = String(createdDate.getMonth() + 1).padStart(2, '0')
            const day = String(createdDate.getDate()).padStart(2, '0')
            return {
              ...todo,
              date: `${year}-${month}-${day}`
            }
          }
          return todo
        })
        
        if (isMigrated) {
          localStorage.setItem(key, JSON.stringify(migrated))
        }
        return migrated
      }
      return defaultValue
    } catch (error) {
      console.warn(`localStorage [key: ${key}] 데이터를 파싱하는 중 오류가 발생했습니다. 초기화합니다.`, error)
      return defaultValue
    }
  }

  const [state, dispatch] = useReducer(reducer, undefined, init)

  // 상태가 변경될 때마다 localStorage 동기화
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, dispatch]
}
