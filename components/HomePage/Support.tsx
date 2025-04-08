import React from "react";
import Image from "next/image";
import Link from "next/link";

const Support: React.FC = () => {
  return (
    <div className="bg-[rgba(0,126,126,0.1)]">
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-teal font-bold text-xl mb-4 pt-8">Support</h2>
        <p className="text-center text-darkGrey mb-8">
          ON Courts are designed to realize the vision of taking courts to
          people and offer multiple benefits.
        </p>
        <div className="flex gap-6">
          <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
            <h3 className="font-bold text-black mb-4">Resources</h3>
            <div className="flex items-center justify-between mb-4">
              <a
                href="https://drive.google.com/file/d/1j4mIw0K2F8m_urJE-zbu-oeluiOL-8Pg/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="flex space-x-2"
              >
                <Image
                  src="/images/boarding.svg"
                  alt="Boarding Icon"
                  width={24}
                  height={24}
                />
                <span className="text-gray-600">Advocate User Guide</span>
              </a>
            </div>
            <hr className="my-4" />
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <Image
                  src="/images/boarding.svg"
                  alt="Search Icon"
                  width={24}
                  height={24}
                />
                <span className="text-gray-600">
                  Standard Operating Procedures (SOPs) - Coming soon
                </span>
              </div>
            </div>
            <hr className="my-4" />
            <Link
              href="https://www.youtube.com/playlist?list=PL2HnAXES1w-ShQIq8DAhvqeYe-uLCAr6F"
              className="block"
            >
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <div className="flex space-x-2">
                  <Image
                    src="/images/youtube.svg"
                    alt="Youtube Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal">
                    24x7 ON Court Training Videos || Advocates
                  </span>
                </div>
                <Image
                  src="/images/arrow.svg"
                  alt="Icon"
                  width={24}
                  height={24}
                />
              </div>
            </Link>
            <hr className="my-4" />
            <Link
              href="https://www.youtube.com/watch?v=EDDAkm4FvBc"
              className="block"
            >
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <div className="flex space-x-2">
                  <Image
                    src="/images/youtube.svg"
                    alt="Youtube Icon"
                    width={24}
                    height={24}
                  />
                  <span className="text-teal">24X7 ON Court Launch Video</span>
                </div>
                <Image
                  src="/images/arrow.svg"
                  alt="Icon"
                  width={24}
                  height={24}
                />
              </div>
            </Link>
          </div>
          <div className="w-1/2 p-4 bg-white rounded-[15px] border border-teal shadow-md">
            <h3 className="font-bold text-black mb-4">Support</h3>
            <p className="text-gray-600 mb-4"></p>
            <div className="flex justify-center items-center">
              <a
                href="https://forms.gle/uCSgGiqGiMQYjjgeA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="py-2 px-4 border-2 border-darkGrey rounded-[5px] text-teal">
                  Click here to Submit the Grievance
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between space-x-6 px-6 mx-auto max-w-screen-xl p-8">
        <div className="w-1/2 px-28">
          <h2 className="font-bold text-darkGrey">Contact Us</h2>
          <p className="text-gray-600 mt-2">
            If you have any questions or need assistance, please feel free to
            contact us through the channels provided below.
          </p>
        </div>
        <div className="w-1/2 px-40">
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/phone.svg"
                alt="Icon"
                width={24}
                height={24}
              />
              <span className="text-teal font-bold">
                Helpline: <a href="callto:oncourt@gmail.com">0474 2919099</a>
              </span>
            </div>
            <hr className="my-2 border-teal" />
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/email.svg"
                alt="Icon"
                width={24}
                height={24}
              />
              <span className="text-teal font-bold">
                <a href="mailto:oncourtkollam@keralacourts.in">
                  oncourtkollam@keralacourts.in
                </a>
              </span>
            </div>
            <hr className="my-2 border-teal" />
          </div>

          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Image src="/images/time.svg" alt="Icon" width={24} height={24} />
              <span className="text-teal font-bold">
                Available from 10:00 - 17:00 IST <br />
                Monday - Saturday (except 2nd)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
