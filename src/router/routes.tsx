/**
 * Router Configuration
 * Application routes with lazy loading
 */

import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/lib/constants'
import { ProtectedRoute } from './ProtectedRoute'
import {
  HomePage,
  LoginPage,
  RegisterPage,
  BoardsPage,
  BoardPage,
  NotFoundPage,
} from '@/pages'

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.BOARDS,
    element: (
      <ProtectedRoute>
        <BoardsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.BOARD,
    element: (
      <ProtectedRoute>
        <BoardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
])
