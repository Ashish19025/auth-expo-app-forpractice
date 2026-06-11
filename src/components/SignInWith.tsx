import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/expo';
import { useRouter } from 'expo-router';


export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;

    void WebBrowser.warmUpAsync();

    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

type SignInWithProps = {
  strategy:
    | 'oauth_google'
    | 'oauth_facebook'
    | 'oauth_github'
    | 'oauth_apple';
};

export default function SignInWith({ strategy }: SignInWithProps) {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const onPress = async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'authexpoappforpractice',
        path: 'continue',
      });

      console.log('Starting SSO flow with redirect URL:', redirectUrl);
      console.log("BEFORE SSO");
      // 1. Await the flow and destructure the response
      const result = await startSSOFlow({
       strategy,
       redirectUrl,
      });
      console.log(result);
      console.log("AFTER SSO");
      console.log(
     'SSO RESULT:',
      JSON.stringify(result, null, 2)
      );

     const {
     createdSessionId,
     setActive,
     signIn,
     signUp,
     } = result;

      // 2. If successful, activate the session and route to your protected screen
      if (createdSessionId && setActive) {
      await setActive({
      session: createdSessionId,
      navigate: async ({ session }) => {
      if (session?.currentTask) {
        console.log(session.currentTask);
        return;
      }
      console.log('SESSION ACTIVATED');
      router.replace('/');
     },
     });
} else {
        // Handle edge cases like required MFA or incomplete signups
        console.log('Flow incomplete. Missing session ID.', { signIn, signUp });
      }
    } catch (error) {
      console.error('OAuth Error:', error);
    }
  };

  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>
        {strategy.replace('oauth_', '')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize', // Added to cleanly format "google" to "Google"
  },
});