import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSignUp } from '@clerk/expo';
import SignInWith from '@/components/SignInWith';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

const signUpSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

type SignUpFields = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);

  const signUpHook = useSignUp();

  console.log('FULL SIGNUP HOOK');
  console.log(JSON.stringify(signUpHook, null, 2));

  const signUp = signUpHook?.signUp ?? signUpHook;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
  });

  const onSignUp = async (data: SignUpFields) => {
    try {
      setLoading(true);

      console.log('=================================');
      console.log('SIGNUP CLICKED');
      console.log(data);
      console.log('SIGNUP OBJECT');
      console.log(signUp);

      if (!signUp) {
        console.log('SIGNUP IS NULL');
        return;
      }

      console.log('CREATE TYPE:', typeof signUp.create);

      const result = await signUp.create({
        firstName: data.firstName,
        lastName: data.lastName,
        emailAddress: data.email,
        password: data.password,
      });

      console.log('CREATE RESULT');
      console.log(JSON.stringify(result, null, 2));

      if (signUp.verifications?.sendEmailCode) {
        console.log('Sending email code...');
        await signUp.verifications.sendEmailCode();
      } else {
        console.log('sendEmailCode not found');
      }

      console.log('Going to verify screen');

      router.push('/verify');
    } catch (error: any) {
      console.log('=======================');
      console.log('SIGNUP ERROR');
      console.log(error);
      console.log(JSON.stringify(error, null, 2));

      setError('root', {
        message: error?.message ?? 'Signup failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Account</Text>

        <CustomInput
          control={control}
          name="firstName"
          placeholder="First Name"
        />

        <CustomInput
          control={control}
          name="lastName"
          placeholder="Last Name"
        />

        <CustomInput
          control={control}
          name="email"
          placeholder="Email"
          keyboardType="email-address"
        />

        <CustomInput
          control={control}
          name="password"
          placeholder="Password"
          secureTextEntry
        />

        {errors.root && (
          <Text style={{ color: 'red' }}>
            {errors.root.message}
          </Text>
        )}

        <CustomButton
          text={loading ? 'Creating...' : 'Sign Up'}
          onPress={handleSubmit(onSignUp)}
        />

        <Link href="/(auth)/sign-in">
          Already have an account?
        </Link>
         <View style={styles.ssoContainer}>
                <SignInWith strategy="oauth_google" />
                <SignInWith strategy="oauth_facebook" />
                <SignInWith strategy="oauth_apple" />
              </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
    gap: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
    ssoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
});