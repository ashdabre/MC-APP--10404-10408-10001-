import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Trash2, ShoppingBag, ChevronRight, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useRecipes } from '../../contexts/RecipeContext';
import IngredientItem from '../../components/IngredientItem';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';

// Conditionally prevent auto hide of splash screen
if (Platform.OS !== 'web') {
  try {
    SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.log('Error preventing splash screen auto hide:', e);
  }
}

export default function CartScreen() {
  const { cartItems, removeFromCart, clearCart } = useRecipes();
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

  const handleCheckout = () => {
    alert('This would connect to a delivery service in a real app!');
  };

  const getTotalItems = () => {
    return cartItems.length;
  };

  // This would be a real calculation in a production app
  const getEstimatedTotal = () => {
    return '$' + (cartItems.length * 2 + 5).toFixed(2);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
          Shopping Cart
        </Text>
        
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={clearCart}>
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
      
      {cartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add ingredients from recipes to your cart and order them for delivery"
          icon={<ShoppingBag size={64} color={colors.textLight} />}
          actionLabel="Browse Recipes"
          onAction={() => {}}
        />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
                Items ({getTotalItems()})
              </Text>
              
              {cartItems.map(item => (
                <IngredientItem
                  key={item.id}
                  ingredient={item}
                  showRemove
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </View>
            
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <ShoppingBag size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
                  Delivery with Zepto
                </Text>
                <Text style={[styles.infoText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
                  30-45 minutes delivery time
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </View>
            
            <View style={[styles.noticeCard, { backgroundColor: colors.warning + '20' }]}>
              <AlertTriangle size={20} color={colors.warning} />
              <Text style={[styles.noticeText, { fontFamily: 'Poppins-Regular', color: colors.text }]}>
                This is a demo app. No actual orders will be placed.
              </Text>
            </View>
          </ScrollView>
          
          <View style={[styles.checkoutContainer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
            <View style={styles.priceContainer}>
              <Text style={[styles.priceLabel, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
                Estimated Total:
              </Text>
              <Text style={[styles.priceValue, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
                {getEstimatedTotal()}
              </Text>
            </View>
            
            <Button
              title="Checkout"
              onPress={handleCheckout}
              variant="primary"
              size="lg"
              style={styles.checkoutButton}
              textStyle={{ fontFamily: 'Poppins-SemiBold' }}
              fullWidth
            />
          </View>
        </>
      )}
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
  headerTitle: {
    fontSize: 24,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionContainer: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  noticeText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  checkoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 16,
  },
  priceValue: {
    fontSize: 20,
  },
  checkoutButton: {
    
  },
});