import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-between">
        {/* <div className="flex flex-col">
          <div className="flex items-center mb-4">
            <Image src="/images/logo.png" alt="Your Company" width={100} height={50} />
          </div>
          <p className="text-sm leading-tight mb-2">Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molesti.</p>

        </div> */}
        <div className="flex flex-col w-1/5">
          <div className="flex items-center mb-2">
            <Image src="/images/logo.png" alt="Your Company" width={100} height={50} />
          </div>
          <p className="text-sm leading-tight mb-2">
            Lorem ipsum dolor sit amet consectetur. Commodo pulvinar molesti.
          </p>
        </div>
        <div className="flex space-x-16">
          <div>
            <h3 className="text-lg font-semibold mb-2">Links</h3>
            <ul>
              <li className="mb-5">
                <Link href="/sub1">
                  <a className="text-sm hover:underline">Standard Operating Procedures (SOPs)</a>
                </Link>
              </li>
              <li className="mb-5">
                <Link href="/sub2">
                  <a className="text-sm hover:underline">Privacy Policy</a>
                </Link>
              </li>
              <li className="mb-5">
                <Link href="/sub3">
                  <a className="text-sm hover:underline">Terms and Conditions</a>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Important Links</h3>
            <ul>
              <li className="mb-5">
                <Link href="/sub4">
                  <a className="text-sm hover:underline">Kerala High Court Website</a>
                </Link>
              </li>
              <li className="mb-5">
                <Link href="/sub5">
                  <a className="text-sm hover:underline">Kollam e-courts website</a>
                </Link>
              </li>
              <li className="mb-5">
                <Link href="/sub6">
                  <a className="text-sm hover:underline">Kerala High Court YouTube Channel</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="border-gray-600 my-4" />
      <div className="text-center text-sm">
        © High Court of Kerala 2024
      </div>
    </footer>
  );
};

export default Footer;
