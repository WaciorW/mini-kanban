import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { useAuthStore } from '@/store'

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession)

  useEffect(() => {
    // Restore session on app load
    restoreSession()
  }, [restoreSession])

  return <RouterProvider router={router} />
}

export default App
