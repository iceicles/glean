import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import AuthenticationPage from './pages/Authentication';
import DiaryPage from './pages/Diary';
import EditDiaryPage from './pages/EditDiary';
import HomePage from './pages/Home';

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/auth', element: <AuthenticationPage /> },
  { path: 'diary', element: <DiaryPage /> },
  { path: 'diary/edit', element: <EditDiaryPage /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
