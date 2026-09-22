import { useEffect, useState } from "react";

import {
  handleImageError,
  PLACEHOLDER_IMAGE,
} from "../../utils/catalog";

interface ProductGalleryProps {
  // Nullable on the API, so the placeholder stands
  // in when a product has no image.
  image?: string | null;

  gallery?: string[];
  name: string;
}

export default function ProductGallery({
  image,
  gallery = [],
  name,
}: ProductGalleryProps) {
  const images =
    gallery.length > 0
      ? gallery
      : [image || PLACEHOLDER_IMAGE];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [image, gallery]);

  return (
    <div className="space-y-6">

      {/* Main Image */}

      <div
        className="
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-8
          shadow-sm
        "
      >
        <img
          src={selectedImage}
          alt={name}
          onError={handleImageError}
          className="
            mx-auto
            h-[450px]
            w-full
            object-contain
            transition-all
            duration-500
            hover:scale-105
          "
        />
      </div>

      {/* Thumbnails */}

      {images.length > 1 && (
        <div className="flex flex-wrap justify-center gap-4">

          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(img)}
              className={`
                overflow-hidden
                rounded-2xl
                border-2
                bg-white
                p-2
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg

                ${
                  selectedImage === img
                    ? "scale-105 border-blue-600 shadow-lg"
                    : "border-slate-200"
                }
              `}
            >
              <img
                src={img}
                alt={`${name} ${index + 1}`}
                onError={handleImageError}
                className="h-20 w-20 object-contain"
              />
            </button>
          ))}

        </div>
      )}

    </div>
  );
}