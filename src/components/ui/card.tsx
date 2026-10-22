import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';

type CardProps = ViewProps & {
  title?: string;
};

export function Card({ title, style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.borderSoft,
    padding: Spacing.four,
    gap: Spacing.three,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.black,
  },
});
