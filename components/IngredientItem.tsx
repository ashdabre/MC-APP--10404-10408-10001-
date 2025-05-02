import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { X, Plus, ShoppingCart } from 'lucide-react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Ingredient } from '../contexts/RecipeContext';

interface IngredientItemProps {
  ingredient: Ingredient;
  onPress?: () => void;
  onRemove?: () => void;
  onAdd?: () => void;
  showRemove?: boolean;
  showAdd?: boolean;
  showCart?: boolean;
  quantity?: string;
  unit?: string;
}

export default function IngredientItem({
  ingredient,
  onPress,
  onRemove,
  onAdd,
  showRemove = false,
  showAdd = false,
  showCart = false,
  quantity,
  unit,
}: IngredientItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {ingredient.imageUrl ? (
        <Image source={{ uri: ingredient.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: colors.borderLight }]} />
      )}
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{ingredient.name}</Text>
        {(quantity || ingredient.quantity) && (unit || ingredient.unit) && (
          <Text style={[styles.quantity, { color: colors.textLight }]}>
            {quantity || ingredient.quantity} {unit || ingredient.unit}
          </Text>
        )}
      </View>
      
      <View style={styles.actions}>
        {showRemove && onRemove && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.errorLight }]}
            onPress={onRemove}
          >
            <X size={14} color={colors.error} />
          </TouchableOpacity>
        )}
        
        {showAdd && onAdd && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primaryLight }]}
            onPress={onAdd}
          >
            <Plus size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
        
        {showCart && onAdd && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondaryLight }]}
            onPress={onAdd}
          >
            <ShoppingCart size={14} color={colors.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
  },
  quantity: {
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});