import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { router } from 'expo-router';
import { useSignUp } from '@clerk/expo';

import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';

const schema = z.object({
  code: z.string().min(6).max(6),
});

type VerifyFields = z.infer<typeof schema>;

export default function VerifyScreen() {
  const [loading, setLoading] = useState(false);

  const signUpHook = useSignUp();

  console.log('VERIFY HOOK');
  console.log(JSON.stringify(signUpHook, null, 2));

  const signUp = signUpHook?.signUp ?? signUpHook;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VerifyFields>({
    resolver: zodResolver(schema),
  });

  const onVerify = async ({ code }: VerifyFields) => {
    try {
      setLoading(true);

      console.log('VERIFYING CODE:', code);

      if (!signUp) {
        console.log('SIGNUP MISSING');
        return;
      }

      if (signUp.verifications?.verifyEmailCode) {
        await signUp.verifications.verifyEmailCode({
          code,
        });
        console.log(signUp.status);
console.log(signUp.missingFields);
console.log(signUp.unverifiedFields);

        console.log('VERIFY SUCCESS');
      } else {
        console.log('verifyEmailCode not found');
      }

      console.log('STATUS');
      console.log(signUp.status);

      if (signUp.status === 'complete') {
        console.log('FINALIZING');

        await signUp.finalize({
          navigate: () => {
            router.replace('/');
          },
        });
      }
    } catch (error: any) {
      console.log('VERIFY ERROR');
      console.log(error);
      console.log(JSON.stringify(error, null, 2));

      setError('root', {
        message: error?.message ?? 'Verification failed',
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
      <Text style={styles.title}>
        Verify Email
      </Text>

      <CustomInput
        control={control}
        name="code"
        placeholder="123456"
        keyboardType="number-pad"
      />

      {errors.root && (
        <Text style={{ color: 'red' }}>
          {errors.root.message}
        </Text>
      )}

      <CustomButton
        text={loading ? 'Verifying...' : 'Verify'}
        onPress={handleSubmit(onVerify)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
});