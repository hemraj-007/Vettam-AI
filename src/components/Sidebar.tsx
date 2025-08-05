import React, { useState } from "react";
import { 
  FaFileAlt,
  FaFolder,
  FaBell,
  FaChevronDown
} from "react-icons/fa";
import { FiEdit, FiHome, FiSettings, FiCalendar } from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen}) => {
  const [activeItem, setActiveItem] = useState("editor");
  const [dashboardOpen, setDashboardOpen] = useState(true);

  const menuItems = [
    { id: "overview", icon: <FiHome />, label: "Overview", parent: "dashboard" },
    { id: "performance", icon: <FaFileAlt />, label: "Performance", parent: "dashboard" },
    { id: "quality", icon: <FaFolder />, label: "Quality", parent: "dashboard" },
    { id: "editor", icon: <FiEdit />, label: "Editor", parent: null },
    { id: "reports", icon: <FaFileAlt />, label: "Reports", parent: null },
    { id: "projects", icon: <FaFolder />, label: "Projects", parent: null },
    { id: "calendar", icon: <FiCalendar />, label: "Calendar", parent: null },
    { id: "notifications", icon: <FaBell />, label: "Notifications", parent: null },
    { id: "settings", icon: <FiSettings />, label: "Settings", parent: null },
  ];

  if (!isOpen) {
    return (
      <aside className="h-screen sticky top-0 flex flex-col items-center py-6 w-16 relative">
        {/* Blurred Background */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border-r border-white/20"></div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">$</span>
          </div>
          
          {/* Menu Icons */}
          <nav className="space-y-4 flex flex-col items-center">
            {menuItems.filter(item => !item.parent).slice(0, 5).map((item) => (
              <div
                key={item.id}
                className={`relative group p-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeItem === item.id
                    ? "bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30"
                    : "hover:bg-white/10 text-white/70 hover:text-white"
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                <div className="text-sm">{item.icon}</div>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-black/80 backdrop-blur-md text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                  {item.label}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-black/80 rotate-45 border-l border-b border-white/10"></div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-screen sticky top-0 flex flex-col w-80 relative overflow-hidden">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl border-r border-white/20"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">$</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Vettam
                </h2>
              </div>
            </div>
            
            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <span className="text-white text-xs">📋</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {/* Dashboard Section */}
          <div className="mb-4">
            <div
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer group ${
                dashboardOpen
                  ? "bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30"
                  : "hover:bg-white/10 text-white/80 hover:text-white"
              }`}
              onClick={() => setDashboardOpen(!dashboardOpen)}
            >
              <div className="flex items-center space-x-3">
                <FiHome className="text-base" />
                <span className="font-medium text-sm">Dashboard</span>
              </div>
              <FaChevronDown className={`text-xs transition-transform duration-200 ${dashboardOpen ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Dashboard Submenu */}
            {dashboardOpen && (
              <div className="ml-4 mt-2 space-y-1">
                {menuItems.filter(item => item.parent === "dashboard").map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeItem === item.id
                        ? "bg-white/15 backdrop-blur-sm text-white shadow-md border border-white/20"
                        : "hover:bg-white/8 text-white/70 hover:text-white"
                    }`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <div className="text-sm opacity-70">{item.icon}</div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Menu Items */}
          {menuItems.filter(item => !item.parent).slice(1).map((item) => (
            <div
              key={item.id}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                activeItem === item.id
                  ? "bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30"
                  : "hover:bg-white/10 text-white/80 hover:text-white"
              }`}
              onClick={() => setActiveItem(item.id)}
            >
              <div className="text-base">{item.icon}</div>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-4">
          {/* Help & Support */}
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer text-white/80 hover:text-white">
            <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
              <span className="text-xs">?</span>
            </div>
            <span className="font-medium text-sm">Help & Support</span>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <h3 className="text-white font-semibold text-sm mb-2">Let's start!</h3>
            <p className="text-white/70 text-xs mb-4 leading-relaxed">
              Get familiar with Vettam by exploring and testing product features
            </p>
            <button className="w-full bg-gradient-to-r from-blue-400 to-red-500 text-white font-medium text-sm py-2.5 px-4 rounded-xl hover:from-blue-500 hover:to-red-600 transition-all duration-200 shadow-lg">
              <div className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>AI-Powered Analytics</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;