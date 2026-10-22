import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand-logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TextInput } from '@/components/ui/text-input';
import { Colors, Spacing } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { AuthError } from '@/services/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

type Mode = 'signIn' | 'signUp';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);

  const isSignUp = mode === 'signUp';

  async function handleSubmit() {
    if (isSignUp && !name.trim()) return setError('Informe seu nome.');
    if (!EMAIL_PATTERN.test(email.trim())) return setError('Informe um e-mail válido.');
    if (password.length < MIN_PASSWORD_LENGTH) {
      return setError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
    }

    setError(null);
    setSubmitting(true);
    try {
      if (isSignUp) await signUp(name, email, password);
      else await signIn(email, password);
    } catch (e) {
      setError(e instanceof AuthError ? e.message : 'Não foi possível entrar. Tente novamente.');
      setSubmitting(false);
    }
  }

  function toggleMode() {
    setMode(isSignUp ? 'signIn' : 'signUp');
    setError(null);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              <BrandLogo />
              <Text style={styles.subtitle}>Registro e organização do cardápio escolar</Text>
            </View>

            <Card title={isSignUp ? 'Criar conta' : 'Entrar'}>
              {isSignUp && (
                <TextInput
                  label="Nome"
                  placeholder="Seu nome"
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  value={name}
                  onChangeText={setName}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              )}
              <TextInput
                ref={emailRef}
                label="E-mail"
                placeholder="voce@escola.com.br"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <TextInput
                ref={passwordRef}
                label="Senha"
                placeholder="••••••"
                secureTextEntry
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                returnKeyType="go"
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleSubmit}
              />

              {!!error && (
                <Text style={styles.error} accessibilityLiveRegion="polite">
                  {error}
                </Text>
              )}

              <Button
                title={isSignUp ? 'Criar conta e entrar' : 'Entrar'}
                loading={submitting}
                onPress={handleSubmit}
              />

              <Pressable onPress={toggleMode} accessibilityRole="button" style={styles.toggle}>
                <Text style={styles.toggleText}>
                  {isSignUp ? 'Já tem conta? ' : 'Ainda não tem conta? '}
                  <Text style={styles.toggleLink}>{isSignUp ? 'Entrar' : 'Criar conta'}</Text>
                </Text>
              </Pressable>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.muted,
    textAlign: 'center',
  },
  error: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.danger,
    backgroundColor: Colors.dangerSoft,
    padding: Spacing.two,
    borderRadius: 6,
  },
  toggle: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.black,
  },
  toggleLink: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
