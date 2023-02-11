import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import DiaryPage from './pages/Diary';
import EditDiaryPage from './pages/EditDiary';
import HomePage from './pages/Home';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/signin', element: <SignInPage />},
  { path: '/signup', element: <SignUpPage />},
  { path: 'diary', element: <DiaryPage /> },
  { path: 'diary/edit', element: <EditDiaryPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
