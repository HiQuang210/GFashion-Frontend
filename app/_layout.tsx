import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            {/* Welcome & Onboarding */}
            <Stack.Screen name="index" options={{ title: "Welcome" }} />
            <Stack.Screen name="onboarding" options={{ title: "onboarding" }} />

            {/* Authentication Screens */}
            <Stack.Screen name="login" options={{ title: "login" }} />
            <Stack.Screen name="signup" options={{ title: "signup" }} />
            <Stack.Screen
              name="emailverify"
              options={{ title: "emailverify" }}
            />

            {/* Password Reset Flow */}
            <Stack.Screen name="forgotpass" options={{ title: "forgotpass" }} />
            <Stack.Screen
              name="resetpassword"
              options={{ title: "resetpassword" }}
            />

            {/* Profile Setup */}
            <Stack.Screen
              name="completeprofile"
              options={{ title: "completeprofile" }}
            />
            <Stack.Screen name="location" options={{ title: "location" }} />
            <Stack.Screen
              name="enterlocation"
              options={{ title: "enterlocation" }}
            />

            {/* Main App with Tabs */}
            <Stack.Screen name="tabs" options={{ title: "Main App" }} />

            {/* Other Screens */}
            <Stack.Screen name="orders" options={{ title: "My Orders" }} />
            <Stack.Screen name="myreviews" options={{ title: "My Reviews" }} />
            <Stack.Screen name="settings" options={{ title: "settings" }} />
            <Stack.Screen name="changeInfo" options={{ title: "changeInfo" }} />
            <Stack.Screen
              name="change-password"
              options={{ title: "Change Password" }}
            />
          </Stack>

          <Toast />
        </>
      </AuthProvider>
    </QueryClientProvider>
  );
}