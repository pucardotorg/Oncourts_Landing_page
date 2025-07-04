import React from "react";

interface SearchTabsProps {
  t: (key: string) => string;
  selectedTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string }[];
}

const SearchTabs: React.FC<SearchTabsProps> = ({
  t,
  selectedTab,
  onTabChange,
  tabs,
}) => {
  return (
    <div className="flex justify-center w-fit px-1 py-1.5 my-8 mx-auto gap-1 rounded-lg border-2 border-[#CBD5E1]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-3 py-1 text-xl font-[Roboto] font-medium transition-colors rounded-md ${
            selectedTab === tab.id
              ? "bg-[#3A3A3A] text-white"
              : "text-[#64748B] hover:bg-gray-200"
          }`}
          style={{
            minWidth: "100px",
          }}
        >
          {t(tab.label)}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
