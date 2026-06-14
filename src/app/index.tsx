import React, { useEffect, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';

import { Link } from 'expo-router';

import {
  useAuth,
  useClerk,
  useUser,
} from '@clerk/expo';

import { syncUser } from '@/services/userService';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const hasSynced = useRef(false);

  console.log(
    'Home screen - isSignedIn:',
    isSignedIn
  );

  useEffect(() => {
    const syncCurrentUser = async () => {
      if (
        !isSignedIn ||
        !user ||
        hasSynced.current
      ) {
        return;
      }

      try {
        hasSynced.current = true;

        console.log('================');
        console.log('SYNCING USER');
        console.log(user.id);

        await syncUser({
          clerkId: user.id,
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          email:
            user.primaryEmailAddress
              ?.emailAddress ?? '',
        });

        console.log(
          'USER SYNC SUCCESS'
        );
      } catch (err) {
        console.log(
          'USER SYNC FAILED'
        );
        console.log(err);
      }
    };

    syncCurrentUser();
  }, [user, isSignedIn]);

  if (!isLoaded) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome Screen
      </Text>

      <Text>
        {isSignedIn
          ? 'Authenticated'
          : 'Not authenticated'}
      </Text>

      {user && (
        <>
          <Text>
            Name: {user.firstName}{' '}
            {user.lastName}
          </Text>

          <Text>
            Email:{' '}
            {
              user.primaryEmailAddress
                ?.emailAddress
            }
          </Text>

          <Text>
            Clerk ID: {user.id}
          </Text>
        </>
      )}

      <Button
        title="Sign Out"
        onPress={() => clerk.signOut()}
      />

      <Link href="/(auth)/sign-in">
        Go to sign in
      </Link>

      <Link href="/(auth)/sign-up">
        Go to sign up
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});