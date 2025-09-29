import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // or remove if not using Redux
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { api } from "../utils";

const Search = () => {
  // ✅ Get token if your backend requires auth
  const token = useSelector((state) => state.auth?.token) || "";

  // Get query from URL
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      if (!query) return;
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${api}/api/v1/video/search?q=${query}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res);
        
        setVideos(res.data.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query, token]);

  return (
    <div className="min-h-screen bg-black p-4 text-white">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h2>

      {loading && <p>Loading videos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && videos.length === 0 && <p>No videos found</p>}
   <div className="px-4 sm:px-6 lg:px-10 py-6 bg-black min-h-screen">
      <div className="flex flex-col gap-6">
        {videos.map((video) => (
          <Link to={`/video/${video._id}`} key={video._id}>
            <div className="flex flex-col sm:flex-row gap-4 bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition">
              {/* Thumbnail */}
              <div className="relative w-full sm:w-64 flex-shrink-0">
                <img
                  src={video?.thumbnail || "/default-thumbnail.jpg"}
                  alt={video?.title}
                  className="w-full h-40 sm:h-36 object-cover rounded-lg"
                />
                {video?.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    ⏱ {Math.floor(video?.duration / 60)}:
                    {String(Math.floor(video?.duration % 60)).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Video Info */}
              <div className="flex flex-col justify-between p-2 sm:p-0">
                <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
                  {video?.title}
                </h3>
                <span className="text-xs text-gray-400 mt-1">
                  👁 {video?.views || 0} views •{" "}
                  {video?.createdAt
                    ? new Date(video.createdAt).toLocaleDateString()
                    : "recently"}
                </span>

                {/* Channel info */}
                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={video?.owner?.avatar || "/default-avatar.png"}
                    alt="channel"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-xs text-gray-400">
                    {video?.owner?.username || "Unknown"}
                  </span>
                </div>

                {/* Description (optional like YT) */}
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 hidden sm:block">
                  {video?.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>

    </div>
  );
};

export default Search;
