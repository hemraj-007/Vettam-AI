import React from "react";

const Header: React.FC = () => {
  return (
    <div className="absolute top-0 left-[20mm] right-[20mm] h-10 border-b border-gray-300 text-xs text-gray-500 flex items-center justify-between px-2 print:border-gray-400 print:text-gray-600">
      <div className="flex items-center space-x-4">
        {/* You can add document title, company name, etc. here */}
        <span className="font-medium">Document Title</span>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Date or other header info */}
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default Header;