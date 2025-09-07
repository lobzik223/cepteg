// app.config.js
export default {
  expo: {
    name: "cafe-app",
    slug: "cafe-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "cafeapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      bundleIdentifier: "com.yourcompany.cafeapp", // <- kendi id'in
      supportsTablet: true,
    },
    android: {
      package: "com.yourcompany.cafeapp",          // <- kendi id'in
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
    ],
    experiments: { typedRoutes: true },

    // >>> BURAYI EKLİYORSUN <<<
    extra: {
      eas: {
        projectId: "d4e7c60e-fb06-4261-b89b-ef505682a6ce",
      },
    },
  },
};
