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
    <section className="pt-8 pb-24 bg-white">
      <div className="w-[90vw] mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-[64px] leading-[70px] text-[#3A3A3A] font-libre mb-[20px] mx-[20px] border-b border-[#CBD5E1] pb-[10px]">
            Media Gallery
          </h1>
          <h2 className="text-[40px] leading-[48px]  font-libre font-normal text-center text-[#3A3A3A] mb-4 px-4">
            Courtroom, ON Court Kollam
          </h2>
          <p className="text-[28px] leading-[40px] font-roboto font-normal tracking-[-0.56px] text-center text-[#334155] px-4 mb-8">
            With a waiting area and help desk, the ON Court is designed to be
            people-centric. Equipped with state of art equipment, it enables
            quality virtual and hybrid hearing experience for users.
          </p>
        </div>

        {/* Main Image Display with Progress Bar */}
        <div className="relative aspect-video w-full h-[70vh] mx-auto mb-8 px-4">
          {/* Progress Bar */}
          <div className="absolute bottom-5 h-2 left-8 right-8 z-10">
            <div className="flex items-center gap-2">
              {galleryImages.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full flex-1 transition-all duration-300 ${index === galleryImages.findIndex((img) => img.id === currentImage.id) ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </div>

          <div className="relative w-full h-full">
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              className="object-cover rounded-t-[12px]"
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

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mx-auto px-4">
          {galleryImages.map((image, index) => {
            const isFirstRow = index < 6;
            const isLastRow =
              index >= Math.floor((galleryImages.length - 1) / 6) * 6;
            const isFirstInRow = index % 6 === 0;
            const isLastInRow = (index + 1) % 6 === 0;
            const isLastPositionInLastRow =
              isLastRow && isLastInRow && (index + 1) % 6 === 0;

            let borderRadius = "";
            if (isFirstRow && isFirstInRow) borderRadius = "rounded-tl-[12px]";
            else if (isFirstRow && isLastInRow)
              borderRadius = "rounded-tr-[12px]";
            else if (isLastRow && isFirstInRow)
              borderRadius = "rounded-bl-[12px]";
            else if (isLastPositionInLastRow)
              borderRadius = "rounded-br-[12px]";

            return (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(image)}
                className={`relative aspect-video w-full overflow-hidden transition-all ${borderRadius} ${currentImage.id === image.id ? "ring-2 ring-[#3A3A3A]" : ""}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MediaGallery;
