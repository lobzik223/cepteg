export default {
  expo: {
    name: "Cafe Network App",
    slug: "cafe-network-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "cafeapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    
    // Deep linking configuration
    linking: {
      prefixes: ["cafeapp://", "https://cafe-network.com"],
      config: {
        screens: {
          // Main app flow
          "(tabs)": {
            screens: {
              index: {
                path: "/",
                parse: {
                  cafeId: (cafeId) => cafeId,
                  cafeName: (cafeName) => cafeName,
                  location: (location) => location,
                  apiEndpoint: (apiEndpoint) => apiEndpoint,
                },
              },
            },
          },
        },
      },
    },

    // iOS configuration
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.cafenetwork.app",
      // URL schemes for iOS
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLName: "cafeapp",
            CFBundleURLSchemes: ["cafeapp"],
          },
        ],
      },
    },

    // Android configuration
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: "com.cafenetwork.app",
      // Intent filters for Android
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
              scheme: "cafeapp",
            },
            {
              scheme: "https",
              host: "cafe-network.com",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },

    // Web configuration
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    // Plugins
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
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to scan QR codes for cafe menus.",
        },
      ],
      [
        "expo-barcode-scanner",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to scan QR codes.",
        },
      ],
    ],

    // Experiments
    experiments: {
      typedRoutes: true,
    },

    // Extra configuration for QR code handling - PRODUCTION
    extra: {
      eas: {
        projectId: "your-project-id-here", // Replace with your actual project ID
      },
      BYPASS_QR: "false",                         // PRODUCTION: QR scanner enabled
      DEFAULT_TENANT_ID: "akafe-demo",            // default cafe ID
      DEFAULT_TENANT_NAME: "AKAFE",
      DEFAULT_TENANT_LOGO: "https://yourdomain.com/akafe-logo.png",
      API_BASE: "https://api.yourdomain.com"      // your production API
    },
  },
};
