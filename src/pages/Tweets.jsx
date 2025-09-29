import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../utils";

const Tweets = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Tweet cannot be empty.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${api}/api/v1/tweet/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Tweet created successfully!");
      setContent("");

      // Redirect after short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);

      console.log("Tweet created:", response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 text-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6">Create Tweet</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="tweet"
              className="mb-1 text-gray-300 font-medium"
            >
              Tweet:
            </label>
            <textarea
              id="tweet"
              rows="3"
              className="border border-gray-600 bg-gray-700 rounded-md p-2 text-white resize-none outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md p-2 font-medium transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Posting..." : "Create Tweet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Tweets;
