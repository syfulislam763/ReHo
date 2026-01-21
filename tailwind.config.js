/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./src/**/*.{js, jsx, ts, tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "archivo-semi-bold": ["Archivo-SemiBold"],
        "archivo-extra-bold":["Archivo-ExtraBold"],
        "archivo-regular":["Archivo_Regular"],
        "inter-regular":["Inter_18pt-Regular"],
        "inter-semi-bold":["Inter_18pt-SemiBold"]
      },
      colors: {
        "title-color":"#171A1F",
        "primary-color": "#565E6C",
        "button-bg":"#4F55BA"
      }
    },
  },
  plugins: [],
}

