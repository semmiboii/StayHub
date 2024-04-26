import Layout from "./layouts/Layout";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddHotel from "./pages/AddHotel";
import ProtectedRoute from "./utils/ProtectedRoute";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout>Home Page</Layout>,
  },
  {
    path: "/search",
    element: <Layout>Search-Page</Layout>,
  },
  {
    path: "/register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/add-hotel",
    element: (
      <ProtectedRoute>
        <Layout>
          <AddHotel />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-hotels",
    element: (
      <ProtectedRoute>
        <Layout>
          <MyHotels />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-hotel/:hotelId",
    element: ( 
        <ProtectedRoute>
            <Layout>
              <EditHotel/>
            </Layout>
        </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
