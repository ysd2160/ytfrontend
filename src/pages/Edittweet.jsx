import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { api } from "../utils";

const EditTweet = () => {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [Content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch tweet by id
  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const res = await axios.get(`${api}/api/v1/tweet/${tweetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
console.log(res);

        // setContent(res.data.Content || "");
      } catch (err) {
        console.error("Error fetching tweet:", err);
        alert("Failed to fetch tweet");
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetId, token]);

  // Update tweet
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!Content.trim()) {
      alert("Tweet content cannot be empty");
      return;
    }

    try {
      const res = await axios.patch(
        `${api}/api/v1/tweet/${tweetId}`,
        { Content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Updated tweet:", res.data);
      alert("Tweet updated successfully!");
      navigate(-1); // go back to profile or previous page
    } catch (err) {
      console.error("Error updating tweet:", err);
      alert("Failed to update tweet");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center text-white p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Tweet</h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-full max-w-md">
        <textarea
          value={Content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Edit your tweet..."
          rows="4"
          className="px-3 py-2 rounded bg-gray-800 text-white resize-none"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Update Tweet
        </button>
      </form>
    </div>
  );
};

export default EditTweet;
