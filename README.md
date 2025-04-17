# Clucky Coop Guardian: ESP32 Chicken Feeder Control App

A mobile application for controlling an ESP32-based automatic chicken feeder system. This app allows you to monitor and control your chicken feeder from your mobile device.

## Features

- **PIN Security**: 4-digit PIN protection for app access
- **Feeding Schedule**: Set and manage automatic feeding times
- **Real-time Temperature Monitoring**: View current temperature and historical data
- **Feed Level Monitoring**: Track feed storage levels with low-level notifications
- **Manual Feeding**: Trigger feeding on demand
- **ESP32 Connectivity**: Connect to your ESP32 device

## Technologies Used

This project is built with:

- React + TypeScript
- Vite for bundling
- Capacitor for mobile app capabilities
- Tailwind CSS for styling
- shadcn/ui component library
- Recharts for data visualization

## Mobile App Build Instructions

To build the mobile app as an executable (.apk for Android or .ipa for iOS):

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Build the web application:
   ```
   npm run build
   ```
4. Add native platforms:
   ```
   npx cap add android
   npx cap add ios  # If on macOS
   ```
5. Sync the built web code with the native projects:
   ```
   npx cap sync
   ```
6. Open the native IDE to build:
   ```
   npx cap open android  # Opens Android Studio
   npx cap open ios      # Opens Xcode (macOS only)
   ```
7. Build the app from the native IDE

## ESP32 Integration

This app is designed to connect to an ESP32 microcontroller that controls the chicken feeder hardware. The ESP32 should be programmed to:

1. Control the feeding mechanism
2. Monitor temperature via a temperature sensor
3. Monitor feed levels using appropriate sensors
4. Accept commands and send data over WiFi or Bluetooth

## PIN Security

The default PIN is set to `1234`. In a production app, this would be stored securely and could be changed by the user.

## Project Structure

- `/src/components`: UI components
- `/src/pages`: Screen pages
- `/src/lib`: Utility functions and ESP32 connection simulation
- `/capacitor.config.ts`: Capacitor configuration

## Build from Lovable

This project was created with [Lovable](https://lovable.dev/projects/5ee578e4-a434-4821-9746-3685b616bc33).
