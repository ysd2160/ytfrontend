import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { api } from "../utils";

const VideoCreate = () => {
  const [data, setData] = useState({ title: "", description: "" });
  const [file, setFile] = useState({ thumbnail: null, videoFile: null });
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile({ ...file, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (file.thumbnail) formData.append("thumbnail", file.thumbnail);
      if (file.videoFile) formData.append("videoFile", file.videoFile);

      await axios.post(`${api}/api/v1/video/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-900 text-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h2 className="text-center text-3xl font-bold mb-8 flex items-center justify-center gap-2">
          <Upload className="text-blue-500" /> Upload Video
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter video title"
              value={data.title}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-800 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Enter video description"
              value={data.description}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-800 rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thumbnail */}
            <div>
              <label className="block mb-1 font-medium">Thumbnail</label>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="thumbnail"
              />
              <label
                htmlFor="thumbnail"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition"
              >
                {file.thumbnail ? (
                  <img
                    src={URL.createObjectURL(file.thumbnail)}
                    alt="Thumbnail preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400">Click to upload thumbnail</span>
                )}
              </label>
            </div>

            {/* Video */}
            <div>
              <label className="block mb-1 font-medium">Video File</label>
              <input
                type="file"
                name="videoFile"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="videoFile"
              />
              <label
                htmlFor="videoFile"
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-800 transition text-center"
              >
                {file.videoFile ? (
                  <span className="text-gray-300">{file.videoFile.name}</span>
                ) : (
                  <span className="text-gray-400">Click to upload video</span>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 rounded-md p-3 w-full font-medium transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VideoCreate;
