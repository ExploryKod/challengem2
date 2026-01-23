import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../../theme';
import { KitchenDomainModel } from '../../core/model/kitchen.domain-model';
import { IKitchenGateway } from '../../core/gateway/kitchen.gateway';
import { useKitchen } from '../hooks/use-kitchen.hook';
import { FilterTabs } from '../components/FilterTabs';
import { OrderCard } from '../components/OrderCard';

type KitchenScreenProps = {
  gateway: IKitchenGateway;
};

export const KitchenScreen: React.FC<KitchenScreenProps> = ({ gateway }) => {
  const {
    orders,
    filter,
    loading,
    error,
    setFilter,
    markCourseReady,
    refresh,
  } = useKitchen(gateway);

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
        <Text style={styles.headerIcon}>🍳</Text>
        <Text style={styles.headerTitle}>Cuisine</Text>
        {loading && <ActivityIndicator color={colors.gold} size="small" />}
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
  headerIcon: {
    fontSize: 24,
  },
  headerTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
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
