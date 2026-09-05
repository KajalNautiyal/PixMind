import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldAlert,
  Image as ImageIcon,
  UploadCloud,
  ArrowRight,
} from "lucide-react";
import { photoAPI } from "../../services/api";

const Home = () => {
  const [user, setUser] = useState({ name: "User" });
  const [photos, setPhotos] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("pixmind_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }

    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setIsLoading(true);

      const res = await photoAPI.getAll();

      if (res.data.success) {
        const photoList = res.data.data;
        setPhotos(photoList);

        // Count duplicate photos
        const count = photoList.filter((photo) => photo.isDuplicate).length;
        setDuplicateCount(count);
      }
    } catch (error) {
      console.error("Failed to fetch photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <motion.div className="max-w-6xl mx-auto space-y-8">

      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">
          Good evening, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500">
          Here's what's happening with your memories today.
        </p>
      </div>

      {/* Smart Cleanup */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow">
          <div className="flex items-start gap-4">
            <Sparkles className="text-amber-500" size={30} />

            <div>
              <h2 className="text-xl font-bold text-amber-800">
                Smart Cleanup
              </h2>

              <p className="mt-2 text-amber-700">
                {duplicateCount > 0
                  ? `⚠ Found ${duplicateCount} duplicate photo(s).`
                  : "✅ No duplicate photos found."}
              </p>

              <button className="mt-4 text-amber-600 font-semibold flex items-center gap-2">
                Review Matches <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Card */}
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow">
          <div className="flex items-start gap-4">
            <ShieldAlert className="text-rose-500" size={30} />

            <div>
              <h2 className="text-xl font-bold text-rose-800">
                Privacy Alerts
              </h2>

              <p className="mt-2 text-rose-700">
                3 potentially sensitive documents detected.
              </p>

              <button className="mt-4 text-rose-600 font-semibold flex items-center gap-2">
                Secure in Vault <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Uploads */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <ImageIcon className="text-purple-600" />
          Recent Uploads
        </h2>

        {isLoading ? (
          <p>Loading photos...</p>
        ) : photos.length === 0 ? (
          <div className="text-center border rounded-3xl p-10">
            <UploadCloud className="mx-auto text-purple-600 mb-4" size={40} />
            <h3 className="text-xl font-bold">No photos uploaded yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="rounded-2xl overflow-hidden border shadow bg-white"
              >
                <div className="relative">

                  {photo.isDuplicate && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      Duplicate
                    </span>
                  )}

                  <img
                    src={`${API_URL}${photo.url}`}
                    alt={photo.filename}
                    className="w-full h-44 object-cover"
                  />
                </div>

                <div className="p-3">
                  <p className="font-semibold text-sm truncate">
                    {photo.filename}
                  </p>

                  <p className="text-xs text-gray-500">
                    {(photo.size / 1024).toFixed(1)} KB
                  </p>

                  <p className="text-xs text-gray-500">
                    {photo.metadata?.width} × {photo.metadata?.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;