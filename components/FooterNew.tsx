import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FooterConfig } from "../data/FooterConfig.js";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <Link href={href}>
    <span className="text-[#FFFFFF] hover:text-[#E5E5E5] transition-colors cursor-pointer text-[14px] leading-[20px]">
      {children}
    </span>
  </Link>
);

const FooterNew: React.FC = () => {
  return (
    <footer className="bg-[#3A3A3A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src={FooterConfig.logo.imageUrl}
              alt={FooterConfig.logo.alt}
              width={FooterConfig.logo.width}
              height={FooterConfig.logo.height}
            />
            <p className="text-white text-sm mt-2">
              {FooterConfig.logo.tagline}
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8 flex-grow">
            {/* Quick Links */}
            <div>
              <h3 className="text-[#FFFFFF] text-[14px] leading-[20px] font-medium mb-3">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="/about">About ON Courts</FooterLink>
                </li>
                <li>
                  <FooterLink href="/tutorials">Video Tutorials</FooterLink>
                </li>
                <li>
                  <FooterLink href="/media-gallery">Media Gallery</FooterLink>
                </li>
              </ul>
            </div>

            {/* Help & Resources */}
            <div>
              <h3 className="text-[#FFFFFF] text-[14px] leading-[20px] font-medium mb-3">
                Help & Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="/support">Support Form</FooterLink>
                </li>
                <li>
                  <FooterLink href="/manual">User Manual</FooterLink>
                </li>
                <li>
                  <FooterLink href="/contact">Contact Details</FooterLink>
                </li>
                <li>
                  <FooterLink href="/faqs">FAQs</FooterLink>
                </li>
              </ul>
            </div>

            {/* Information & Privacy */}
            <div>
              <h3 className="text-[#FFFFFF] text-[14px] leading-[20px] font-medium mb-3">
                Information & Privacy
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="/rti">RTI</FooterLink>
                </li>
                <li>
                  <FooterLink href="/terms">Terms & Conditions</FooterLink>
                </li>
                <li>
                  <FooterLink href="/privacy">Privacy Policy</FooterLink>
                </li>
              </ul>
            </div>

            {/* External Links */}
            <div>
              <h3 className="text-[#FFFFFF] text-[14px] leading-[20px] font-medium mb-3">
                External Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <FooterLink href="https://districts.ecourts.gov.in/kollam">
                    Kollam District Court
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="https://highcourtofkerala.gov.in">
                    Kerala High Court
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="https://main.sci.gov.in">
                    Supreme Court
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="https://njdg.ecourts.gov.in/njdg_public/main.php">
                    NJDG - District
                  </FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 text-center text-[#FFFFFF] text-[12px] leading-[16px] opacity-80 border-t border-white/20">
          &copy; High Court of Kerala 2025 | Last updated on - 24/12/2025
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
