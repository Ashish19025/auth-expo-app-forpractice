import React from 'react';
import { TextInput, StyleSheet, TextInputProps, Text, View } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

// 1. Extend TextInputProps and add form-specific props
type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string; // Optional label prop
} & TextInputProps;

export default function CustomInput<T extends FieldValues>({
  control,
  name,
  label,
  ...textInputProps // 2. Separate standard TextInput props
}: CustomInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error }, // 3. Extract error from fieldState
      }) => (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          
          <TextInput
            {...textInputProps} // 4. Spread standard props (placeholder, keyboardType, etc.)
            onBlur={onBlur}     // 5. Explicitly assign form handlers
            onChangeText={onChange}
            value={value}
            style={[
              styles.input,
              textInputProps.style, // Merge user-provided styles
              error && styles.inputError, // Conditional error styling
            ]}
          />
          
          {/* 6. Render error message if it exists */}
          {error ? (
            <Text style={styles.errorText}>
              {typeof error.message === 'string' ? error.message : 'Invalid input'}
            </Text>
          ) : (
            <View style={styles.placeholder} /> // Maintains layout consistency
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  placeholder: {
    height: 20, // Matches approximate height of error text to prevent layout shift
  },
});   