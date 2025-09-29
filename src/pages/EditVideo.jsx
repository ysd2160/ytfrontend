import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { api } from "../utils";

const Edit = () => {
  const { id } = useParams(); // videoId from route
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user= useSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);

  // fetch video by id
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${api}/api/v1/video/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const video = res.data;
        setTitle(video.title || "");
        setDescription(video.description || "");
        setPreview(video.thumbnail || "");
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };
    fetchVideo();
  }, [id, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Title and description are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const res = await axios.patch(
        `${api}/api/v1/video/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated video:", res.data);
      alert("Video updated successfully!");
      navigate(`/profile/${user?.username}`);
    } catch (err) {
      console.error("Error updating video:", err);
      alert("Error updating video");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Video</h2>

      {preview && (
        <img
          src={preview}
          alt="Thumbnail preview"
          className="w-64 h-40 object-cover rounded mb-4 border border-gray-600"
        />
      )}

      <form
        onSubmit={handleUpdate}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white"
        />

        <textarea
          placeholder="Enter video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          className="px-3 py-2 rounded bg-gray-800 text-white"
        ></textarea>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file-input-bordered"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
        >
          Update Video
        </button>
      </form>
    </div>
  );
};

export default Edit;
