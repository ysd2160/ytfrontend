import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { api } from "../utils";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const token = useSelector((state) => state.auth.token);
 
    const refreshToken = async () => {
      try {
        const response = await axios.post(`${api}/api/v1/user/refresh-token`, {},{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
       console.log(response);
       
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

   

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${api}/api/v1/video/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVideos(response.data.videos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [token]);

  if (videos.length === 0)
    return (
      <div className="text-white text-center text-2xl mt-20">
        Nothing to show 😔
        <button onClick={refreshToken}>refresh</button>
      </div>
    );

  return (
         <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-black min-h-screen text-white overflow-y-auto"> 
        <button onClick={refreshToken}>refresh</button>

      {/* Video Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {videos.map((video) => (
          <Link
            to={`/video/${video._id}`}
            key={video._id}
            className="group"
          >
            {/* Video Card */}
            <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform">
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video?.thumbnail || "/default-thumbnail.jpg"}
                  alt={video?.title}
                  className="w-full h-40 object-cover"
                />
                {video?.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {Math.floor(video?.duration / 60)}:
                    {String(Math.floor(video?.duration % 60)).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex gap-3">
                {/* Channel avatar */}
                <img
                  src={video?.owner?.avatar || "/default-avatar.png"}
                  alt="channel"
                  className="w-9 h-9 rounded-full object-cover"
                />

                <div className="flex flex-col">
                  <p className="text-sm font-semibold line-clamp-2 group-hover:text-red-500">
                    {video?.title}
                  </p>
                  <span className="text-xs text-gray-400">
                    {video?.owner?.username || "Unknown"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {video?.views || 0} views •{" "}
                    {video?.createdAt
                      ? new Date(video.createdAt).toLocaleDateString()
                      : "recently"}
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

export default Home;
