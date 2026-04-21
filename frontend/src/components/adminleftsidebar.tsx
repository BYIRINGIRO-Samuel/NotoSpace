import { Link, useLocation } from "react-router-dom";
import { admindashboardlinks } from "../constants/admin";
import React, { useState } from "react";

const AdminLeftsidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const handleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="w-72 md:flex flex-col min-h-screen bg-white border-r border-gray-200 shadow-sm">
      <div className="flex-1 flex flex-col gap-6 px-6 py-3">
        <Link to="/studentdashboard" className="flex items-center gap-2 mb-8">
          <svg
            className="w-8 h-8 text-[#349156]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 20.5L21 12 3 3.5v7l12 1.5-12 1.5v7z" fill="#349156" />
          </svg>
          <h1 className="text-2xl font-bold text-blue-500">LearnLite</h1>
        </Link>
        <hr className="border-t border-gray-200" />
        <div className="flex flex-col gap-2">
          {admindashboardlinks.map((link) => {
            const isParentActive = link.children
              ? location.pathname === link.route ||
                link.children.some((child) => location.pathname === child.route)
              : false;
            return (
              <React.Fragment key={link.route}>
                {link.children ? (
                  <>
                    <button
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                        isParentActive
                          ? "bg-blue-400 text-white"
                          : "text-gray-700 hover:bg-blue-400 hover:text-white"
                      } transition w-full text-left ${
                        openDropdown === link.label && !isParentActive
                          ? "bg-[#F3F7FA] text-[#349156]"
                          : ""
                      }`}
                      onClick={() => handleDropdown(link.label)}
                    >
                      <img
                        src={link.imgURL}
                        alt={link.label}
                        className="h-6 w-6"
                      />
                      <span className="font-medium flex-1">{link.label}</span>
                      <svg
                        className={`w-4 h-4 ml-auto transition-transform ${
                          openDropdown === link.label ? "rotate-90" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {openDropdown === link.label && (
                      <div className="ml-8 flex flex-col gap-1 mt-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.route}
                            to={child.route}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-blue-400 hover:text-white transition ${
                              location.pathname === child.route
                                ? "bg-blue-400 text-white"
                                : ""
                            }`}
                          >
                            <img
                              src={child.imgURL}
                              alt={child.label}
                              className="h-3 w-3"
                            />
                            <span className="text-sm">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.route}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                      isParentActive
                        ? "bg-blue-400 text-white"
                        : "text-gray-700 hover:bg-blue-400 hover:text-white"
                    } transition w-full text-left ${
                      location.pathname === link.route
                        ? "bg-blue-400 text-white"
                        : ""
                    }`}
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className="h-6 w-6"
                    />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="mt-8 relative p-4 rounded-xl bg-gray-200 flex flex-col items-center text-center shadow-sm min-h-[240px] w-full overflow-hidden mb-4">
          <h3 className="text-base font-bold text-gray-800 mb-1 z-10">
            Go premium
          </h3>
          <p className="text-xs text-gray-500 mb-3 z-10">
            Explore 500+ courses
            <br />
            with lifetime membership
          </p>
          <button className="z-10 px-6 py-2 rounded-full text-white bg-[#349156] font-semibold text-sm shadow border border-[#E0E7FF] hover:bg-blue-500 transition mb-2">
            Get Access
          </button>
          <img
            src="/assets/images/premium.jpg"
            alt="Go premium"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[200px] h-28 object-contain pointer-events-none select-none z-0"
          />
        </div>
      </div>
    </nav>
  );
};

export default AdminLeftsidebar;
