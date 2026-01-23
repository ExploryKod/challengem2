import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../theme';
import { KitchenDomainModel } from '../../core/model/kitchen.domain-model';

type FilterTabsProps = {
  activeFilter: KitchenDomainModel.FilterType;
  onFilterChange: (filter: KitchenDomainModel.FilterType) => void;
};

const FILTERS: { key: KitchenDomainModel.FilterType; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'entry', label: 'Entrées' },
  { key: 'mainCourse', label: 'Plats' },
  { key: 'dessert', label: 'Desserts' },
  { key: 'drink', label: 'Boissons' },
];

export const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.key}
          style={[
            styles.tab,
            activeFilter === filter.key && styles.activeTab,
          ]}
          onPress={() => onFilterChange(filter.key)}
        >
          <Text
            style={[
              styles.tabText,
              activeFilter === filter.key && styles.activeTabText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
  },
  activeTab: {
    backgroundColor: colors.gold,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.bgPrimary,
    fontWeight: '600',
  },
});
