import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Welcome" }} />
          <Stack.Screen name="onboarding" options={{ title: "onboarding" }} />
          <Stack.Screen name="login" options={{ title: "login" }} />
          <Stack.Screen name="signup" options={{ title: "signup" }} />
          <Stack.Screen name="verifypage" options={{ title: "verify" }} />
          <Stack.Screen name="forgotpass" options={{ title: "forgotpass" }} />
          <Stack.Screen
            name="completeprofile"
            options={{ title: "completeprofile" }}
          />
          <Stack.Screen name="location" options={{ title: "location" }} />
          <Stack.Screen
            name="enterlocation"
            options={{ title: "enterlocation" }}
          />
          <Stack.Screen name="homepage" options={{ title: "homepage" }} />
          <Stack.Screen name="settings" options={{ title: "settings" }} />
          <Stack.Screen
            name="resetpassword"
            options={{ title: "resetpassword" }}
          />
          <Stack.Screen name="changeInfo" options={{ title: "changeInfo" }} />
        </Stack>
        <Toast />
      </>
    </QueryClientProvider>
  );
}
