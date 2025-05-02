import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, Switch, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LogOut, Heart, Settings, ChevronRight, Bell, Moon, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useAuth } from '../../contexts/AuthContext';
import { useRecipes } from '../../contexts/RecipeContext';
import Button from '../../components/Button';
import RecipeCard from '../../components/RecipeCard';

// Conditionally prevent auto hide of splash screen
if (Platform.OS !== 'web') {
  try {
    SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.log('Error preventing splash screen auto hide:', e);
  }
}

export default function ProfileScreen() {
  const { user, signOut, updateUserPreferences } = useAuth();
  const { favoriteRecipes, toggleFavoriteRecipe } = useRecipes();
  const [darkMode, setDarkMode] = useState(false);
  
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would update the app's theme
  };

  const toggleDietaryPreference = (preference: string) => {
    if (user && user.preferences) {
      const updatedPreferences = { ...user.preferences };
      updatedPreferences[preference as keyof typeof user.preferences] = 
        !updatedPreferences[preference as keyof typeof user.preferences];
      
      updateUserPreferences(updatedPreferences);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
          Profile
        </Text>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' }}
            style={styles.profileImage} 
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
              {user ? user.name : 'Guest User'}
            </Text>
            <Text style={[styles.profileEmail, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
              {user ? user.email : 'Sign in to sync your recipes'}
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
            Dietary Preferences
          </Text>
          
          <View style={[styles.preferenceCard, { backgroundColor: colors.card }]}>
            <View style={styles.preferenceItem}>
              <Text style={[styles.preferenceLabel, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                Vegetarian
              </Text>
              <Switch
                value={user?.preferences?.vegetarian || false}
                onValueChange={() => toggleDietaryPreference('vegetarian')}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={[styles.preferenceLabel, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                Vegan
              </Text>
              <Switch
                value={user?.preferences?.vegan || false}
                onValueChange={() => toggleDietaryPreference('vegan')}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={[styles.preferenceLabel, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                Gluten Free
              </Text>
              <Switch
                value={user?.preferences?.glutenFree || false}
                onValueChange={() => toggleDietaryPreference('glutenFree')}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.preferenceItem}>
              <Text style={[styles.preferenceLabel, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                Dairy Free
              </Text>
              <Switch
                value={user?.preferences?.dairyFree || false}
                onValueChange={() => toggleDietaryPreference('dairyFree')}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
        
        {favoriteRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
              Favorite Recipes
            </Text>
            
            {favoriteRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onToggleFavorite={toggleFavoriteRecipe} 
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
            Settings
          </Text>
          
          <View style={[styles.settingsCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Bell size={20} color={colors.textLight} style={styles.settingsIcon} />
                <Text style={[styles.settingsLabel, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                  Notifications
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <View style={styles.settingsDivider} />
            
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Moon size={20} color={colors.textLight} style={styles.settingsIcon} />
                <Text style={[styles.settingsLabel, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={styles.settingsDivider} />
            
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <HelpCircle size={20} color={colors.textLight} style={styles.settingsIcon} />
                <Text style={[styles.settingsLabel, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                  Help & Support
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>
        
        <Button
          title="Sign Out"
          onPress={signOut}
          variant="outline"
          icon={<LogOut size={18} color={colors.error} />}
          style={[styles.signOutButton, { borderColor: colors.error }]}
          textStyle={{ fontFamily: 'Poppins-SemiBold', color: colors.error }}
          fullWidth
        />
      </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  preferenceCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  preferenceLabel: {
    fontSize: 16,
  },
  settingsCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginRight: 12,
  },
  settingsLabel: {
    fontSize: 16,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: 16,
  },
  signOutButton: {
    marginTop: 12,
  },
});