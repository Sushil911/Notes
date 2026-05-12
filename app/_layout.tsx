import { Stack } from 'expo-router';
import { NotesProvider } from '../context/NotesContext';
import { ThemeProvider, useAppTheme } from '../theme/theme';

function RootStack() {
  const { theme } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="editor" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <NotesProvider>
        <RootStack />
      </NotesProvider>
    </ThemeProvider>
  );
}