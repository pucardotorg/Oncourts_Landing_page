import Image from "next/image";
import { FooterConfig } from "../data/FooterConfig"; // Ensure path is correct
import Link from "next/link";
import { useSafeTranslation } from "../hooks/useSafeTranslation";
import { useMediaQuery } from "@mui/material";

const Footer: React.FC = () => {
  const { t } = useSafeTranslation();
  const isMobile = useMediaQuery("(max-width:640px)");

  return (
    <footer className="px-8 md:px-16 py-10 font-roboto bg-footerBg text-white w-full mt-auto">
      <div
        className="flex flex-col md:flex-row justify-between md:items-center md:items-start mx-auto"
        style={{ gap: "30px" }}
      >
        <div>
          {/* Left Section: Logo */}
          <div
            className={`flex flex-col md:items-start ${isMobile ? "w-[70%] border-b border-[#CBD5E1] py-4" : ""}`}
          >
            <Image
              src={FooterConfig.logo.imageUrl}
              alt={FooterConfig.logo.alt}
              width={
                isMobile
                  ? FooterConfig.logo.smallWidth
                  : FooterConfig.logo.width
              }
              height={
                isMobile
                  ? FooterConfig.logo.smallHeight
                  : FooterConfig.logo.height
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:flex md:flex-row gap-10">
          {/* Quick Links Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[17px] font-normal mb-2">
              {t("QUICK_LINKS")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4">
              {FooterConfig.quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[20px] font-medium md:font-medium hover:underline"
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Help & Resources Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[17px] font-normal mb-2">
              {t("HELP_RESOURCES")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4">
              {FooterConfig.helpResources.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[20px] font-medium md:font-medium hover:underline"
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Information & Privacy Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[17px] font-normal mb-2">
              {t("INFORMATION_PRIVACY")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4">
              {FooterConfig.informationPrivacy.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[20px] font-medium md:font-medium hover:underline"
                  target={link.url.startsWith("http") ? "_blank" : "_self"}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : ""}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* External Links Section */}
          <div className="flex flex-col">
            <h3 className="text-[15px] md:text-[17px] font-normal mb-2">
              {t("EXTERNAL_LINKS")}
            </h3>
            <div className="grid grid-cols-1 gap-y-4">
              {FooterConfig.externalLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  className="text-[17px] md:text-[20px] font-medium md:font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12">
        <hr className="border-t border-white" />
      </div>

      {/* Copyright Section */}
      <div className="mt-6">
        <div className="text-center text-[15px] md:text-[17px]">
          {t(FooterConfig.copyright)}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
