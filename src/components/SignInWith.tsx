import * as React from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/expo';

WebBrowser.maybeCompleteAuthSession();

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

export default function SignInWith({
  strategy,
}: SignInWithProps) {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = async () => {
    try {
      const redirectUrl =
        AuthSession.makeRedirectUri({
          scheme: 'authexpoappforpractice',
          path: 'continue',
        });

      const result = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      console.log('SSO Result:', result);

      // We'll inspect exact Clerk v3 response
      // before activating session

    } catch (error) {
      console.log('OAuth Error:', error);
    }
  };

  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
    >
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
  },
});