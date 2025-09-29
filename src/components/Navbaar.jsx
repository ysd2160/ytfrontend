import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/authSlice"
import { FiUser } from "react-icons/fi";

const Navbaar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);

  // 🔍 Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?q=${searchTerm}`);
  };

  // 🚪 Handle logout
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-black border-b border-amber-100 p-2 flex items-center justify-between">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1">
        <input
          type="text"
          placeholder="Search"
          className="p-2 border border-gray-400 rounded w-full bg-transparent text-white focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
        >
          Search
        </button>
      </form>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 ml-3 rounded transition"
        >
          Logout
        </button>
      </div>
   
  );
};

export default Navbaar;
