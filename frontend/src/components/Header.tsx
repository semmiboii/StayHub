import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-black py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">StayHub</Link>
        </span>
        <span className="flex space-x-2 rounded-md overflow-hidden">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center px-3 font-bold hover:bg-gray-600 text-white rounded-md"
              >
                My Bookings
              </Link>
              <Link
                to="/my-hotels"
                className="flex items-center px-3 font-bold hover:bg-gray-600 text-white rounded-md"
              >
                My Hotels
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              to="/login"
              className="flex bg-white items-center text-black px-3 hover:text-gray-800"
            >
              Login
            </Link>
          )}
        </span>
      </div>
    </div>
  );
}
