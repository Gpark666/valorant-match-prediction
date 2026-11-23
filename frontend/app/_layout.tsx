import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Live Matches' }} />
      <Stack.Screen name="match/[page]" options={{ title: 'Match Detail' }} />
    </Stack>
  );
}
