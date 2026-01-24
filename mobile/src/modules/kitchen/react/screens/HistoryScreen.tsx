import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../../../theme';
import { KitchenDomainModel } from '../../core/model/kitchen.domain-model';
import { IKitchenGateway } from '../../core/gateway/kitchen.gateway';

type HistoryScreenProps = {
  gateway: IKitchenGateway;
  restaurantId: number;
  restaurantName?: string;
  onBack: () => void;
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  gateway,
  restaurantId,
  restaurantName,
  onBack,
}) => {
  const [orders, setOrders] = useState<KitchenDomainModel.KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompletedOrders = useCallback(async () => {
    try {
      setLoading(true);
      const completedOrders = await gateway.getCompletedOrders(restaurantId, 50);
      setOrders(completedOrders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [gateway, restaurantId]);

  useEffect(() => {
    fetchCompletedOrders();
  }, [fetchCompletedOrders]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return "Aujourd'hui";
    }

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const renderMealSection = (
    meals: KitchenDomainModel.MealCount,
    label: string,
    color: string,
  ) => {
    if (meals.count === 0) return null;
    return (
      <View style={styles.mealSection}>
        <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
          <Text style={[styles.sectionLabel, { color }]}>{label}</Text>
        </View>
        <View style={styles.itemsList}>
          {meals.items.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              • {item}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  const renderOrder = ({ item }: { item: KitchenDomainModel.KitchenOrder }) => {
    const totalMeals =
      item.meals.entry.count +
      item.meals.mainCourse.count +
      item.meals.dessert.count;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.tableInfo}>
            <Text style={styles.tableTitle}>
              {item.tableTitle || `Table ${item.tableId}`}
            </Text>
            <Text style={styles.guestCount}>
              {item.guestCount} convive{item.guestCount > 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.timeInfo}>
            <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
            <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.mealsContainer}>
          {renderMealSection(item.meals.entry, 'Entrées', colors.mealEntry)}
          {renderMealSection(item.meals.mainCourse, 'Plats', colors.mealMain)}
          {renderMealSection(item.meals.dessert, 'Desserts', colors.mealDessert)}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Terminée</Text>
          </View>
          <Text style={styles.totalMeals}>{totalMeals} plat{totalMeals > 1 ? 's' : ''}</Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>Aucun historique</Text>
      <Text style={styles.emptySubtitle}>
        Les commandes terminées apparaîtront ici
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerIcon}>📋</Text>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Historique</Text>
          {restaurantName && (
            <Text style={styles.restaurantName}>{restaurantName}</Text>
          )}
        </View>
        {loading && <ActivityIndicator color={colors.gold} size="small" />}
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchCompletedOrders}
            tintColor={colors.gold}
            colors={[colors.gold]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.bgSecondary,
    gap: 8,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  backText: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: '600',
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  restaurantName: {
    color: colors.textMuted,
    fontSize: 12,
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tableInfo: {
    flex: 1,
  },
  tableTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  guestCount: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  timeInfo: {
    alignItems: 'flex-end',
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  mealsContainer: {
    gap: 12,
    marginBottom: 12,
  },
  mealSection: {
    gap: 4,
  },
  sectionHeader: {
    borderLeftWidth: 3,
    paddingLeft: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  itemsList: {
    paddingLeft: 12,
    gap: 2,
  },
  itemText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.goldBorder,
    paddingTop: 12,
  },
  completedBadge: {
    backgroundColor: colors.sage,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  totalMeals: {
    color: colors.textMuted,
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    minHeight: 400,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: colors.rose,
    padding: 12,
  },
  errorText: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
