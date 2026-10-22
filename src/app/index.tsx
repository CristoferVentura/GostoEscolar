import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandLogo } from '@/components/brand-logo';
import { ExportButton } from '@/components/export-button';
import { FoodForm } from '@/components/food-form';
import { FoodList } from '@/components/food-list';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors, MaxContentWidth, Spacing, WideBreakpoint } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useFoods } from '@/hooks/use-foods';

export default function DashboardScreen() {
  const { user, signOut } = useAuth();
  const { foods, names, isLoading, error, createFood } = useFoods();
  const { width } = useWindowDimensions();
  const wide = width >= WideBreakpoint;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <BrandLogo size="small" />
          <View style={styles.headerRight}>
            {wide && <Text style={styles.userName}>Olá, {user?.name}</Text>}
            <Button title="Sair" variant="outline" onPress={signOut} style={styles.signOut} />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.content, wide && styles.contentWide]}>
            <View style={wide ? styles.formColumn : undefined}>
              <FoodForm
                suggestions={names}
                defaultRegisteredBy={user?.name ?? ''}
                onSubmit={createFood}
              />
            </View>

            <View style={wide ? styles.listColumn : undefined}>
              <Card>
                <View style={styles.listHeader}>
                  <Text style={styles.listTitle}>Registros</Text>
                  <ExportButton foods={foods} />
                </View>
                {!!error && <Text style={styles.error}>{error}</Text>}
                <FoodList foods={foods} isLoading={isLoading} wide={wide} />
              </Card>
            </View>
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
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  headerInner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
  },
  signOut: {
    minHeight: 40,
    paddingHorizontal: Spacing.three,
  },
  scroll: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  contentWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  formColumn: {
    width: 380,
  },
  listColumn: {
    flex: 1,
  },
  listHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.black,
  },
  error: {
    color: Colors.danger,
    fontWeight: '600',
  },
});
