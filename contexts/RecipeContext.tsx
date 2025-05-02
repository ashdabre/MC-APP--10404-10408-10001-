import React, { createContext, useState, useContext } from 'react';

// Types for recipes and ingredients
export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string[];
  ingredients: Ingredient[];
  tags: string[];
  isFavorite?: boolean;
}

interface RecipeContextProps {
  userIngredients: Ingredient[];
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (id: string) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  clearIngredients: () => void;
  
  detectedIngredients: Ingredient[];
  setDetectedIngredients: (ingredients: Ingredient[]) => void;
  
  recipes: Recipe[];
  suggestedRecipes: Recipe[];
  getSuggestedRecipes: () => Recipe[];
  toggleFavoriteRecipe: (id: string) => void;
  favoriteRecipes: Recipe[];
  
  cartItems: Ingredient[];
  addToCart: (ingredient: Ingredient) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Sample data for demo purposes
import { mockRecipes } from '../data/mockRecipes';
import { mockIngredients } from '../data/mockIngredients';

const RecipeContext = createContext<RecipeContextProps>({
  userIngredients: [],
  addIngredient: () => {},
  removeIngredient: () => {},
  updateIngredient: () => {},
  clearIngredients: () => {},
  
  detectedIngredients: [],
  setDetectedIngredients: () => {},
  
  recipes: [],
  suggestedRecipes: [],
  getSuggestedRecipes: () => [],
  toggleFavoriteRecipe: () => {},
  favoriteRecipes: [],
  
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const RecipeProvider = ({ children }: { children: React.ReactNode }) => {
  const [userIngredients, setUserIngredients] = useState<Ingredient[]>([]);
  const [detectedIngredients, setDetectedIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [cartItems, setCartItems] = useState<Ingredient[]>([]);

  // Add ingredient to user's inventory
  const addIngredient = (ingredient: Ingredient) => {
    setUserIngredients([...userIngredients, ingredient]);
  };

  // Remove ingredient from user's inventory
  const removeIngredient = (id: string) => {
    setUserIngredients(userIngredients.filter(ingredient => ingredient.id !== id));
  };

  // Update ingredient in user's inventory
  const updateIngredient = (updatedIngredient: Ingredient) => {
    setUserIngredients(
      userIngredients.map(ingredient => 
        ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
      )
    );
  };

  // Clear all ingredients from user's inventory
  const clearIngredients = () => {
    setUserIngredients([]);
  };

  // Get suggested recipes based on user's ingredients
  const getSuggestedRecipes = () => {
    const allUserIngredients = [...userIngredients, ...detectedIngredients];
    
    if (allUserIngredients.length === 0) {
      return [];
    }
    
    // Simple algorithm to suggest recipes
    // In a real app, this would be more sophisticated
    return recipes.filter(recipe => {
      const userIngredientNames = allUserIngredients.map(ing => ing.name.toLowerCase());
      
      // Count how many ingredients from the recipe the user has
      const matchCount = recipe.ingredients.filter(recipeIng => 
        userIngredientNames.includes(recipeIng.name.toLowerCase())
      ).length;
      
      // Return recipes where the user has at least 60% of the ingredients
      return matchCount / recipe.ingredients.length >= 0.6;
    });
  };

  // Toggle favorite status of a recipe
  const toggleFavoriteRecipe = (id: string) => {
    setRecipes(
      recipes.map(recipe => 
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
  };

  // Get favorite recipes
  const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);

  // Add ingredient to cart
  const addToCart = (ingredient: Ingredient) => {
    setCartItems([...cartItems, ingredient]);
  };

  // Remove ingredient from cart
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <RecipeContext.Provider
      value={{
        userIngredients,
        addIngredient,
        removeIngredient,
        updateIngredient,
        clearIngredients,
        
        detectedIngredients,
        setDetectedIngredients,
        
        recipes,
        suggestedRecipes: getSuggestedRecipes(),
        getSuggestedRecipes,
        toggleFavoriteRecipe,
        favoriteRecipes,
        
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);