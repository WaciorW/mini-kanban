import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders router without crashing', () => {
    render(<App />)
    // Should render HomePage by default
    expect(screen.getByText('Mini Kanban')).toBeInTheDocument()
  })

  it('shows home page content', () => {
    render(<App />)
    expect(screen.getByText('Organize your tasks with a simple and elegant Kanban board')).toBeInTheDocument()
  })

  it('displays login and sign up buttons', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument()
  })
})
