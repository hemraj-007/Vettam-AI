import React from "react";

interface FooterProps {
  pageNumber: number;
}

const Footer: React.FC<FooterProps> = ({ pageNumber }) => {
  return (
    <div className="absolute bottom-0 left-[20mm] right-[20mm] h-10 border-t border-gray-300 text-xs text-gray-500 flex items-center justify-between px-2 print:border-gray-400 print:text-gray-600">
      <div className="flex items-center">
        <span className="text-gray-400">© 2025 Your Company</span>
      </div>
      
      <div className="flex items-center">
        {/* Right side - page number */}
        <span className="font-medium">Page {pageNumber}</span>
      </div>
    </div>
  );
};

export default Footer;