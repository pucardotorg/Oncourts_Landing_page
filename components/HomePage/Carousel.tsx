import React from "react";
import Image from "next/image";

const Carousel: React.FC = () => {
  return (
    <div className="w-full relative">
      <Image
        src="/images/baseImage.png"
        alt="24X7 Open & Networked Courts"
        width={1920}
        height={900}
        layout="responsive"
        className="w-full"
      />

      <div className="flex flex-wrap md:flex-nowrap gap-8 px-6 md:px-12 py-8 -mt-28 relative z-10">
        <a
          href="https://oncourts.kerala.gov.in/digit-ui/citizen/dristi/home/login"
          className="flex-1 flex items-center pl-6 rounded-[10px] border border-teal bg-teal text-white shadow-xl"
          target="/"
        >
          <Image
            src="/images/order.svg"
            alt="Logo"
            width={40}
            height={40}
            className="mr-6"
          />
          <div className="flex-1 py-4">
            <span
              className="block font-semibold text-base"
              style={{ fontSize: "18px" }}
            >
              Login as Litigant/Advocate/Clerk
            </span>
            <span className="block text-sm">
              To perform case-related actions and access case details and
              updates
            </span>
          </div>
          <div className="relative w-[320px] h-[200px]">
            <Image
              src="/images/image.png"
              alt="Logo"
              layout="fill"
              objectFit="cover"
              className="rounded-r-[10px]"
            />
          </div>
        </a>

        <a
          href="https://oncourts.kerala.gov.in/digit-ui/employee/user/login"
          className="flex-1 flex items-center pl-6 rounded-[10px] border border-teal bg-white text-teal shadow-xl"
          target="/"
        >
          <Image
            src="/images/order_teal.svg"
            alt="Logo"
            width={40}
            height={40}
            className="mr-6"
          />
          <div className="flex-1 py-4">
            <span
              className="block font-semibold text-base"
              style={{ fontSize: "18px" }}
            >
              Login as Judicial Officer/Court Staff
            </span>
            <span className="block text-sm">
              To perform actions as a member of the court
            </span>
          </div>
          <div className="relative w-[320px] h-[200px]">
            <Image
              src="/images/justiceImage.jpg"
              alt="Logo"
              layout="fill"
              objectFit="cover"
              className="rounded-r-[10px]"
            />
          </div>
        </a>
      </div>
    </div>
  );
};

export default Carousel;
