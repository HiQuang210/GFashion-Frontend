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
            <Stack.Screen
              name="location-picker"
              options={{ title: "location-picker" }}
            />

            {/* Main App with Tabs */}
            <Stack.Screen name="tabs" options={{ title: "Main App" }} />

            {/* Shopping Flow */}
            <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
            <Stack.Screen name="address-form" options={{ title: "Address Form"}} />
            <Stack.Screen name="order-success" options={{ title: "Order Success"}} />

            {/* Other Screens */}
            <Stack.Screen name="orders" options={{ title: "My Orders" }} />
            <Stack.Screen name="reviews" options={{ title: "My Reviews" }} />
            <Stack.Screen name="settings" options={{ title: "settings" }} />
            <Stack.Screen name="my-profile" options={{ title: "my-profile" }} />
            <Stack.Screen name="edit-profile" options={{ title: "edit-profile" }} />
            <Stack.Screen
              name="change-password"
              options={{ title: "Change Password" }}
            />
            <Stack.Screen
              name="help-center"
              options={{ title: "Help Center" }}
            />
            <Stack.Screen
              name="privacy-policy"
              options={{ title: "Privacy Policy" }}
            />
          </Stack>

          <Toast />
        </>
      </AuthProvider>
    </QueryClientProvider>
  );
}