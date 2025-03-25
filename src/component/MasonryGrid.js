"use client";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { HiOutlineUpload } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import { Grid } from 'lucide-react';
import { getIamges, recognizeImage, removeDuplicates } from '@/utils/api'
import Image from "next/image";

// const images = [
//   {
//     id: 1,
//     title: "Mystical Phone Case",
//     url: "https://images.unsplash.com/photo-1611117775350-ac3950990985",
//   },
//   {
//     id: 2,
//     title: "Neon Robot",
//     url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a",
//   },
//   {
//     id: 3,
//     title: "Space Explorer",
//     url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2",
//   },
//   {
//     id: 4,
//     title: "Electric Truck",
//     url: "https://images.unsplash.com/photo-1620455800201-7f00aeef12ed",
//   },
//   {
//     id: 5,
//     title: "Mountain View",
//     url: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
//   },
//   {
//     id: 6,
//     title: "Anime Art",
//     url: "https://images.unsplash.com/photo-1578632767115-351597cf2477",
//   },
//   {
//     id: 7,
//     title: "Urban Wildlife",
//     url: "https://images.unsplash.com/photo-1442689859438-97407280183f",
//   },
//   {
//     id: 8,
//     title: "FIFA 2025",
//     url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55",
//   },
// ];

const MasonryGrid = () => {
  // Responsive column breakpoints
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [removingDuplicates, setRemovingDuplicates] = useState(false);
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await getIamges(setLoading)

      if (response && Array.isArray(response)) {
        setImages(response || []); // Assuming response is an array of image URLs
      } else {
        setImages([])
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchImages();
  }, [fetchImages]);

  const openModal = (index) => {
    console.log("Opening modal for index:", index);
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal...");
    setModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };
  const handleRemoveDuplicates = async () => {
    try {
      setRemovingDuplicates(true);
      const response = await removeDuplicates();

      if (response.error) {
        console.error(response.error);
      } else {
        fetchImages()
        // window.location.reload(); // Refresh the page
      }
    } catch (error) {
      console.error("Failed to remove duplicates.");
      console.error("Error fetching images:", error);
    } finally {
      setRemovingDuplicates(false);
    }
  };
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      // setError(null);

      const formData = new FormData();
      formData.append("image", file);

      const response = await recognizeImage(formData);
      if (response && response.faces.length > 0) {
        const personId = response.faces[0]?.person_id;
        console.log("Person ID:", personId);
        fetchImages()
        // const galleryResponse = await getPersonGallery(personId);

        // if (galleryResponse && galleryResponse.photos) {
        //   setProjects(galleryResponse.photos);
        // } else {
        //   console.log("No photos found for this person.");
        // }
      } else {
        console.log("No matching faces found.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setUploading(false);
    }
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    768: 2,
    500: 1,
  };

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">

          <h1 className="text-3xl font-bold text-center mb-8 font-brush">Gallery</h1>
          <div className="flex gap-2">
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} id="upload-input" />
            <label htmlFor="upload-input" className="text-md border-[1px] text-white bg-black px-3.5 py-2 rounded flex mb-6 cursor-pointer">{!uploading && <HiOutlineUpload className="mr-2 mt-1" />} {uploading ? "Uploading..." : "Upload"}</label>

            <button className="text-md border-[1px] text-white bg-black px-3.5 py-2 rounded flex mb-6 cursor-pointer" onClick={handleRemoveDuplicates} disabled={removingDuplicates}> {removingDuplicates ? "Removing Duplicates..." : "Remove Duplicates"}</button>

          </div>
        </div>

    
        {loading && (
          <div className="text-center py-12">
            <Grid className="mx-auto h-12 w-12 text-gray-500 mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-gray-600">Loading images...</h3>
          </div>
        )}

        {!loading && images.length > 0 && (
          <Masonry
            breakpointCols={breakpointColumns}
            className="flex gap-4"
            columnClassName="masonry-grid-column"
          >
            {images.map((data, index) => (
              <div key={data.image_id} className="group relative mb-4 overflow-hidden rounded-lg shadow-lg ">
                <Image
                  src={`http://68.183.93.60/py/face_recognization/${data.photopath}`}
                  alt={data.image_id}
                  width={300} 
                  height={400} 
                  layout="intrinsic"
                  className="w-full rounded-lg transition-transform duration-300 hover:scale-105 group-hover:opacity-55"
                  onClick={() => openModal(index)}
                />

                <span className="absolute  left-2 bottom-2 hidden group-hover:block group-hover:p-2 group-hover:rounded-full ">
                  <div className="mt-3 flex -space-x-2 overflow-hidden">
                    {data?.matched_faces?.map((face, key) => (<img className="inline-block h-[32px] w-[32px]  rounded-full border-2 border-white" src={`http://68.183.93.60/py/face_recognization/${face?.person_photo}`} alt="" key={key} />))}
                  </div>
                </span>
                <span className="absolute  right-3 bottom-3 hidden group-hover:block group-hover:p-2.5 group-hover:rounded-full "><FaTrash /></span>
              </div>
            ))}
          </Masonry>
        )}


        {!loading && images.length === 0 && (
          <div className="text-center py-12">
            <Grid className="mx-auto h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">No images found</h3>
          </div>
        )}

        {modalOpen && images.length > 0 && (
          <div
            className="fixed inset-0 bg-[#000000a6] flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="relative bg-white p-5 rounded-lg shadow-lg max-w-2xl  w-full h-[508px] md:h-[673px] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl"
                onClick={closeModal}
              >
                &times;
              </button>

              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900"
                onClick={prevImage}
              >
                &#10094;
              </button>

              <Image
                src={`http://68.183.93.60/py/face_recognization/${images[currentImageIndex].photopath}`}
                alt="Preview"
                className="object-contain h-[100%] w-auto rounded-lg"
              />

              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900"
                onClick={nextImage}
              >
                &#10095;
              </button>
            </div>
          </div>
        )}

      </div>
    </div>

  );
};

export default MasonryGrid;
