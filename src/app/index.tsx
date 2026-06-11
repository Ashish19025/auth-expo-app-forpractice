import { Text, StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useAuth, useClerk } from '@clerk/expo';
import { replace, router } from 'expo-router/build/global-state/router';

export default function Home() {
  const { isSignedIn } = useAuth();
  console.log('Home screen - isSignedIn:', isSignedIn);
  const clerk  = useClerk();
  const { isLoaded } = useAuth();
  if(!isLoaded){
    return <ActivityIndicator />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome screen</Text>

      <Text>{isSignedIn ? 'Authenticated' : 'Not authenticated'}</Text>
      <Button title='Sign out' onPress={() => clerk.signOut()} />

      <Link href='/(auth)/sign-in'>Go to sign in</Link>
      <Link href='/(auth)/sign-up'>Go to sign up</Link>

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