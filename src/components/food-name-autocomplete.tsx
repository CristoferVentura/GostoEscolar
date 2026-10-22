import { useMemo, useRef, useState, type Ref } from 'react';
import { Pressable, StyleSheet, Text, View, type TextInput as RNTextInput } from 'react-native';

import { TextInput } from '@/components/ui/text-input';
import { Colors, Radius, Spacing } from '@/constants/theme';

const MAX_SUGGESTIONS = 8;
// Delay hiding so a tap on a suggestion is registered before the input blur closes the list.
const BLUR_HIDE_DELAY_MS = 150;

type FoodNameAutocompleteProps = {
  value: string;
  onChangeText: (value: string) => void;
  suggestions: string[];
  error?: string;
  onSubmitEditing?: () => void;
  ref?: Ref<RNTextInput>;
};

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function FoodNameAutocomplete({
  value,
  onChangeText,
  suggestions,
  error,
  onSubmitEditing,
  ref,
}: FoodNameAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = useMemo(() => {
    const query = normalize(value);
    return suggestions
      .filter((name) => {
        const normalized = normalize(name);
        return normalized !== query && normalized.includes(query);
      })
      .slice(0, MAX_SUGGESTIONS);
  }, [suggestions, value]);

  function cancelHide() {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  }

  function select(name: string) {
    cancelHide();
    onChangeText(name);
    setOpen(false);
  }

  return (
    <View>
      <TextInput
        ref={ref}
        label="Nome do alimento"
        placeholder="Ex.: Arroz branco"
        value={value}
        error={error}
        autoCapitalize="sentences"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={onSubmitEditing}
        onChangeText={(text) => {
          onChangeText(text);
          setOpen(true);
        }}
        onFocus={() => {
          cancelHide();
          setOpen(true);
        }}
        onBlur={() => {
          hideTimeout.current = setTimeout(() => setOpen(false), BLUR_HIDE_DELAY_MS);
        }}
      />

      {open && filtered.length > 0 && (
        <View style={styles.dropdown} accessibilityRole="list">
          <Text style={styles.dropdownTitle}>Alimentos já registrados</Text>
          <View style={styles.chips}>
            {filtered.map((name) => (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityLabel={`Usar ${name}`}
                onPress={() => select(name)}
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}>
                <Text style={styles.chipText}>{name}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    marginTop: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
    gap: Spacing.two,
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
  },
  chipPressed: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
});
