import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { api } from "../utils";

const Profile = () => {
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);
  const { username } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [tab, setTab] = useState("videos");
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${api}/api/v1/user/c/${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(res.data.data);
        setSubscriberCount(res.data.data.subscriberCount || 0);
        setIsSubscribed(res.data.data.isSubscribed || false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchProfile();
  }, [username, token]);

  // Fetch tweets
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await axios.get(
          `${api}/api/v1/tweet/user/${profile?._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTweets(res.data.tweets || []);
      } catch (error) {
        console.error(error);
      }
    };
    if (profile?._id) fetchTweets();
  }, [profile?._id, token]);

  // Handle subscribe/unsubscribe
  const handleSubscribe = async () => {
    try {
      const res = await axios.post(
        `${api}/api/v1/subscription/c/${profile._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message.includes("subscribe sucessfully")) {
        setIsSubscribed(true);
        setSubscriberCount((prev) => prev + 1);
      } else {
        setIsSubscribed(false);
        setSubscriberCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error("Error subscribing/unsubscribing:", error);
      alert("Something went wrong.");
    }
  };

  // Handle delete video
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`${api}/api/v1/video/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("Failed to delete video");
    }
  };

  // Handle delete tweet
  const handleDeleteTweet = async (tweetId) => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) return;
    try {
      await axios.delete(`${api}/api/v1/tweet/${tweetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (err) {
      console.error("Error deleting tweet:", err);
      alert("Failed to delete tweet");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-white p-5">User not found.</div>;
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white">
      {/* Cover Image */}
      <div className="relative w-full h-56 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <img
          src={profile.coverImage || ""}
          alt="cover"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-[-40px] left-10">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-black object-cover shadow-lg"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-14 px-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{profile.fullName}</h1>
          <p className="text-gray-400">@{profile.username}</p>
          <p className="text-sm text-gray-400">
            {subscriberCount} Subscribers • {profile.subscribedToCount} Subscribed
          </p>
        </div>

        {currentUser?.username === profile.username ? (
          <Link
            to={`/edit`}
            className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-md font-medium transition"
          >
            Edit Profile
          </Link>
        ) : (
          <button
            onClick={handleSubscribe}
            className={`px-5 py-2 rounded-md font-medium transition ${
              isSubscribed
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {isSubscribed ? "Subscribed ✓" : "Subscribe"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-700 mt-6 px-10">
        {["videos", "tweets"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`relative pb-2 transition ${
              tab === item
                ? "text-purple-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
            {tab === item && (
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-purple-500 rounded"></span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-10">
        {tab === "videos" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.videos?.length > 0 ? (
              profile.videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-gray-900 rounded-xl shadow-md overflow-hidden hover:scale-105 transition-transform relative"
                >
                  <Link to={`/video/${video._id}`}>
                    <img
                      src={video?.thumbnail}
                      className="w-full h-40 object-cover"
                      alt="thumbnail"
                    />
                  </Link>
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

                    {/* Edit & Delete Icons */}
                    {currentUser?.username === profile.username && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Edit2
                          size={18}
                          className="cursor-pointer text-purple-500 hover:text-purple-400"
                          onClick={() => navigate(`/edit/video/${video._id}`)}
                        />
                        <Trash2
                          size={18}
                          className="cursor-pointer text-red-500 hover:text-red-400"
                          onClick={() => handleDeleteVideo(video._id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-center">
                No videos uploaded yet 📭
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {tweets?.length > 0 ? (
              tweets.map((tweet) => (
                <div
                  key={tweet._id}
                  className="bg-gray-900 rounded-xl shadow-md p-5 relative"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={tweet?.owner?.avatar}
                      alt="avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{tweet.owner.fullName}</p>
                      <p className="text-gray-400 text-sm">
                        @{tweet.owner.username}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-200">{tweet.content}</p>

                  {/* Edit & Delete Icons */}
                  {currentUser?._id === tweet.owner._id && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Edit2
                        size={18}
                        className="cursor-pointer text-purple-500 hover:text-purple-400"
                        onClick={() => navigate(`/edit/tweet/${tweet._id}`)}
                      />
                      <Trash2
                        size={18}
                        className="cursor-pointer text-red-500 hover:text-red-400"
                        onClick={() => handleDeleteTweet(tweet._id)}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center">No tweets yet 🐦</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
