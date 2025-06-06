"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageCarouselModal } from "./image-carousel-modal";
import { ImageIcon } from "lucide-react";

// Light gray base64 placeholder (1x1 pixel)
const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getImageUrl = (imagePath: string, isUpload = false) => {
  if (!imagePath) return "";

  // If the URL already contains cloudfront domain, return it as is
  if (imagePath.includes("dve7rykno93gs.cloudfront.net")) {
    return imagePath;
  }

  const baseUrl = "https://dve7rykno93gs.cloudfront.net";

  // If the path starts with /temp/temp/ or is just a number, it's a temp image
  if (imagePath.startsWith("/temp/temp/") || /^\d+$/.test(imagePath)) {
    const id = imagePath.split("/").pop();
    const url = `${baseUrl}/temp/temp/${id}`;
    return url;
  }

  // For i218 paths, just append the path directly
  const url = `${baseUrl}/uploads/imgs/${imagePath}`;
  return url;
};

function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full h-full min-h-full bg-gray-100 flex flex-col items-center justify-center rounded-2xl ${className}`}
    >
      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-gray-500 text-sm">Image not available</span>
    </div>
  );
}

function PropertyShowcaseImages({
  images,
  src,
}: {
  images: string[];
  src?: boolean;
}) {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Only show up to 4 images in the grid
  const gridImages = useMemo(() => {
    if (!images?.length) return [];
    return images.filter(Boolean).slice(0, 4);
  }, [images]);

  if (!gridImages.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 row-span-2 relative max-h-[450px]">
          <ImagePlaceholder />
        </div>
      </div>
    );
  }

  // At this point we know gridImages has at least one element
  const mainImage = gridImages[0]!;
  const rightImages = gridImages.slice(1, 4);

  const handleImageError = (index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsCarouselOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Main large property image (left, spans two rows) */}
        <div className="md:col-span-2 row-span-2 relative max-h-[450px]">
          <div className="rounded-2xl overflow-hidden h-full">
            {!imgErrors[0] ? (
              <button
                onClick={() => handleImageClick(0)}
                className="w-full h-full focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 rounded-2xl"
                aria-label="Open image gallery at main image"
              >
                <Image
                  src={getImageUrl(mainImage, src)}
                  alt="Main property image"
                  width={900}
                  height={600}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  onError={() => handleImageError(0)}
                  placeholder="blur"
                  blurDataURL={PLACEHOLDER_BLUR}
                />
              </button>
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        </div>

        {/* Right column with up to three smaller property images (stacked vertically) */}
        <div className="flex flex-col gap-4 max-h-[450px]">
          {rightImages.map((image, index) => (
            <div
              key={`right-image-${index + 1}`}
              className="rounded-2xl overflow-hidden h-1/3 flex-1"
              aria-label={`Additional property image ${index + 2}`}
            >
              {!imgErrors[index + 1] ? (
                <button
                  onClick={() => handleImageClick(index + 1)}
                  className="w-full h-full focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 rounded-2xl"
                  aria-label={`Open image gallery at image ${index + 2}`}
                >
                  <Image
                    src={getImageUrl(image, src)}
                    alt={`Property image ${index + 2}`}
                    width={450}
                    height={300}
                    className="w-full h-[200px] md:h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    onError={() => handleImageError(index + 1)}
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER_BLUR}
                  />
                </button>
              ) : (
                <ImagePlaceholder />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* See more photos button */}
      <div className="text-left mt-2">
        <button
          className="text-brand-blue font-medium hover:underline focus:outline-none focus:underline"
          onClick={() => handleImageClick(0)}
          aria-label="See more photos"
        >
          See more photos
        </button>
      </div>

      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={images.filter(Boolean)}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        initialIndex={selectedImageIndex}
        getImageUrl={getImageUrl}
        src={src}
      />
    </>
  );
}

export default function PropertyShowcase({
  images,
  src,
}: {
  images: string[];
  src?: boolean;
}) {
  // Ensure we have a stable array on the server side
  const stableImages = images?.filter(Boolean) ?? [];

  return (
    <section
      className="property-showcase"
      aria-labelledby="property-showcase-heading"
    >
      <h2 id="property-showcase-heading" className="sr-only">
        Property Showcase
      </h2>
      <PropertyShowcaseImages images={stableImages} src={src} />
    </section>
  );
}
