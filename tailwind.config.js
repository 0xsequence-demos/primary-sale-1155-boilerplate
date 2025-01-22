/** @type {import('tailwindcss').Config} */

import boilerplateConfig from "boilerplate-design-system/tailwind-config";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/boilerplate-design-system/dist/*.js",
  ],
  presets: [boilerplateConfig],
};
