// src/components/Page.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageProps {
  children: React.ReactNode;
  pageNumber: number;
}

const Page: React.FC<PageProps> = ({ children, pageNumber }) => {
  return (
    <div
      className="w-[210mm] h-[297mm] mx-auto my-6 bg-white shadow-md relative flex flex-col justify-between"
      style={{ pageBreakAfter: "always" }}
    >
      <Header />
      <div className="flex-1 px-[20mm] pt-[40px] pb-[40px] overflow-hidden">
        {children}
      </div>
      <Footer pageNumber={pageNumber} />
    </div>
  );
};

export default Page;
