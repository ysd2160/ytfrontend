import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { api } from "../utils";

const VideoPlayer = () => {
  const [video, setVideo] = useState();
  const [recommended, setRecommended] = useState([]);
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const currentUser = useSelector((state) => state.auth.user);
  const [like, setLike] = useState(0);
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  // Fetch video
  useEffect(() => {
    const getVideo = async () => {
      try {
        const response = await axios.get(
          `${api}/api/v1/video/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVideo(response.data.video);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };
    getVideo();
  }, [id, token]);

  // Increment views
  useEffect(() => {
    const incrementViews = async () => {
      if (!video?._id) return;

      const watchedVideos = JSON.parse(localStorage.getItem("watchedVideos") || "[]");

      if (!watchedVideos.includes(video._id)) {
        try {
          await axios.post(
            `${api}/api/v1/video/${video._id}/views`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          localStorage.setItem("watchedVideos", JSON.stringify([...watchedVideos, video._id]));
          setVideo((prev) => ({ ...prev, views: prev.views + 1 }));
        } catch (error) {
          console.error("Error incrementing views:", error);
        }
      }
    };

    incrementViews();
  }, [video, token]);

  // Fetch recommended videos
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get(`${api}/api/v1/video`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const otherVideos = res.data.videos.filter((v) => v._id !== id);
        setRecommended(otherVideos);
      } catch (error) {
        console.error("Error fetching recommended videos:", error);
      }
    };
    fetchRecommended();
  }, [id, token]);

  // Fetch likes
  useEffect(() => {
    const getVideoLike = async () => {
      try {
        const response = await axios.get(
          `${api}/api/v1/like/v/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLike(response.data.data.length);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    getVideoLike();
  }, [id, token, refresh]);

  // Fetch comments
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(
          `${api}/api/v1/comment/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(response.data.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    getComments();
  }, [id, token, refresh]);

  // Like handler
  const likeHandler = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/v1/like/v/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  // Comment handler
  const commentHandler = async () => {
    if (!comment.trim()) return;
    try {
      await axios.post(
        `${api}/api/v1/comment/${id}`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId) => {
    if (!editingContent.trim()) return;
    try {
      await axios.patch(
        `${api}/api/v1/comment/c/${commentId}`,
        { newContent: editingContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingCommentId(null);
      setEditingContent("");
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${api}/api/v1/comment/c/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-black min-h-screen text-white">
      {/* Video Section */}
      <div className="flex-1">
        <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
          <video
            src={video?.videoFile}
            controls
            autoPlay
            className="w-full aspect-video rounded-lg"
          />
        </div>

        {/* Video Info */}
        <div className="mt-4">
          <h1 className="text-xl font-semibold">{video?.description}</h1>

          {/* Channel info */}
          {video?.owner && (
            <div className="flex items-center justify-between mt-1">
              <Link
                to={`/profile/${video.owner.username}`}
                className="text-gray-400 hover:text-purple-400 transition"
              >
                {video.owner.fullName} (@{video.owner.username})
              </Link>
            </div>
          )}

          {/* Views + Actions */}
          <div className="flex items-center justify-between mt-3 text-gray-400 text-sm">
            <p>👁 {video?.views} views</p>
            <div className="flex items-center gap-4">
              <button
                onClick={likeHandler}
                className="flex items-center gap-1 hover:text-red-500 transition"
              >
                ❤️ {like}
              </button>
              <button className="flex items-center gap-1 hover:text-blue-400 transition">
                💬 {comments.length}
              </button>
              <button className="flex items-center gap-1 hover:text-green-400 transition">
                ↗️ Share
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Comments</h2>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
            />
            <button
              onClick={commentHandler}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
            >
              Comment
            </button>
          </div>

          <div className="space-y-3">
           {comments.length > 0 ? (
  comments.map((c) => (
    <div
      key={c._id}
      className="p-3 bg-gray-900 rounded-lg text-sm border border-gray-800"
    >
      {/* Show commenter */}

      <p className="font-medium text-gray-200">
        
        (@{c.owner.username})
      </p>

      {/* Editing Mode */}
      {editingCommentId === c._id ? (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-sm"
          />
          <button
            onClick={() => handleEditComment(c._id)}
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium transition"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditingCommentId(null);
              setEditingContent("");
            }}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-xs font-medium transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="text-gray-400">{c.content}</p>
      )}

      {/* Edit/Delete (only if currentUser owns comment) */}
      {currentUser?._id === c.owner?._id && editingCommentId !== c._id && (
        <div className="flex gap-3 mt-2 text-xs text-gray-400">
          <button
            onClick={() => {
              setEditingCommentId(c._id);
              setEditingContent(c.content);
            }}
            className="hover:text-blue-400 transition"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => handleDeleteComment(c._id)}
            className="hover:text-red-500 transition"
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  ))
) : (
  <p className="text-gray-500 text-sm">No comments yet</p>
)}

          </div>
        </div>
      </div>

      {/* Recommended Videos */}
      <div className="w-full lg:w-80 flex flex-col gap-4">
        <h2 className="text-lg font-semibold mb-2">Recommended</h2>
        {recommended.length > 0 ? (
          recommended.map((vid) => (
            <Link
              to={`/video/${vid._id}`}
              key={vid._id}
              className="flex gap-3 bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition"
            >
              <img
                src={vid.thumbnail}
                alt={vid.description}
                className="w-32 h-20 object-cover"
              />
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium line-clamp-2">
                  {vid.description}
                </p>
                <p className="text-xs text-gray-400">{vid.views} views</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No recommended videos</p>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
