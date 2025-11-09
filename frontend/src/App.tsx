import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from "./customComponentsUI/LoginPage";
import { HomePage } from "./customComponentsUI/HomePage";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./store/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { useIdleLogout } from "./useIdleLogout";
import { BillDetailsPage } from "./customComponentsUI/BillDetailsPage";

const queryClient = new QueryClient();

export const ProtectedRoute = () => {
  const email = useSelector((state: RootState) => state.authSlice.email);
  const userId = useSelector((state: RootState) => state.authSlice.userId);

  const isLoggedIn = !!userId && !!email;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/bills/:billId",
        element: <BillDetailsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Page not found</div>,
  },
]);

function AppContent() {
  const email = useSelector((state: RootState) => state.authSlice.email);
  const userId = useSelector((state: RootState) => state.authSlice.userId);

  const isLoggedIn = !!email && !!userId;

  // only enable idle logout if logged in
  const { showWarning, stayLoggedIn } = useIdleLogout(30, 30, isLoggedIn);

  return (
    <>
      <RouterProvider router={router} />
      {isLoggedIn && showWarning && (
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Session expiring</DialogTitle>
            </DialogHeader>
            <p>You will be logged out soon due to inactivity.</p>
            <Button onClick={stayLoggedIn}>Stay logged in</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}
