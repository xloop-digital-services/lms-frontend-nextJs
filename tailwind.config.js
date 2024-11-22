/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xlg: "1090px",
        xmd: "900px",
        xxlg: "845px",
        ssm: "680px",
        nsm: "560px",
        smm: "500px",
        xsm: "450px",
        // Define custom breakpoint `xsm` with min-width of 450px
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      blue: {
        500: "#022567",
        400: "#0A316E",
        300: "#0074EE",
        200: "#8BB8FF",
        100: "#D0E9F8",
        600: "#e6f8ff",
        700: "#3272b6",
      },
      dark: {
        900: "#000",
        800: "#E5E7E8",
        600: "#8098b3",
        500: "#92A7BE",
        400: "#8A8A95",
        300: "#C0C0CF",
        200: "#D4E0EA",
        100: "#EFF5FA",
      },
      mix: {
        600: "#eb6734",
        500: "#F29D41",
        400: "#DDF8EE",
        300: "#18A07A",
        200: "#D84848",
        100: "#FBE7E9",
      },
      surface: {
        200: "#F4F6FA",
        100: "#FFFFFF",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgb(17 24 39)",
          marginInline: "10px",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "5px", // Width for vertical scrollbars
            height: "5px", // Height for horizontal scrollbars
          },
          "&::-webkit-scrollbar-track": {
            background: "#fffff", // Scrollbar track color
            margin: "0px", // Ensure no margin for smooth scrolling
            marginInline: "5px", // Spacing within the scrollbar track
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#D4E0EA", // Thumb color
            borderRadius: "20px", // Rounded corners for the scrollbar thumb
            marginInline: "10px", // Padding within the thumb
          },
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
};
