import React from "react";
import clsx from "clsx";

export default function GapfillButton({ label, onClick, disabled = false, type = "primary" }) {
  const baseStyles =
    "px-4 py-2 rounded-2xl font-semibold transition duration-200 focus:outline-none";

  const typeStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-yellow-500 text-white hover:bg-yellow-600",
    success: "bg-cyan-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-cyan-700 active:bg-cyan-800 transition-colors",
    danger: "bg-red-600 text-white hover:bg-red-700",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  const computedStyles = disabled ? typeStyles.disabled : typeStyles[type] || typeStyles.primary;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, computedStyles)}
    >
      {label}
    </button>
  );
}
