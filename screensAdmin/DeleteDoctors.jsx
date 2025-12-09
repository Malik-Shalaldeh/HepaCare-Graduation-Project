// screensAdmin/ToggleDoctorScreen.jsx
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../style/theme';
import {
  handleSearchFn,
  handleToggleFn,
} from '../componentAdmin/functionActiveInactive';

export default function ToggleDoctorScreen() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);


  //  دالة عرض الطبيب داخل القائمة
 const renderItem =  ({ item }) => {
  const active = selected && selected.id === item.id;

  return (
    <TouchableOpacity
      onPress={() => setSelected(item)}
      activeOpacity={0.85}
      style={[
        styles.card,
        active && {
          borderColor: theme.colors.primary,
          backgroundColor: '#E1ECF2',
        },
      ]}
    >
      <Ionicons
        name="person-outline"
        size={18}
        color={active ? theme.colors.primary : theme.colors.textMuted}
        style={styles.cardIcon}
      />

      <View style={styles.infoBox}>
        <Text style={[styles.name, active && { color: theme.colors.primary }]}>
          {item.name}
        </Text>

        <Text style={styles.meta}>الرقم: {item.id}</Text>
        <Text style={styles.meta}>الهاتف: {item.phone}</Text>
        <Text style={styles.meta}>العيادة: {item.clinic}</Text>

        <Text
          style={[
            styles.meta,
            { color: item.is_active ? theme.colors.success : theme.colors.danger },
          ]}
        >
          {item.is_active ? '✅ مفعل' : '⛔ معطل'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle="light-content" />

      {/* البحث */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color={theme.colors.textMuted} />

        <TextInput
          style={styles.input}
          placeholder="ابحث بالاسم أو رقم الطبيب"
          placeholderTextColor={theme.colors.textMuted}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />

        <TouchableOpacity
          onPress={() => handleSearchFn(search, setResults, setLoading)}
          activeOpacity={0.8}
          style={styles.searchBtn}
        >
          <Ionicons name="search-outline" size={18} color={theme.colors.buttonPrimaryText} />
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      )}

      <FlatList
        data={results}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading && <Text style={styles.empty}>لا توجد نتائج مطابقة.</Text>}
      />

      {/* زر التفعيل / التعطيل */}
      <TouchableOpacity
        onPress={() => handleToggleFn(selected, setResults, setSelected, setSearch)}
        disabled={!selected}
        activeOpacity={0.9}
        style={[
          styles.disableBtn,

          !selected && { opacity: 0.5 },

          selected &&
            (selected.is_active
              ? { backgroundColor: theme.colors.buttonDanger }
              : { backgroundColor: theme.colors.buttonSuccess }
            ),
        ]}
      >
        <Ionicons
          name={selected?.is_active ? 'close-circle-outline' : 'checkmark-circle-outline'}
          size={16}
          color={theme.colors.buttonPrimaryText}
        />

        <Text style={styles.disableText}>
          {selected?.is_active ? 'تعطيل الحساب' : 'إلغاء التعطيل'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
  },
  searchRow: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: theme.spacing.sm,
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyMd,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  searchBtn: {
    backgroundColor: theme.colors.buttonPrimary,
    width: 38,
    height: 38,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: theme.spacing.sm,
    paddingBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    ...theme.shadows.light,
  },
  cardIcon: {
    marginLeft: theme.spacing.xs,
  },
  infoBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: theme.typography.bodyLg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 2,
    textAlign: 'right',
    width: '100%',
    fontFamily: theme.typography.fontFamily,
  },
  meta: {
    fontSize: theme.typography.bodySm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    width: '100%',
    fontFamily: theme.typography.fontFamily,
  },
  empty: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
  },
  disableBtn: {
    backgroundColor: theme.colors.buttonPrimary,
    borderRadius: theme.radii.pill,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'center',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: theme.spacing.sm,
    minWidth: 180,
    marginBottom: 100,
  },
  disableText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodySm,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamily,
  },
});
