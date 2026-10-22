import { useRef, useState } from 'react';
import { StyleSheet, Text, View, type TextInput as RNTextInput } from 'react-native';

import { FoodNameAutocomplete } from '@/components/food-name-autocomplete';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DateInput } from '@/components/ui/date-input';
import { TextInput } from '@/components/ui/text-input';
import { Colors, Spacing } from '@/constants/theme';
import type { NewFoodRecord } from '@/types/food';
import { brToIso, todayIso } from '@/utils/date';

type FoodFormProps = {
  suggestions: string[];
  defaultRegisteredBy: string;
  onSubmit: (input: NewFoodRecord) => Promise<unknown>;
};

type Fields = {
  name: string;
  batch: string;
  manufactureDate: string;
  expiryDate: string;
  registeredBy: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

function validate(fields: Fields): { errors: Errors; data?: NewFoodRecord } {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = 'Informe o nome do alimento.';
  if (!fields.batch.trim()) errors.batch = 'Informe o lote.';
  if (!fields.registeredBy.trim()) errors.registeredBy = 'Informe quem registrou.';

  const manufactureIso = brToIso(fields.manufactureDate);
  const expiryIso = brToIso(fields.expiryDate);
  if (!manufactureIso) errors.manufactureDate = 'Data inválida (DD/MM/AAAA).';
  else if (manufactureIso > todayIso()) {
    errors.manufactureDate = 'A fabricação não pode ser no futuro.';
  }
  if (!expiryIso) errors.expiryDate = 'Data inválida (DD/MM/AAAA).';
  if (manufactureIso && expiryIso && expiryIso < manufactureIso) {
    errors.expiryDate = 'A validade não pode ser anterior à fabricação.';
  }

  if (Object.keys(errors).length > 0 || !manufactureIso || !expiryIso) return { errors };

  return {
    errors,
    data: {
      name: fields.name,
      batch: fields.batch,
      manufactureDate: manufactureIso,
      expiryDate: expiryIso,
      registeredBy: fields.registeredBy,
    },
  };
}

export function FoodForm({ suggestions, defaultRegisteredBy, onSubmit }: FoodFormProps) {
  const emptyFields: Fields = {
    name: '',
    batch: '',
    manufactureDate: '',
    expiryDate: '',
    registeredBy: defaultRegisteredBy,
  };
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  );

  const nameRef = useRef<RNTextInput>(null);
  const batchRef = useRef<RNTextInput>(null);
  const manufactureRef = useRef<RNTextInput>(null);
  const expiryRef = useRef<RNTextInput>(null);
  const registeredByRef = useRef<RNTextInput>(null);

  function update(key: keyof Fields) {
    return (value: string) => {
      setFields((current) => ({ ...current, [key]: value }));
      if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
      setFeedback(null);
    };
  }

  async function handleSubmit() {
    const result = validate(fields);
    setErrors(result.errors);
    if (!result.data) return;

    setSaving(true);
    try {
      await onSubmit(result.data);
      setFields({ ...emptyFields, registeredBy: fields.registeredBy });
      setFeedback({ type: 'success', message: `"${result.data.name.trim()}" registrado com sucesso.` });
      nameRef.current?.focus();
    } catch {
      setFeedback({ type: 'error', message: 'Não foi possível salvar. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card title="Novo registro">
      <FoodNameAutocomplete
        ref={nameRef}
        value={fields.name}
        onChangeText={update('name')}
        suggestions={suggestions}
        error={errors.name}
        onSubmitEditing={() => batchRef.current?.focus()}
      />

      <TextInput
        ref={batchRef}
        label="Lote"
        placeholder="Ex.: L2026-045"
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="next"
        value={fields.batch}
        onChangeText={update('batch')}
        error={errors.batch}
        onSubmitEditing={() => manufactureRef.current?.focus()}
      />

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <DateInput
            ref={manufactureRef}
            label="Data de fabricação"
            returnKeyType="next"
            value={fields.manufactureDate}
            onChangeText={update('manufactureDate')}
            error={errors.manufactureDate}
            onSubmitEditing={() => expiryRef.current?.focus()}
          />
        </View>
        <View style={styles.rowItem}>
          <DateInput
            ref={expiryRef}
            label="Data de validade"
            returnKeyType="next"
            value={fields.expiryDate}
            onChangeText={update('expiryDate')}
            error={errors.expiryDate}
            onSubmitEditing={() => registeredByRef.current?.focus()}
          />
        </View>
      </View>

      <TextInput
        ref={registeredByRef}
        label="Registrado por"
        autoCapitalize="words"
        returnKeyType="done"
        value={fields.registeredBy}
        onChangeText={update('registeredBy')}
        error={errors.registeredBy}
        onSubmitEditing={handleSubmit}
      />

      {feedback && (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.feedback, feedback.type === 'error' && styles.feedbackError]}>
          {feedback.message}
        </Text>
      )}

      <Button title="Registrar alimento" loading={saving} onPress={handleSubmit} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  rowItem: {
    flexGrow: 1,
    flexBasis: 140,
  },
  feedback: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    backgroundColor: Colors.primarySoft,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    padding: Spacing.two,
  },
  feedbackError: {
    backgroundColor: Colors.dangerSoft,
    borderLeftColor: Colors.danger,
    color: Colors.danger,
  },
});
