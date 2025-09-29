// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../Redux/authSlice";
import { Eye, EyeOff } from "lucide-react";
import { api } from "../utils";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const togglePassword = () => setShowPassword((s) => !s);

  const loginUser = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Basic validation: need password and either username or email
    if (!form.password || (!form.email && !form.username)) {
      setErrorMsg("Provide password and either username or email.");
      return;
    }

    setLoading(true);
    try {
      // send only the fields the backend expects:
      const payload =
        form.username && !form.email
          ? { username: form.username, password: form.password }
          : { email: form.email, username: form.username, password: form.password };
      // (payload includes username if provided; backend can ignore unused keys)

      const res = await axios.post(
        `${api}/api/v1/user/login`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Dispatch login to redux
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
        })
      );

      // Optional: if you want to persist token to localStorage when remember checked,
      // do it here. (If you already have persistence in your store setup, skip.)
      if (remember) {
        try {
          localStorage.setItem("auth_token", res.data.token);
          localStorage.setItem("auth_user", JSON.stringify(res.data.user));
        } catch (err) {
          console.warn("Could not save auth to localStorage", err);
        }
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-center text-3xl font-bold mb-6 text-gray-800">Log In</h2>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded mb-4">
            {errorMsg}
          </div>
        )}

        <form className="space-y-5" onSubmit={loginUser}>
          {/* Username */}
          <div className="flex flex-col">
            <label htmlFor="username" className="mb-1 text-gray-700 font-medium">
              Username (optional)
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="username"
            />
            <p className="text-xs text-gray-400 mt-1">
              You can login with username <span className="font-medium">or</span> email.
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
              Email 
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="email"
            />
          </div>

          {/* Password with eye toggle */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="mb-1 text-gray-700 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-md p-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="current-password"
                aria-describedby="toggle-password"
              />
              <button
                type="button"
                id="toggle-password"
                onClick={togglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded focus:outline-none"
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Extra options */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-blue-500"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md p-2 font-medium transition ${
              loading ? "bg-gray-600 cursor-not-allowed text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
