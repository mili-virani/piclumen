import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { getPersonGallery } from "@/utils/api";


export default function GalleryModal({ isOpen, setIsOpen, personId }) {
    const [selectedImage, setSelectedImage] = useState();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await getPersonGallery(personId);
            if (response && Array.isArray(response?.photos)) {
                setImages(response?.photos || []);
                setSelectedImage(response?.photos.length ? response?.photos[0] : null);
            } else {
                setImages([]);
                setSelectedImage(null);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isOpen && personId) {
            fetchImages();
        }
    }, [isOpen, personId]);
    const nextImage = () => {
        const currentIndex = images.findIndex((img) => img.image_id === selectedImage.image_id);
        setSelectedImage(images[(currentIndex + 1) % images.length]);
    };

    const prevImage = () => {
        const currentIndex = images.findIndex((img) => img.image_id === selectedImage.image_id);
        setSelectedImage(images[(currentIndex - 1 + images.length) % images.length]);
    };
    console.log(selectedImage, "selectedImage")
    return (
        <>
            {!loading && images && images?.length > 0 && selectedImage && (

                <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                    <div className="relative w-full max-w-4xl mx-auto pt-8 p-5 bg-white ">

                        {/* Close Button */}
                        <button onClick={() => setIsOpen(false)} className="absolute top-1 right-2 text-gray-700 hover:text-gray-900 text-2xl">&times;</button>

                        {/* Main Image View */}
                        <div className="flex items-center justify-center relative">
                            <button onClick={prevImage} className="absolute left-2 bg-gray-800 text-white p-2 rounded-full">&lt;</button>

                            <img src={`http://68.183.93.60/py/face_recognization/${selectedImage?.photopath}`} alt={selectedImage?.image_id} className="w-full h-[70vh] object-contain rounded-lg shadow-lg" />

                            <button onClick={nextImage} className="absolute right-2 bg-gray-800 text-white p-2 rounded-full">&gt;</button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex overflow-x-auto space-x-2 mt-4 px-4">
                            {images && images.map((img) => (
                                <img
                                    key={img?.image_id}
                                    src={`http://68.183.93.60/py/face_recognization/${img?.photopath}`}
                                    alt={img.image_id}
                                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${img.image_id === selectedImage?.image_id ? "border-orange-500" : "border-transparent"
                                        }`}
                                    onClick={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
}
