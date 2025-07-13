import React from "react";

function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-slate-900 px-6 py-4 shadow-md mb-[20px] w-full">
      <div className="flex items-center">
        <span className="text-2xl font-bold text-blue-500 tracking-tight">
          MyFinance
        </span>
      </div>
      <div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-200">
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
