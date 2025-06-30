module.exports = {
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
};
