// src/App.tsx
import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";

const App: React.FC = () => {
  // Sidebar always open
  const sidebarOpen = true;

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-red-900 to-blue-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/50 via-transparent to-blue-600/30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Flowing Shapes */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-red-600/30 rounded-full blur-2xl animate-spin-slow"></div>
          <div className="absolute top-1/3 -left-20 w-60 h-60 bg-gradient-to-br from-purple-400/30 to-pink-600/30 rounded-full blur-2xl animate-bounce-slow"></div>
        </div>
      </div>

      {/* Sidebar (always open) */}
      <div className="w-80 transition-all duration-500 ease-in-out z-20">
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        {/* (Toggle button removed click) */}
        <button
          className="fixed top-6 left-6 z-50 bg-white/20 backdrop-blur-md text-white p-3 rounded-xl shadow-lg border border-white/30 pointer-events-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Editor Container */}
        <div className="transition-all duration-500 ease-in-out pl-20 pr-6 pt-6 relative z-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
            <Editor />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
