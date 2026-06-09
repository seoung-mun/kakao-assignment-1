import { TODO_ACTIONS } from '../constants/actions'

export function todoReducer(state, action) {
  switch (action.type) {
    case TODO_ACTIONS.ADD: {
      const { text, date } = action.payload
      const newTodo = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text: text.trim(),
        isCompleted: false,
        date, // YYYY-MM-DD format
        createdAt: new Date().toISOString()
      }
      return [newTodo, ...state]
    }

    case TODO_ACTIONS.TOGGLE: {
      const { id } = action.payload
      return state.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    }

    case TODO_ACTIONS.UPDATE_TEXT: {
      const { id, text } = action.payload
      const trimmedText = text.trim()
      if (trimmedText === '') return state
      return state.map(todo =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    }

    case TODO_ACTIONS.DELETE: {
      const { id } = action.payload
      return state.filter(todo => todo.id !== id)
    }

    default:
      return state
  }
}
