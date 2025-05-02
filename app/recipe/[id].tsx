import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Clock, Users, ChefHat, Heart, ShoppingCart, Share2 } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useRecipes, Recipe } from '../../contexts/RecipeContext';
import IngredientItem from '../../components/IngredientItem';
import Button from '../../components/Button';

// Conditionally prevent auto hide of splash screen
if (Platform.OS !== 'web') {
  try {
    SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.log('Error preventing splash screen auto hide:', e);
  }
}

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { recipes, toggleFavoriteRecipe, addToCart } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [fontsLoaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (id) {
      const foundRecipe = recipes.find(r => r.id === id);
      if (foundRecipe) {
        setRecipe(foundRecipe);
      }
    }
  }, [id, recipes]);

  React.useEffect(() => {
    if (fontsLoaded || error) {
      if (Platform.OS !== 'web') {
        try {
          SplashScreen.hideAsync();
        } catch (e) {
          console.log('Error hiding splash screen:', e);
        }
      }
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  if (!recipe) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.card }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
            Recipe not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleToggleFavorite = () => {
    toggleFavoriteRecipe(recipe.id);
  };

  const handleAddAllToCart = () => {
    recipe.ingredients.forEach(ingredient => {
      addToCart(ingredient);
    });
    router.push('/cart');
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: colors.card }]}
          onPress={handleToggleFavorite}
        >
          <Heart 
            size={24} 
            color={recipe.isFavorite ? colors.error : colors.textLight}
            fill={recipe.isFavorite ? colors.error : 'none'}
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image 
          source={{ uri: recipe.imageUrl }} 
          style={styles.recipeImage} 
        />
        
        <View style={styles.contentContainer}>
          <Text style={[styles.recipeTitle, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
            {recipe.title}
          </Text>
          
          <View style={styles.recipeInfoContainer}>
            <View style={styles.infoItem}>
              <Clock size={18} color={colors.textLight} />
              <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Users size={18} color={colors.textLight} />
              <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
                {recipe.servings} servings
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <ChefHat size={18} color={getDifficultyColor()} />
              <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular', color: getDifficultyColor() }]}>
                {recipe.difficulty}
              </Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag, index) => (
              <View 
                key={index}
                style={[styles.tag, { backgroundColor: colors.borderLight }]}
              >
                <Text style={[styles.tagText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
              Ingredients
            </Text>
            <View style={styles.ingredientsList}>
              {recipe.ingredients.map(ingredient => (
                <IngredientItem
                  key={ingredient.id}
                  ingredient={ingredient}
                  quantity={ingredient.quantity}
                  unit={ingredient.unit}
                  showCart
                  onAdd={() => addToCart(ingredient)}
                />
              ))}
            </View>
            
            <Button
              title="Add All to Cart"
              onPress={handleAddAllToCart}
              variant="secondary"
              icon={<ShoppingCart size={18} color="#FFFFFF" />}
              style={styles.addToCartButton}
              textStyle={{ fontFamily: 'Poppins-SemiBold' }}
            />
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
              Instructions
            </Text>
            <View style={styles.instructionsList}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={[styles.instructionNumber, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.instructionNumberText, { fontFamily: 'Poppins-SemiBold' }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={[styles.instructionText, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.shareContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Button
          title="Share Recipe"
          onPress={() => {}}
          variant="outline"
          icon={<Share2 size={18} color={colors.primary} />}
          style={styles.shareButton}
          textStyle={{ fontFamily: 'Poppins-SemiBold' }}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: Platform.OS === 'android' ? 50 : 50,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  recipeImage: {
    width: '100%',
    height: 300,
  },
  contentContainer: {
    padding: 20,
  },
  recipeTitle: {
    fontSize: 24,
    marginBottom: 12,
  },
  recipeInfoContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  ingredientsList: {
    marginBottom: 16,
  },
  addToCartButton: {
    alignSelf: 'flex-start',
  },
  instructionsList: {
    
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumberText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  shareContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  shareButton: {
    
  },
});