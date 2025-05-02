import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search as SearchIcon, X } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useRecipes } from '../../contexts/RecipeContext';
import RecipeCard from '../../components/RecipeCard';
import EmptyState from '../../components/EmptyState';

// Conditionally prevent auto hide of splash screen
if (Platform.OS !== 'web') {
  try {
    SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.log('Error preventing splash screen auto hide:', e);
  }
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { recipes, toggleFavoriteRecipe } = useRecipes();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const [fontsLoaded, error] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

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

  // Get unique tags from all recipes
  const getAllTags = () => {
    const tagSet = new Set<string>();
    recipes.forEach(recipe => {
      recipe.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = activeTag === null || recipe.tags.includes(activeTag);
    
    return matchesSearch && matchesTag;
  });

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const toggleTag = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
          Search Recipes
        </Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SearchIcon size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { fontFamily: 'Poppins-Regular', color: colors.text }]}
            placeholder="Search recipes or ingredients"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <X size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
        
        <FlatList
          data={getAllTags()}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item}
          contentContainerStyle={styles.tagsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tagButton,
                { 
                  backgroundColor: activeTag === item ? colors.primary : colors.card,
                  borderColor: activeTag === item ? colors.primary : colors.border
                }
              ]}
              onPress={() => toggleTag(item)}
            >
              <Text 
                style={[
                  styles.tagButtonText,
                  { 
                    fontFamily: 'Poppins-Regular', 
                    color: activeTag === item ? '#FFFFFF' : colors.text 
                  }
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
      
      {filteredRecipes.length === 0 ? (
        <EmptyState
          title="No recipes found"
          description="Try adjusting your search or filters to find more recipes"
          icon={<SearchIcon size={64} color={colors.textLight} />}
        />
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.recipesList}
          renderItem={({ item }) => (
            <RecipeCard 
              recipe={item} 
              onToggleFavorite={toggleFavoriteRecipe} 
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  tagsList: {
    paddingBottom: 16,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  tagButtonText: {
    fontSize: 14,
  },
  recipesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});