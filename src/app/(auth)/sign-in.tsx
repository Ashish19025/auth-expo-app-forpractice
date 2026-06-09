import { Text, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useClerk, useSignIn } from '@clerk/expo';
import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import { Link } from 'expo-router';
import SignInWith from '@/components/SignInWith';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFields = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFields>({
    resolver: zodResolver(signInSchema),
  });

  const signIn = useSignIn();
  const clerk = useClerk();

  const onSignIn = async (data: SignInFields) => {
    try {
      console.log('SignIn Hook:', signIn);

      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      console.log('SignIn Result:', result);

      // We'll inspect result structure later
      // This is just temporary debugging

    } catch (error) {
      console.log('Sign In Error:', error);

      setError('root', {
        message: 'Failed to sign in',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Sign in</Text>

      <View style={styles.form}>
        <CustomInput
          control={control}
          name="email"
          placeholder="Email"
          autoFocus
          autoCapitalize="none"
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
      </View>

      <CustomButton
        text="Sign in"
        onPress={handleSubmit(onSignIn)}
      />

      <Link href="/sign-up" style={styles.link}>
        Don't have an account? Sign up
      </Link>

      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          marginTop: 20,
        }}
      >
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
    alignItems: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  form: {
    width: '80%',
  },

  link: {
    marginTop: 20,
  },
});