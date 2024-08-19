"use client";
import { useTheme } from "next-themes";
import * as React from "react";

const Spinner: React.FC<{
  size?: string;
  color?: string;
  width?: string;
}> = ({
  size = "24px", // Default size
  color, // Allow custom color
  width = "2", // Default stroke width
}) => {
  const { theme } = useTheme(); // Get the current theme (light or dark)

  // Set the spinner color based on the theme or custom color
  const spinnerColor = color
    ? color
    : theme === "dark"
      ? "#ffffff" // White in dark mode
      : "#000000"; // Black in light mode

  return (
    <svg
      fill="none"
      height={size}
      width={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-busy="true"
      className="custom-spinner" // Assign a unique class
    >
      <g className="custom-spinner-group">
        {" "}
        {/* Assign unique class */}
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={spinnerColor} // Dynamic stroke color
          strokeWidth={width}
          className="custom-spinner-circle" // Assign unique class
        />
      </g>
      <style jsx>{`
        .custom-spinner-group {
          animation: custom-rotate 2s linear infinite;
          transform-origin: center center;
        }
        .custom-spinner-circle {
          stroke-dasharray: 75, 100;
          stroke-dashoffset: -5;
          animation: custom-dash 1.5s ease-in-out infinite;
          stroke-linecap: round;
        }
        @keyframes custom-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes custom-dash {
          0% {
            stroke-dasharray: 1, 100;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 44.5, 100;
            stroke-dashoffset: -17.5;
          }
          100% {
            stroke-dasharray: 44.5, 100;
            stroke-dashoffset: -62;
          }
        }
      `}</style>
    </svg>
  );
};

export default Spinner;
