import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { api } from "../utils";

const History = () => {
  const token = useSelector((state) => state.auth.token);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${api}/api/v1/user/watchhistory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVideos(res.data.watchHistory || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchHistory();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-300">
        <p className="text-2xl font-semibold">No watch history yet 📭</p>
        <p className="text-sm mt-2">Start watching videos and they’ll appear here.</p>
        <Link
          to="/"
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition"
        >
          Explore Videos
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-white text-2xl font-semibold mb-6">Watch History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <Link key={video._id} to={`/video/${video._id}`}>
            <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform">
              <img
                src={video?.thumbnail}
                className="w-full h-40 object-cover"
                alt="thumbnail"
              />
              <div className="p-3">
                <p className="text-sm text-gray-300 line-clamp-2">
                  {video?.description}
                </p>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>👁 {video?.views}</span>
                  <span>
                    ⏱ {Math.floor(video?.duration / 60)}:
                    {String(Math.floor(video?.duration % 60)).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History;
