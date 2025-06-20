import React from 'react';

interface SearchTabsProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  tabs: { id: string; label: string; }[];
}

const SearchTabs: React.FC<SearchTabsProps> = ({ selectedTab, onTabChange, tabs }) => {  
  return (
    <div className="flex justify-center w-fit p-2 my-8 mx-auto gap-1 rounded-lg border-2 border-[#CBD5E1]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.label)}
          className={`px-4 py-2 text-2xl font-['Raleway', 'Raleway Fallback'] font-medium transition-colors rounded-md ${selectedTab === tab.label 
            ? 'bg-[#3A3A3A] text-white' 
            : 'text-[#64748B] hover:bg-gray-200'}`}
          style={{
            minWidth: '100px',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
