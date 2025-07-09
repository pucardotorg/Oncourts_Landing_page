import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryImages, GalleryImage } from "../../data/GalleryConfig";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const MediaGallery: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<GalleryImage>(
    galleryImages[0]
  );

  const handlePrevious = () => {
    const currentIndex = galleryImages.findIndex(
      (img) => img.id === currentImage.id
    );
    const previousIndex =
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1;
    setCurrentImage(galleryImages[previousIndex]);
  };

  const handleNext = () => {
    const currentIndex = galleryImages.findIndex(
      (img) => img.id === currentImage.id
    );
    const nextIndex =
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentImage(galleryImages[nextIndex]);
  };

  const handleThumbnailClick = (image: GalleryImage) => {
    setCurrentImage(image);
  };

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-[#3A3A3A] hover:text-[#666666]">
            Home
          </Link>
          <span className="text-[#3A3A3A]">/</span>
          <span className="text-[#3A3A3A] ">Media Gallery</span>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-[32px] sm:text-[48px] leading-[1.2] sm:leading-[56px] text-[#3A3A3A] font-libre mb-8 sm:mb-12">
            Media Gallery
          </h1>
          <h2 className="text-[28px] sm:text-[40px] leading-[1.2] sm:leading-[48px] font-libre font-normal text-center text-[#3A3A3A] mb-4 px-4">
            Courtroom, ON Court Kollam
          </h2>
          <p className="text-[18px] sm:text-[28px] leading-[1.4] sm:leading-[40px] font-roboto font-normal tracking-[-0.56px] text-center text-[#334155] px-4 mb-8">
            With a waiting area and help desk, the ON Court is designed to be
            people-centric. Equipped with state of art equipment, it enables
            quality virtual and hybrid hearing experience for users.
          </p>
        </div>

        {/* Main Image Display */}
        <div className="relative aspect-video w-full max-w-4xl mx-auto mb-4">
          <div className="relative w-full h-full">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-grow h-[2px] bg-[#D9D9D9] rounded-full">
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-full ${index === galleryImages.findIndex((img) => img.id === currentImage.id) ? "bg-[#3A3A3A]" : ""}`}
                  style={{
                    width: `${100 / galleryImages.length}%`,
                    float: "left",
                    transition: "background-color 0.3s ease-in-out",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 max-w-4xl mx-auto px-4 sm:px-0">
          {galleryImages.map((image) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(image)}
              className={`relative aspect-video w-full cursor-pointer rounded-lg overflow-hidden hover:opacity-90 transition-opacity ${currentImage.src === image.src ? "ring-2 ring-[#0F766E]" : ""}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaGallery;
