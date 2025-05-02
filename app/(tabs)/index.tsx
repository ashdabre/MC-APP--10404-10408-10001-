import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Camera, User, ShoppingCart, Star, Scan } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useRecipes } from '../../contexts/RecipeContext';
import RecipeCard from '../../components/RecipeCard';
import Button from '../../components/Button';

// Conditionally prevent auto hide of splash screen
if (Platform.OS !== 'web') {
  try {
    SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.log('Error preventing splash screen auto hide:', e);
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const { recipes, toggleFavoriteRecipe, suggestedRecipes } = useRecipes();
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

  const handleScanPress = () => {
    router.push('/scan');
  };

  const recommendedRecipes = recipes.slice(0, 3);
  const quickMeals = recipes.filter(recipe => recipe.prepTime + recipe.cookTime < 30).slice(0, 3);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
            Welcome to
          </Text>
          <Text style={[styles.appName, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
            FridgeToCooking
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.profileButton, { backgroundColor: colors.card }]}
          onPress={() => router.push('/profile')}
        >
          <User size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.bannerContainer, { backgroundColor: colors.primary }]}>
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTitle, { fontFamily: 'Poppins-SemiBold' }]}>
              What's in your fridge?
            </Text>
            <Text style={[styles.bannerText, { fontFamily: 'Poppins-Regular' }]}>
              Scan your ingredients to discover delicious recipes
            </Text>
            <Button
              title="Scan Now"
              onPress={handleScanPress}
              variant="secondary"
              icon={<Scan size={18} color="#FFFFFF" />}
              style={styles.bannerButton}
              textStyle={{ fontFamily: 'Poppins-SemiBold' }}
            />
          </View>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5605523/pexels-photo-5605523.jpeg?auto=compress&cs=tinysrgb&h=350' }}
            style={styles.bannerImage}
          />
        </View>
        
        {suggestedRecipes.length > 0 ? (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
              Based on Your Ingredients
            </Text>
            {suggestedRecipes.slice(0, 3).map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onToggleFavorite={toggleFavoriteRecipe} 
              />
            ))}
          </View>
        ) : null}
        
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
            Recommended for You
          </Text>
          {recommendedRecipes.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onToggleFavorite={toggleFavoriteRecipe} 
            />
          ))}
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
            Quick Meals (Under 30 min)
          </Text>
          {quickMeals.map(recipe => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onToggleFavorite={toggleFavoriteRecipe} 
            />
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 10,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 14,
  },
  appName: {
    fontSize: 20,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  bannerContent: {
    flex: 1,
    padding: 16,
  },
  bannerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    maxWidth: 120,
  },
  bannerImage: {
    width: 140,
    height: 180,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
});