import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label }) => {
  const router = useRouter();
  return (
    <Link href={href} passHref>
      <div
        className={`py-1 text-base font-medium text-white hover:text-zinc-300 md:ml-4 lg:ml-8 cursor-pointer ${
          router.pathname === href ? "underline underline-offset-4" : ""
        }`}
      >
        <h2>{label}</h2>
      </div>
    </Link>
  );
};

const Header = () => {
  const router = useRouter();

  return (
    <div className="font-Poppins">
      <nav className="bg-teal">
        <div className="justify-center hidden mx-auto shadow-sm sm:hidden md:block md:px-6 lg:px-44">
          <div className="relative flex items-center justify-between py-7">
            <div className="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center flex-shrink-0 h-8 md:w-32 lg:w-40"
              >
                <Link href="/" passHref>
                  <Image
                    className="block"
                    src="/images/logo.png"
                    alt="OnCourts Logo"
                    width={120}
                    height={40}
                  />
                </Link>
              </motion.div>
              <NavLink href="/" label="Home" />
              <NavLink href="/about" label="About Us" />
              <NavLink href="/announcements" label="Announcements" />
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 bg-white rounded-full">
              <Link href="/search" passHref>
                <button className="flex items-center font-semibold text-black md:py-2 md:px-4 lg:mr-1">
                  <Image
                    className="block"
                    src="/images/search.svg"
                    alt="Search Icon"
                    width={24}
                    height={24}
                  />
                  <span className="hidden md:inline">Search for a Case</span>
                </button>
              </Link>
            </div>
            {router.pathname === "/" && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 bg-white rounded-full">
                <Link href="/login" passHref>
                  <button className="flex items-center font-semibold text-black md:py-2 md:px-4 lg:mr-1">
                    <span className="mr-2 hidden md:inline">Login</span>
                    <Image
                      className="block"
                      src="/images/search.svg"
                      alt="Search Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
