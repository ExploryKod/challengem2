import React from 'react';
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
import { useKitchen } from '../hooks/use-kitchen.hook';
import { FilterTabs } from '../components/FilterTabs';
import { OrderCard } from '../components/OrderCard';

type KitchenScreenProps = {
  gateway: IKitchenGateway;
  restaurantId: number;
  restaurantName?: string;
  onBack?: () => void;
  onHistory?: () => void;
};

export const KitchenScreen: React.FC<KitchenScreenProps> = ({
  gateway,
  restaurantId,
  restaurantName,
  onBack,
  onHistory,
}) => {
  const {
    orders,
    filter,
    loading,
    error,
    setFilter,
    markCourseReady,
    refresh,
  } = useKitchen(gateway, restaurantId);

  const handleMarkCourseReady = (
    orderId: number,
    course: KitchenDomainModel.CourseType,
  ) => {
    markCourseReady(orderId, course);
  };

  const renderOrder = ({
    item,
  }: {
    item: KitchenDomainModel.KitchenOrder;
  }) => (
    <OrderCard
      order={item}
      onMarkCourseReady={(course) => handleMarkCourseReady(item.id, course)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>👨‍🍳</Text>
      <Text style={styles.emptyTitle}>Aucune commande en attente</Text>
      <Text style={styles.emptySubtitle}>
        Les nouvelles commandes apparaîtront ici
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerIcon}>🍳</Text>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Cuisine</Text>
          {restaurantName && (
            <Text style={styles.restaurantName}>{restaurantName}</Text>
          )}
        </View>
        {loading && <ActivityIndicator color={colors.gold} size="small" />}
        {onHistory && (
          <TouchableOpacity onPress={onHistory} style={styles.historyButton}>
            <Text style={styles.historyText}>Historique</Text>
          </TouchableOpacity>
        )}
      </View>

      <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

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
            onRefresh={refresh}
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
  historyButton: {
    backgroundColor: colors.bgCard,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  historyText: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: '500',
  },
  list: {
    paddingVertical: 8,
    flexGrow: 1,
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
