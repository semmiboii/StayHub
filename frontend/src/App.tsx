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
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/search",
    element: (
      <Layout>
        <Search />
      </Layout>
    ),
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
    path: "/detail/:hotelId",
    element: (
      <Layout>
        <Detail />
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
          <EditHotel />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/hotel/:hotelId/booking",
    element: (
      <ProtectedRoute>
        <Layout>
          <Booking />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/my-bookings",
    element: (
      <ProtectedRoute>
        <Layout>
          <MyBookings />
        </Layout>
      </ProtectedRoute>
    ),
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
