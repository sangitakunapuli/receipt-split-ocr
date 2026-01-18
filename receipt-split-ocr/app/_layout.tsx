import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ReceiptProvider } from '@/contexts/ReceiptContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ReceiptProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="upload-receipt" 
            options={{ 
              title: 'Upload Receipt',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="edit-receipt" 
            options={{ 
              title: 'Edit Receipt',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="assign-items" 
            options={{ 
              title: 'Assign Items',
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="settlement" 
            options={{ 
              title: 'Settlement',
              headerShown: false,
            }} 
          />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ReceiptProvider>
  );
}
