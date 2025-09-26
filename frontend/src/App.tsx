import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from './componentsUI/LoginPage';
import { HomePage } from './componentsUI/HomePage';
import { Provider } from 'react-redux';
import { store } from './store/store';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '*',
    element: <div>Page not found</div>,
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  );
}
