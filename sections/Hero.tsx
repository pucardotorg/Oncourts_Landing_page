import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative w-full">
      <div className="w-full h-64 relative">
        <Image
          src="/images/base.jpg"
          alt="Base Image"
          layout="fill"
          objectFit="cover"
          height={600}
        />
        <div className="absolute mt-12 top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <div className="mb-4">
            <Image
              src="/images/small_img.png"
              alt="Small Image"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold">24X7 Open & Networked Courts</h2>
          <p className="mt-2 text-base">
            The Kerala High Court is launching a new court, called 24x7 ON Courts,
            with a transformed dispute resolution experience for all users. The 24x7 ON Courts
            advance the vision outlined in Phase III of the Supreme Court eCourts policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
