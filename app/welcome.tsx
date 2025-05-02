import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../contexts/AuthContext';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import Button from '../components/Button';
import { ChevronRight, Mail, Lock, User } from 'lucide-react-native';

// Conditionally prevent auto hide of splash screen
if (Platform.OS !== 'web') {
  try {
    SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.log('Error preventing splash screen auto hide:', e);
  }
}

export default function WelcomeScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');

  const { signIn, signUp, isLoading } = useAuth();
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

  const handleSubmit = async () => {
    try {
      setFormError('');
      
      if (!email || !password) {
        setFormError('Please fill in all required fields');
        return;
      }
      
      if (!isLogin && !name) {
        setFormError('Please enter your name');
        return;
      }
      
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, name, password);
      }
    } catch (error) {
      setFormError('Authentication failed. Please try again.');
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&h=350' }} 
          style={styles.logoImage} 
        />
        <Text style={[styles.title, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
          FridgeToCooking
        </Text>
        <Text style={[styles.subtitle, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
          Snap your fridge, cook amazing meals
        </Text>
      </View>
      
      <View style={styles.formContainer}>
        {formError ? (
          <View style={[styles.errorContainer, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{formError}</Text>
          </View>
        ) : null}
        
        {!isLogin && (
          <View style={styles.inputContainer}>
            <User size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { fontFamily: 'Poppins-Regular', color: colors.text, borderColor: colors.border }]}
              placeholder="Full Name"
              placeholderTextColor={colors.textLight}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <Mail size={20} color={colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { fontFamily: 'Poppins-Regular', color: colors.text, borderColor: colors.border }]}
            placeholder="Email"
            placeholderTextColor={colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Lock size={20} color={colors.textLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { fontFamily: 'Poppins-Regular', color: colors.text, borderColor: colors.border }]}
            placeholder="Password"
            placeholderTextColor={colors.textLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        
        <Button
          title={isLogin ? 'Sign In' : 'Sign Up'}
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.submitButton}
          textStyle={{ fontFamily: 'Poppins-SemiBold' }}
        />
        
        <TouchableOpacity style={styles.switchContainer} onPress={() => setIsLogin(!isLogin)}>
          <Text style={[styles.switchText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </Text>
          <Text style={[styles.switchAction, { fontFamily: 'Poppins-SemiBold', color: colors.primary }]}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
          Skip for now
        </Text>
        <ChevronRight size={16} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 44,
    fontSize: 16,
  },
  submitButton: {
    height: 56,
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  switchText: {
    fontSize: 14,
  },
  switchAction: {
    fontSize: 14,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  skipText: {
    fontSize: 14,
    marginRight: 4,
  },
});