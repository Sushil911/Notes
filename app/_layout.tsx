import { Stack } from 'expo-router';
import { NotesProvider } from '../context/NotesContext';
import { ThemeProvider } from '../theme/theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="editor" />
        </Stack>
      </NotesProvider>
    </ThemeProvider>
  );
}