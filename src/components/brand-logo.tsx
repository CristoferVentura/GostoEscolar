import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export function BrandLogo({ size = 'large' }: { size?: 'large' | 'small' }) {
  const large = size === 'large';
  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={[styles.mark, large ? styles.markLarge : styles.markSmall]}>
        <Text style={[styles.markText, { fontSize: large ? 28 : 18 }]}>G</Text>
      </View>
      <Text style={[styles.name, { fontSize: large ? 30 : 20 }]}>
        Gosto<Text style={styles.highlight}>Escolar</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mark: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.black,
  },
  markLarge: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  markSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
  },
  markText: {
    color: Colors.white,
    fontWeight: '900',
  },
  name: {
    fontWeight: '900',
    color: Colors.black,
  },
  highlight: {
    color: Colors.primary,
  },
});
