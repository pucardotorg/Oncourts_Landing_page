import React from 'react';

interface SearchTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ selectedTab, onTabChange }) => {
  const tabs = ["Filing Number", "Case Number", "CNR Number", "Advocate", "Litigant", "All"];
  
  return (
    <div className="flex justify-center w-fit p-2 my-8 mx-auto gap-1 rounded-lg border-2 border-[#CBD5E1]">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 text-2xl font-['Raleway', 'Raleway Fallback'] font-medium transition-colors rounded-md ${selectedTab === tab 
            ? 'bg-[#3A3A3A] text-white' 
            : 'text-[#64748B] hover:bg-gray-200'}`}
          style={{
            minWidth: '100px',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
