import { Text, StyleSheet, View, Button } from 'react-native';
import { Link } from 'expo-router';
import { useAuth, useClerk } from '@clerk/expo';

export default function Home() {
  const { isSignedIn } = useAuth();
  const clerk  = useClerk();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome screen</Text>

      <Text>{isSignedIn ? 'Authenticated' : 'Not authenticated'}</Text>
      <Button title='Sign out' onPress={() => clerk.signOut()} />

      <Link href='/(auth)/sign-in'>Go to sign in</Link>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});