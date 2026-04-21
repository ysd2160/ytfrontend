import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../utils";

const EditProfile = () => {
  const token = useSelector((state) => state.auth.token);
  const [info, setInfo] = useState({
    fullName: "",
    email: "",
  });
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

 
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.patch(
        `${api}/api/v1/user/edit-info`,
        info,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      
      setMsg("Profile info updated ✅");
      console.log("Updated Info:", res.data.data);
      navigate("/")
    } catch (err) {
      setMsg(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatar) return setMsg("Please select an avatar");
    setLoading(true);
    setMsg("");
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const res = await axios.patch(
        `{api}/api/v1/user/edit-avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMsg("Avatar updated ✅");
      console.log("Updated Avatar:", res.data.data);
      navigate("/")
    } catch (err) {
      setMsg(err.response?.data?.message || "Avatar update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update Cover Image
  const handleCoverSubmit = async (e) => {
    e.preventDefault();
    if (!coverImage) return setMsg("Please select a cover image");
    setLoading(true);
    setMsg("");
    const formData = new FormData();
    formData.append("coverImage", coverImage);

    try {
      const res = await axios.patch(
        `${api}/api/v1/user/edit-coverimage`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMsg("Cover image updated ✅");
      console.log("Updated Cover Image:", res.data.data);
      navigate("/")
    } catch (err) {
      setMsg(err.response?.data?.message || "Cover update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl shadow-lg mt-10 space-y-8 text-white">
      <h2 className="text-2xl font-bold text-center text-white">Edit Profile</h2>

      {msg && (
        <p className="text-center text-sm p-2 rounded bg-gray-800 text-gray-200">
          {msg}
        </p>
      )}

      {/* 🔹 Info Form */}
      <form onSubmit={handleInfoSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={info.fullName}
            onChange={(e) => setInfo({ ...info, fullName: e.target.value })}
            className="w-full border border-gray-700 p-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            className="w-full border border-gray-700 p-2 rounded bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Save Info"}
        </button>
      </form>

      {/* 🔹 Avatar Upload */}
      <form onSubmit={handleAvatarSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full text-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {loading ? "Uploading..." : "Update Avatar"}
        </button>
      </form>

      {/* 🔹 Cover Image Upload */}
      <form onSubmit={handleCoverSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
            className="w-full text-gray-300"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Uploading..." : "Update Cover"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
