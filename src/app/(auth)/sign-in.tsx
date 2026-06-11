import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Link, router } from 'expo-router';

import {
  useSignIn,
  isClerkAPIResponseError,
} from '@clerk/expo';

import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import SignInWith from '@/components/SignInWith';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

type SignInFields = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });

  const { signIn } = useSignIn();

  const onSignIn = async (data: SignInFields) => {
    if (!signIn) {
      console.log('SignIn not ready');
      return;
    }

    try {
      setLoading(true);

      console.log('======================');
      console.log('SIGN IN CLICKED');
      console.log(data);

      const { error } = await signIn.password({
        emailAddress: data.email,
        password: data.password,
      });

      console.log('PASSWORD RESULT');
      console.log(error);

      if (error) {
        setError('root', {
          message:
            error.longMessage ??
            'Invalid email or password',
        });

        return;
      }

      console.log('STATUS');
      console.log(signIn.status);

      switch (signIn.status) {
        case 'complete':
          console.log('LOGIN COMPLETE');

          await signIn.finalize({
            navigate: ({ session }) => {
              console.log('SESSION CREATED');
              console.log(session?.id);

              router.replace('/');
            },
          });

          break;

        case 'needs_client_trust':
          console.log(
            'EMAIL VERIFICATION REQUIRED BY CLERK SETTINGS'
          );

          setError('root', {
            message:
              'Your Clerk project requires email verification before login.',
          });

          break;

        case 'needs_second_factor':
          console.log('MFA REQUIRED');

          setError('root', {
            message:
              'Your account requires multi-factor authentication.',
          });

          break;

        default:
          console.log('UNHANDLED STATUS');
          console.log(signIn.status);

          setError('root', {
            message: `Status: ${signIn.status}`,
          });
      }
    } catch (err) {
      console.log('SIGN IN ERROR');
      console.log(JSON.stringify(err, null, 2));

      if (isClerkAPIResponseError(err)) {
        setError('root', {
          message:
            err.errors?.[0]?.longMessage ??
            'Failed to sign in',
        });
      } else {
        setError('root', {
          message: 'Something went wrong',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      style={styles.container}
    >
      <Text style={styles.title}>
        Sign In
      </Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name="email"
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoFocus
        />

        <CustomInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />

        {errors.root && (
          <Text style={styles.errorText}>
            {errors.root.message}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          text={
            loading
              ? 'Signing In...'
              : 'Sign In'
          }
          disabled={loading}
          onPress={handleSubmit(onSignIn)}
        />
      </View>

      <Link
        href="/(auth)/sign-up"
        style={styles.link}
      >
        Don't have an account? Sign Up
      </Link>

      <View style={styles.ssoContainer}>
        <SignInWith strategy="oauth_google" />
        <SignInWith strategy="oauth_facebook" />
        <SignInWith strategy="oauth_apple" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
  },

  form: {
    gap: 8,
  },

  errorText: {
    color: 'crimson',
    textAlign: 'center',
    marginTop: 5,
  },

  buttonContainer: {
    marginTop: 15,
  },

  link: {
    marginTop: 20,
    color: '#4353FD',
    fontWeight: '600',
    textAlign: 'center',
  },

  ssoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 25,
    flexWrap: 'wrap',
  },
});