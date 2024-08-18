"use client";
import { useTheme } from "next-themes"; // Import the theme hook from ShadCN
import * as React from "react";

const Spinner: React.FC<{
  size?: string;
  color?: string;
}> = ({
  size = "24px", // Default size
  color, // Allow custom color
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
    >
      <style>
        {`
          g {
            animation: rotate 2s linear infinite;
            transform-origin: center center;
          }
          circle {
            stroke-dasharray: 75, 100;
            stroke-dashoffset: -5;
            animation: dash 1.5s ease-in-out infinite;
            stroke-linecap: round;
          }
          @keyframes rotate {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          @keyframes dash {
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
        `}
      </style>
      <g>
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={spinnerColor} // Dynamic stroke color
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};

export default Spinner;
