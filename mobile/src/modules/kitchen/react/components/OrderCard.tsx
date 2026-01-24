import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../theme';
import { KitchenDomainModel } from '../../core/model/kitchen.domain-model';
import { CourseSection } from './CourseSection';

type OrderCardProps = {
  order: KitchenDomainModel.KitchenOrder;
  onMarkCourseReady: (course: KitchenDomainModel.CourseType) => void;
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onMarkCourseReady,
}) => {
  const getTimeAgo = (createdAt: string): string => {
    const minutes = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / 60000,
    );
    if (minutes < 1) return "À l'instant";
    if (minutes === 1) return 'Il y a 1 min';
    return `Il y a ${minutes} min`;
  };

  const isInPreparation = order.status === 'IN_PREPARATION';

  return (
    <View style={[styles.container, isInPreparation && styles.inPreparation]}>
      <View style={styles.header}>
        <View style={styles.tableInfo}>
          <Text style={styles.tableTitle}>
            {order.tableTitle || `Table ${order.tableId}`}
          </Text>
          <Text style={styles.guestCount}>{order.guestCount} couverts</Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.timeAgo}>{getTimeAgo(order.createdAt)}</Text>
          {isInPreparation && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>En cours</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.courses}>
        <CourseSection
          courseType="entry"
          meals={order.meals.entry}
          isReady={order.coursesReady.entry}
          onMarkReady={() => onMarkCourseReady('entry')}
        />
        <CourseSection
          courseType="mainCourse"
          meals={order.meals.mainCourse}
          isReady={order.coursesReady.mainCourse}
          onMarkReady={() => onMarkCourseReady('mainCourse')}
        />
        <CourseSection
          courseType="dessert"
          meals={order.meals.dessert}
          isReady={order.coursesReady.dessert}
          onMarkReady={() => onMarkCourseReady('dessert')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.goldBorder,
  },
  inPreparation: {
    borderColor: colors.gold,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
  },
  tableInfo: {
    flex: 1,
  },
  tableTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  guestCount: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  meta: {
    alignItems: 'flex-end',
  },
  timeAgo: {
    color: colors.textMuted,
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    color: colors.bgPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
  courses: {
    gap: 4,
  },
});
