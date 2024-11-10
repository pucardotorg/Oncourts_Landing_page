import React from "react";
import Image from "next/image";

const Hero = () => {
  return (
    <div>
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
        <div className="flex space-x-4 m-8">
          <button
            className={`flex items-center w-full rounded-[15px] border border-teal overflow-hidden`}
          >
            <div className="flex-1 flex items-center space-x-2 pl-4">
              <Image
                src="/images/search.svg"
                alt="Icon"
                width={24}
                height={24}
              />
              <span>Case Number Record (CNR)</span>
            </div>
            <div className="flex-1">
              <img src="/images/base.jpg" alt="Large Icon" className="w-full h-full object-cover" />
            </div>
          </button>

          <button
            className={`flex items-center w-full rounded-[15px] border border-teal overflow-hidden`}
          >
            <div className="flex-1 flex items-center space-x-2 pl-4">
              <Image
                src="/images/search.svg"
                alt="Icon"
                width={24}
                height={24}
              />
              <span>Case Number</span>
            </div>
            <div className="flex-1">
              <img src="/images/base.jpg" alt="Large Icon" className="w-full h-full object-cover" />
            </div>
          </button>
        </div>
        <div className="flex space-x-8 mx-2">
          <div className="w-1/2">
            <h2 className="text-teal font-bold text-xl mb-4">Cause List</h2>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 mb-4 bg-white rounded-[5px] border border-teal shadow-md">
                <div className="flex flex-col items-start space-y-1">
                  <span className="font-medium text-teal">Daily Roster</span>
                  <span className="text-sm text-gray-600 flex items-center">
                    <Image
                      src="/images/search.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                    01 Jan 2024
                  </span>
                </div>
                <button className="py-1 px-3 bg-darkGrey text-white">
                  Download
                </button>
              </div>
            ))}
          </div>

          <div className="w-1/2 mb-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-teal font-bold text-xl">Notice Board / Announcements</h2>
              <button className="py-1 px-4 bg-white border border-teal rounded-[5px]" onClick={() => window.location.href = "/announcements"}>
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...Array(2)].map((_, sectionIndex) => (
                <div key={sectionIndex}>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="p-4 mb-4 bg-white rounded-[5px] border border-teal shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex space-x-2">
                          <span className="bg-teal text-white px-2 py-1 rounded-md text-sm">Tags</span>
                        </div>
                        <button className="py-1 px-3 border border-darkgrey rounded-md">
                          Download
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm flex items-center space-x-2">
                        <Image
                          src="/images/search.svg"
                          alt="Icon"
                          width={24}
                          height={24}
                        />
                        <span>Date: 01 Jan 2024</span>
                      </p>
                      <h3 className="font-bold text-black mt-2">Announcement Heading</h3>
                      <p className="text-teal text-sm mt-1">
                        This is a brief description of the announcement. It provides a quick summary or overview of the content.
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              <button className="py-1 px-3 border border-darkgrey rounded-md text-darkgrey">
                &#8592; Prev
              </button>
              <button className="py-1 px-3 bg-teal text-white rounded-md">1</button>
              <button className="py-1 px-3 border border-darkgrey text-darkgrey">2</button>
              <button className="py-1 px-3 border border-darkgrey text-darkgrey">3</button>
              <button className="py-1 px-3 bg-teal text-white rounded-md">
                Next &#8594;
              </button>
            </div>
          </div>

        </div>

        <div className="bg-[rgba(0,126,126,0.1)]">

          <div className="flex flex-col items-center mt-16 mb-4">
            <h2 className="text-teal font-bold text-xl mb-4 pt-8">Support</h2>
            <p className="text-center text-darkGrey mb-8">
              ON Courts are designed to realize the vision of taking courts to people and offer multiple benefits.
            </p>

            <div className="flex gap-6">
              <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
                <h3 className="font-bold text-black mb-4">Resources</h3>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <Image
                      src="/images/search.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-600">On-Boarding Guide</span>
                  </div>
                  <Image
                    src="/images/search.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <hr className="my-4" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <Image
                      src="/images/search.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                    <span className="text-gray-600">XX Doc</span>
                  </div>
                  <Image
                    src="/images/search.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <hr className="my-4" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <Image
                      src="/images/search.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                    <span className="text-teal">OnCourt Youtube</span>
                  </div>
                  <Image
                    src="/images/search.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                </div>
              </div>

              <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
                <h3 className="font-bold text-black mb-4">Grievance Redressal</h3>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
                </p>
                <div className="flex justify-center items-center">
                  <button className="py-2 px-4 border-2 border-darkGrey rounded-[5px] text-teal">
                    Click here to Submit the Grievance
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="flex justify-between space-x-6 px-6 mx-auto max-w-screen-xl">
            <div className="w-1/2 px-20">
              <h2 className="font-bold text-darkGrey">Contact Us</h2>
              <p className="text-gray-600 mt-2">
                If you have any questions or need assistance, please feel free to contact us through the channels provided below.
              </p>
            </div>

            <div className="w-1/2 px-40">
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/search.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal font-bold">Helpline: 123-456-7890</span>
                </div>
                <hr className="my-2 border-teal" />
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/search.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal font-bold">oncourt@gmail.com</span>
                </div>
                <hr className="my-2 border-teal" />
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src="/images/search.svg"
                    alt="Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal font-bold">
                    Available from 9:30 - 18:00 IST <br />
                    Our Opening Hours Mon. - Fri.
                  </span>
                </div>
              </div>
            </div>

          </div>


        </div>

      </div>
    </div>
  );
};

export default Hero;
