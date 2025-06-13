# GFashion-Frontend

A modern fashion e-commerce mobile application built with React Native and Expo. GFashion provides customers with an intuitive and seamless shopping experience for discovering, browsing, and purchasing the latest fashion trends right from their mobile devices.

## 📱 App Features

**Product Discovery**
- Browse extensive fashion collections
- Advanced search and filtering options
- Category-based navigation (Men, Women, Accessories)
- Trending and featured product sections

**Shopping Experience**
- Detailed product views with high-quality images
- Size guides and product specifications
- Wishlist and favorites functionality
- Shopping cart with easy checkout process

**User Account**
- Secure user registration and authentication
- Personal profile management
- Order history and tracking
- Address book for shipping

**Reviews & Ratings**
- Customer product reviews and ratings
- Photo reviews and feedback
- Review filtering and sorting

**Personalization**
- Personalized product recommendations
- Custom style preferences

**Payment & Checkout**
- Secure payment processing
- Order confirmation and receipts
- Real-time order tracking

## 🚀 Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe development
- **Expo Router** - File-based routing system
- **Native Base / Styled Components** - UI components and styling

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16.0 or higher)
- npm or yarn package manager
- Expo CLI installed globally
- iOS Simulator (for Mac users) or Android Studio (for Android development)
- Physical device with Expo Go app (optional)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HiQuang210/GFashion-Frontend.git
   cd GFashion-Frontend
   ```

2. **Install dependencies**
   ```bash
   npx expo install 
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables in `.env`:
   ```

## 🏃‍♂️ Running the Project

### Start the Development Server
```bash
npx expo start
```

### Running Options

After starting the development server, you'll see options to open the app in:

**Development Build**
- For testing native features and custom native code

**Android Emulator**
- Requires Android Studio and Android SDK setup
- Press `a` in the terminal to open Android emulator

**iOS Simulator** (Mac only)
- Requires Xcode installation
- Press `i` in the terminal to open iOS simulator

**Expo Go** (Recommended for quick testing)
- Install Expo Go app on your physical device
- Scan the QR code from the terminal
- Limited sandbox environment for basic development

### Development Commands

```bash
# Start development server
npx expo start

# Start with cleared cache
npx expo start --clear

# Start in tunnel mode (for testing on physical device)
npx expo start --tunnel

# Run on specific platform
npx expo run:android
npx expo run:ios
```

## 🎨 File-based Routing

This project uses Expo Router with file-based routing. You can start developing by editing files inside the `app` directory:

- `app/_layout.tsx` - Root layout component
- `app/(tabs)/` - Tab navigation screens
- `app/product/[id].tsx` - Dynamic product detail page
- `app/auth/login.tsx` - Login screen

## 🔄 Getting a Fresh Project

When you're ready to start with a clean slate:

```bash
npm run reset-project
```

This command will:
- Move the starter code to the `app-example` directory
- Create a blank `app` directory for your custom development
- Preserve the project configuration

## 📦 Building for Production

### Create Production Build
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Using EAS Build (recommended)
npx eas build --platform android
npx eas build --platform ios
```

### App Store Deployment
```bash
# Submit to Google Play Store
npx eas submit --platform android

# Submit to Apple App Store
npx eas submit --platform ios
```

## 🔧 Configuration

### Expo Configuration (app.json)
```json
{
  "expo": {
    "name": "GFashion",
    "slug": "GFashion-app",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png"
    }
  }
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🔍 Debugging

- Use **Flipper** for advanced debugging
- **React Native Debugger** for Redux state inspection
- **Expo DevTools** for performance monitoring
- **Console logs** visible in terminal and browser

## 📱 Device Testing

**Physical Device Testing:**
1. Install Expo Go app from App Store/Google Play
2. Create Expo account
3. Scan QR code from development server
4. Test app functionality on real device

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Follow the coding standards and add tests
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
