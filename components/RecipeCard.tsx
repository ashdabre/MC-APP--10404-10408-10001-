import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Users, ChefHat, Heart } from 'lucide-react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { Recipe } from '../contexts/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
  onToggleFavorite?: (id: string) => void;
}

export default function RecipeCard({ recipe, onToggleFavorite }: RecipeCardProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handlePress = () => {
    router.push({
      pathname: '/recipe/[id]',
      params: { id: recipe.id }
    });
  };

  const getDifficultyColor = () => {
    switch (recipe.difficulty) {
      case 'easy':
        return colors.success;
      case 'medium':
        return colors.warning;
      case 'hard':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.card }]} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      
      {onToggleFavorite && (
        <TouchableOpacity 
          style={[styles.favoriteButton, { backgroundColor: colors.background }]}
          onPress={() => onToggleFavorite(recipe.id)}
        >
          <Heart 
            size={18} 
            color={recipe.isFavorite ? colors.error : colors.textLight} 
            fill={recipe.isFavorite ? colors.error : 'none'} 
          />
        </TouchableOpacity>
      )}
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{recipe.title}</Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Clock size={14} color={colors.textLight} />
            <Text style={[styles.infoText, { color: colors.textLight }]}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Users size={14} color={colors.textLight} />
            <Text style={[styles.infoText, { color: colors.textLight }]}>
              {recipe.servings}
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <ChefHat size={14} color={getDifficultyColor()} />
            <Text style={[styles.infoText, { color: getDifficultyColor() }]}>
              {recipe.difficulty}
            </Text>
          </View>
        </View>
        
        <View style={styles.tagsContainer}>
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <View 
              key={index}
              style={[styles.tag, { backgroundColor: colors.borderLight }]}
            >
              <Text style={[styles.tagText, { color: colors.textLight }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    }),
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      }
    }),
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});