import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import ENDPOINTS from "../malikEndPoint";
import theme from "../style/theme";

const PRIMARY = theme.colors.primary;

export default function AllDoctorsScreen() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(ENDPOINTS.ADMIN.DOCTORS, {
          params: search ? { q: search } : {},
        });
        setDoctors(res.data);
      } catch (err) {
        Alert.alert("خطأ", "تأكد من اتصالك بالإنترنت");
      }
    };

    fetchDoctors();
  }, [search]);


  const renderItem = ({ item }) => (
    <View style={[styles.card, theme.shadows.light]}>
      <Ionicons
        name="medkit-outline"
        size={22}
        color={theme.colors.accent}
        style={styles.cardIcon}
      />
      <View style={styles.infoBox}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>رقم الهوية: {item.id}</Text>
        <Text style={styles.meta}>رقم الهاتف: {item.phone}</Text>
        <Text style={styles.meta}>العيادة: {item.clinic}</Text>
        <Text
          style={[
            styles.status,
            { color: item.active ? theme.colors.success : theme.colors.danger },
          ]}
        >
          {item.active ? "✅ مفعّل" : "⛔ غير مفعّل"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />

      <View style={styles.screen}>
        <View style={styles.searchRow}>
          <Ionicons
            name="search"
            size={18}
            color={theme.colors.textMuted}
            style={{ marginLeft: 6 }}
          />
          <TextInput
            style={styles.input}
            placeholder="ابحث بالاسم أو رقم الهوية أو العيادة"
            placeholderTextColor={theme.colors.textMuted}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
          />
        </View>

        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.empty}>لا توجد نتائج مطابقة.</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  screen: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  searchRow: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    width: "90%",
  },
  input: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyMd,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
  listContainer: {
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xl,
    rowGap: theme.spacing.md,
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.sm,
    width: "90%",
  },
  cardIcon: { marginLeft: 6 },
  infoBox: { flex: 1, alignItems: "flex-end" },
  name: {
    fontSize: theme.typography.bodyLg,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: 2,
    textAlign: "right",
    width: "100%",
  },
  meta: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textSecondary,
    textAlign: "right",
    width: "100%",
  },
  status: {
    fontSize: theme.typography.bodyMd,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "right",
    width: "100%",
  },
  empty: {
    textAlign: "center",
    color: theme.colors.textMuted,
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.bodyMd,
  },
});
