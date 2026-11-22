"use client";

import Image from "next/image";
import { useState } from "react";

type ServiceImageGalleryProps = {
  images: string[];
  serviceName: string;
};

export default function ServiceImageGallery({
  images,
  serviceName,
}: ServiceImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  if (images.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl bg-secondary sm:h-80">
        <span className="font-heading text-lg text-muted-foreground">
          {serviceName}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-64 overflow-hidden rounded-xl bg-secondary sm:h-80">
        <Image
          src={selectedImage}
          alt={serviceName}
          fill
          priority
          unoptimized
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedImage(image)}
              aria-label={`Show ${serviceName} photo ${index + 1}`}
              aria-pressed={selectedImage === image}
              className={`relative h-16 overflow-hidden rounded-lg border-2 sm:h-20 ${
                selectedImage === image
                  ? "border-primary"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 768px) 25vw, 15vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
