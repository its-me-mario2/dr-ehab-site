import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { loadAuth } from '../auth';
import { palette } from '../theme';

export default function RootLayout() {
  useEffect(() => { loadAuth(); }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.bg },
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="booking" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="admin" />
      </Stack>
    </SafeAreaProvider>
  );
}
