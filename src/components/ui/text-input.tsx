import { useState, type Ref } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  View,
  type TextInputProps as RNTextInputProps,
} from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

export type TextInputProps = RNTextInputProps & {
  label: string;
  error?: string;
  ref?: Ref<RNTextInput>;
};

export function TextInput({ label, error, style, onFocus, onBlur, ref, ...rest }: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        ref={ref}
        placeholderTextColor={Colors.muted}
        style={[
          styles.input,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          style,
        ]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  input: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  error: {
    fontSize: 13,
    color: Colors.danger,
  },
});
