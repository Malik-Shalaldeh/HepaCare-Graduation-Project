// sami
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const primary = colors.primary;

export default function HealthRatingsScreen() {
  // state
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [aggregates, setAggregates] = useState({
    appAverage: 0,
    count: 0,
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadRatings();
    }
  }, [isFocused]);

  const getAllRatings = async () => {
    const response = await axios.get(ENDPOINTS.ratingsAll);
    return response.data;
  };

  const getAggregates = async () => {
    const response = await axios.get(ENDPOINTS.ratingsAggregates);
    return response.data;
  };

  const loadRatings = async () => {
    try {
      setLoading(true);
      setError(null);

      const [list, aggs] = await Promise.all([
        getAllRatings(),
        getAggregates(),
      ]);

      setItems(list || []);
      setAggregates({
        appAverage: aggs?.appAverage || 0,
        count: aggs?.count || 0,
      });
    } catch (err) {
      setError("فشل تحميل التقييمات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>متوسط تقييم التطبيق</Text>
          <Text style={styles.summaryValue}>
            {aggregates.appAverage} / 5
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>عدد التقييمات</Text>
          <Text style={styles.summaryValue}>{aggregates.count}</Text>
        </View>
      </View>

    
      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadRatings}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.patientName}>{item.patientName}</Text>
              <Text style={styles.smallLabel}>
                التقييم: {item.appRating} / 5
              </Text>
            </View>

            {item.comment ? (
              <View style={styles.commentBox}>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            ) : null}

            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleString("ar-EG")}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>لا توجد تقييمات</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },

  summaryRow: {
    flexDirection: "row-reverse",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: colors.background,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.sm,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.small,
  },

  summaryTitle: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: "right",
  },

  summaryValue: {
    fontSize: typography.bodyLg,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },

  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  patientName: {
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    fontWeight: "700",
    textAlign: "right",
  },

  smallLabel: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
  },

  commentBox: {
    backgroundColor: colors.backgroundLight,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
  },

  commentText: {
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    textAlign: "right",
    writingDirection: "rtl",
  },

  dateText: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
    fontSize: typography.bodySm,
    textAlign: "left",
  },

  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.xl,
    fontSize: typography.bodyMd,
  },
});
