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
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>{config.icon}</Text>
          <Text style={[styles.label, { color: config.color }]}>
            {config.label} ({meals.count})
          </Text>
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

      {meals.items.length > 0 && (
        <Text style={styles.items}>{meals.items.join(', ')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.goldBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  items: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 28,
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
