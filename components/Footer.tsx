import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-between">
        <div className="flex flex-col w-1/5">
          <div className="flex items-center mb-2">
            <Image
              src="/images/logo.png"
              alt="High Court of Kerala Logo"
              width={100}
              height={50}
            />
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
                <Link href="/sub1" className="text-sm hover:underline">
                  Standard Operating Procedures (SOPs)
                </Link>
              </li>
              <li className="mb-5">
                <Link
                  href="/policies-conditions#privacy"
                  className="text-sm hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li className="mb-5">
                <Link
                  href="/policies-conditions#terms"
                  className="text-sm hover:underline"
                >
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Important Links</h3>
            <ul>
              <li className="mb-5">
                <Link
                  href="https://highcourt.kerala.gov.in/index.php#"
                  className="text-sm hover:underline"
                >
                  Kerala High Court Website
                </Link>
              </li>
              <li className="mb-5">
                <Link
                  href="https://kollam.dcourts.gov.in/#"
                  className="text-sm hover:underline"
                >
                  Kollam e-courts website
                </Link>
              </li>
              <li className="mb-5">
                <Link
                  href="https://www.youtube.com/watch?v=SuigEFEwGjk"
                  className="text-sm hover:underline"
                >
                  Kerala High Court YouTube Channel
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <hr className="border-gray-600 my-4" />
      <div className="text-center text-sm">© High Court of Kerala 2024</div>
    </footer>
  );
};

export default Footer;
