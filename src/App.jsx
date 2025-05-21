import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/todos'

const fetchTodos = async () => {
  const res = await axios.get(API_URL)
  return res.data
}

function App() {
  const queryClient = useQueryClient()
  const [text, setText] = useState('')
  const [editId, setEditId] = useState(null)

  const { data: todos, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  const addTodo = useMutation({
    mutationFn: (newTodo) => axios.post(API_URL, newTodo),
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  })

  const updateTodo = useMutation({
    mutationFn: ({ id, text }) => axios.put(`${API_URL}/${id}`, { id, text }),
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  })

  const deleteTodo = useMutation({
    mutationFn: (id) => axios.delete(`${API_URL}/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  })

  const handleSubmit = () => {
    if (!text.trim()) return
    if (editId !== null) {
      updateTodo.mutate({ id: editId, text })
      setEditId(null)
    } else {
      addTodo.mutate({ text })
    }
    setText('')
  }

  const startEdit = (todo) => {
    setText(todo.text)
    setEditId(todo.id)
  }

  if (isLoading) return <p className="loading">Yuklanmoqda...</p>

  return (
    <div className="container">
      <h1 className="title">📋 To-Do List</h1>

      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Yangi vazifa..."
          className="input"
        />
        <button onClick={handleSubmit} className="btn">
          {editId !== null ? 'Yangilash' : 'Qo‘shish'}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <span>{todo.text}</span>
            <div className="actions">
              <button onClick={() => startEdit(todo)} className="edit">✏️</button>
              <button onClick={() => deleteTodo.mutate(todo.id)} className="delete">🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
