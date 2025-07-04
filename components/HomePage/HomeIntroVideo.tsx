import React, { useState } from 'react';
import { useSafeTranslation } from '../../hooks/useSafeTranslation';
import { useRouter } from 'next/router';

const HomeIntroVideo = () => {
  const { t } = useSafeTranslation();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.login-dropdown')) {
        setLoginDropdownOpen(false);
      }
    };

    if (loginDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [loginDropdownOpen]);

  const handleVideoClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative bg-white py-12 px-10 sm:px-6 lg:px-8 md:py-16">
      <div className="px-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="font-libre font-normal text-[#3A3A3A] text-6xl leading-[78px] tracking-normal">
              {t('TAKING_COURT_TO_PEOPLE')}
            </h1>
            <p 
            className="font-sans font-normal text-[#3A3A3A] text-[20px] leading-[36px] tracking-normal"


            >
              {t('COURT_DESCRIPTION')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative login-dropdown">
                <button
                  className="w-[241px] flex justify-center items-center gap-2  px-6 py-3 bg-[#0F766E] text-white rounded-xl font-medium hover:bg-[#115E59] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLoginDropdownOpen(!loginDropdownOpen);
                  }}
                >
                  <span>{t('LOGIN')}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform ${loginDropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {loginDropdownOpen && (
                  <div 
                    className="absolute left-0 top-full mt-1 w-[241px] bg-white rounded-md shadow-lg overflow-hidden z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="w-[241px] px-4 py-3 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E]"
                      onClick={() => {
                        router.push('/advocate-login');
                        setLoginDropdownOpen(false);
                      }}
                    >
                      {t('ADVOCATE_LITIGANT_LOGIN')}
                    </button>
                    <button
                      className="w-[241px] px-4 py-3 text-left text-[#3A3A3A] hover:bg-gray-50 transition-colors flex justify-center items-center gap-2 text-sm hover:text-[#0F766E]"
                      onClick={() => {
                        router.push('/judge-login');
                        setLoginDropdownOpen(false);
                      }}
                    >
                      {t('JUDGE_STAFF_LOGIN')}
                    </button>
                  </div>
                )}
              </div>
              <button
                className="w-[241px] px-6 py-3 border border-[#0F766E] text-[#0F766E] rounded-xl font-medium hover:bg-gray-50 transition-colors"
                onClick={() => router.push('/search')}
              >
                {t('CASE_SEARCH')}
              </button>
            </div>
          </div>

          {/* Right Video Section */}
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-[#F3F4F6]">
            <div 
              className="absolute inset-0 cursor-pointer group flex items-center justify-center"
              onClick={handleVideoClick}
            >
              {!isPlaying ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F766E]/20 to-transparent">
                    <div className="absolute inset-0 p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-medium text-white mb-2">Watch Video</h3>
                      <p className="text-white/80 max-w-[300px]">Learn how OnCourts is transforming the judicial system</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 text-[#0F766E] ml-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </>
              ) : (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Court Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeIntroVideo;    
