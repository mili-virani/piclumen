"use client";

import { useState, useEffect } from "react";
import { Grid } from "lucide-react";
import { getUsers } from "@/utils/api";
import GalleryModal from "@/component/gallerymodelData";
import Image from "next/image";

interface ImageData {
  face_id: string;
  image: string;
  name: string;
}

export default function User() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [personId, setPersonId] = useState<string>("");
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await getUsers(setLoading);
        setImages(response || []); // Ensure response structure matches expected data
      } catch (err) {
        setError("Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  });

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">User list</h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Grid className="mx-auto h-12 w-12 text-gray-500 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-600">
              Loading images...
            </h3>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-red-500">{error}</h3>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {images.map((data) => (
              <div
                key={data.face_id}
                className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={`http://68.183.93.60/py/face_recognization/${data.image}`}
                  alt={data.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  onClick={() => {
                    setIsOpen(true);
                    setPersonId(data.face_id);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <div className="text-center py-12">
            <Grid className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">
              No images found
            </h3>
          </div>
        )}

        {isOpen && (
          <GalleryModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            personId={personId}
          />
        )}
      </div>
    </div>
  );
}
