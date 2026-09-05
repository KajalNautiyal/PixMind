import { useEffect, useState } from "react";
import { getPhotos } from "../services/photoService";

export default function PhotoManager() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const data = await getPhotos();
      setPhotos(data);
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6">📸 My Photo Gallery</h1>

      {/* Duplicate Message */}
      {photos.some((photo) => photo.isDuplicate) && (
        <div className="bg-red-100 border border-red-500 text-red-700 p-4 rounded-lg mb-6">
          <h2 className="font-bold text-lg">
            ⚠ Duplicate Photos Detected
          </h2>
          <p className="text-sm mt-1">
            PixMind found duplicate photos in your gallery.
          </p>
        </div>
      )}

      {/* No Photos */}
      {photos.length === 0 ? (
        <p className="text-gray-500">No photos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className="border rounded-xl p-3 shadow-lg bg-white"
            >
              {/* Image */}
              <div className="relative">
                {photo.isDuplicate && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Duplicate
                  </span>
                )}

                <img
                  src={`http://localhost:5000${photo.url}`}
                  alt={photo.filename}
                  className="w-full h-44 object-cover rounded-lg"
                  onError={(e) => {
                    console.log("Image failed:", e.target.src);
                  }}
                />
              </div>

              {/* Details */}
              <h2 className="mt-3 text-sm font-semibold truncate">
                {photo.filename}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Size: {(photo.size / 1024).toFixed(1)} KB
              </p>

              <p className="text-xs text-gray-500">
                Resolution: {photo.metadata?.width} × {photo.metadata?.height}
              </p>

              <p className="text-xs text-gray-500">
                Format: {photo.mimetype}
              </p>

              <p className="text-xs text-gray-500">
                Uploaded: {new Date(photo.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}