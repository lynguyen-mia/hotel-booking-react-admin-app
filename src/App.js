import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Auth, { loader as authLoader } from "./auth/Auth";
import ErrorPage from "./admin/components/ErrorPage";
import RootLayout from "./admin/components/RootLayout";
import Dashboard, { loader as dataLoader } from "./admin/pages/Dashboard";
import HotelList, { loader as hotelLoader } from "./admin/pages/HotelList";
import AddHotel, { loader as addHotelLoader } from "./admin/pages/AddHotel";
import RoomList, { loader as roomLoader } from "./admin/pages/RoomList";
import AddRoom, { loader as addRoomLoader } from "./admin/pages/AddRoom";
import Transaction, {
  loader as transactionLoader
} from "./admin/pages/Transaction";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />,
    loader: authLoader
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard />, loader: dataLoader },
      { path: "/hotel-list", element: <HotelList />, loader: hotelLoader },
      {
        path: "/add-hotel",
        element: <AddHotel />,
        loader: addHotelLoader
      },
      {
        path: "/room-list",
        element: <RoomList />,
        loader: roomLoader
      },
      {
        path: "/add-room",
        element: <AddRoom />,
        loader: addRoomLoader
      },
      {
        path: "/transaction-list",
        element: <Transaction />,
        loader: transactionLoader
      }
    ]
  }
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
