import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../theme';
import { KitchenDomainModel } from '../../core/model/kitchen.domain-model';

type CourseSectionProps = {
  courseType: KitchenDomainModel.CourseType;
  meals: KitchenDomainModel.MealCount;
  isReady: boolean;
  onMarkReady: () => void;
};

const COURSE_CONFIG: Record<
  KitchenDomainModel.CourseType,
  { icon: string; label: string; color: string }
> = {
  entry: { icon: '🥗', label: 'Entrées', color: colors.mealEntry },
  mainCourse: { icon: '🍖', label: 'Plats', color: colors.mealMain },
  dessert: { icon: '🍰', label: 'Desserts', color: colors.mealDessert },
  drink: { icon: '🍷', label: 'Boissons', color: colors.mealDrink },
};

export const CourseSection: React.FC<CourseSectionProps> = ({
  courseType,
  meals,
  isReady,
  onMarkReady,
}) => {
  const config = COURSE_CONFIG[courseType];

  if (meals.count === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: config.color }]}>
          <Text style={styles.categoryIcon}>{config.icon}</Text>
          <Text style={styles.categoryLabel}>{config.label}</Text>
        </View>

        {isReady ? (
          <View style={styles.readyBadge}>
            <Text style={styles.readyText}>✓</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.readyButton} onPress={onMarkReady}>
            <Text style={styles.readyButtonText}>PRÊT</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.itemsList}>
        {meals.items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemBullet}>•</Text>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryLabel: {
    color: colors.bgPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  itemsList: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  itemBullet: {
    color: colors.gold,
    fontSize: 18,
    lineHeight: 22,
    marginRight: 8,
  },
  itemText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  readyButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
  },
  readyButtonText: {
    color: colors.bgPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
  readyBadge: {
    backgroundColor: colors.sage,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readyText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
});
