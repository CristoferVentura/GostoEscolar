import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing } from '@/constants/theme';
import { getExpiryStatus } from '@/utils/date';

const LABELS = {
  expired: 'Vencido',
  expiringSoon: 'Vence em breve',
  ok: 'No prazo',
} as const;

export function ExpiryBadge({ expiryDate }: { expiryDate: string }) {
  const status = getExpiryStatus(expiryDate);

  return (
    <View style={[styles.badge, styles[status]]}>
      <Text style={[styles.text, status === 'ok' ? styles.textDark : styles.textLight]}>
        {LABELS[status]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  expired: {
    backgroundColor: Colors.danger,
    borderColor: Colors.danger,
  },
  expiringSoon: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ok: {
    backgroundColor: Colors.white,
    borderColor: Colors.black,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  textLight: {
    color: Colors.white,
  },
  textDark: {
    color: Colors.black,
  },
});
