import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Platform, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Camera as CameraIcon, Image as ImageIcon, ArrowLeft, Check, Plus, X } from 'lucide-react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { useRecipes } from '../../contexts/RecipeContext';
import { mockIngredients } from '../../data/mockIngredients';
import IngredientItem from '../../components/IngredientItem';
import Button from '../../components/Button';
import { AutoImageProcessor, AutoModelForObjectDetection } from '@huggingface/transformers';


// Conditionally prevent auto hide of splash screen
if (Platform.OS !== 'web') {
  try {
    SplashScreen.preventAutoHideAsync();
  } catch (e) {
    console.log('Error preventing splash screen auto hide:', e);
  }
}

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<'select' | 'camera' | 'results'>('select');
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<typeof mockIngredients>([]);
  const cameraRef = useRef<any>(null);
  
  const { setDetectedIngredients: setContextDetectedIngredients } = useRecipes();
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

  // In a real app, this would connect to an AI service to detect ingredients
  const analyzeImage = async () => {
    // Simulate a delay for "processing"
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, randomly select 3-5 ingredients from mock data
    const randomCount = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...mockIngredients].sort(() => 0.5 - Math.random());
    const randomIngredients = shuffled.slice(0, randomCount);
    
    setDetectedIngredients(randomIngredients);
    return randomIngredients;
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      const detected = await analyzeImage();
      setMode('results');
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };
  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setCapturedImage(result.assets[0].uri);
        const detected = await analyzeImage();
        setMode('results');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSaveIngredients = () => {
    // Save detected ingredients to context
    setContextDetectedIngredients(detectedIngredients);
    
    // Navigate to home screen
    router.push('/');
  };

  const removeIngredient = (id: string) => {
    setDetectedIngredients(detectedIngredients.filter(item => item.id !== id));
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions not granted
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
            Camera Permission Required
          </Text>
          <Text style={[styles.permissionText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
            We need camera permission to scan your ingredients
          </Text>
          <Button
            title="Grant Permission"
            onPress={requestPermission}
            variant="primary"
            style={styles.permissionButton}
            textStyle={{ fontFamily: 'Poppins-SemiBold' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {mode === 'select' && (
        <View style={styles.selectContainer}>
          <Text style={[styles.selectTitle, { fontFamily: 'Poppins-Bold', color: colors.text }]}>
            Scan Your Ingredients
          </Text>
          <Text style={[styles.selectText, { fontFamily: 'Poppins-Regular', color: colors.textLight }]}>
            Take a photo of your fridge or pantry to discover what you can cook
          </Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.primary }]}
              onPress={() => setMode('camera')}
            >
              <CameraIcon size={32} color="#FFFFFF" style={styles.optionIcon} />
              <Text style={[styles.optionText, { fontFamily: 'Poppins-SemiBold' }]}>
                Take Photo
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.secondary }]}
              onPress={pickImage}
            >
              <ImageIcon size={32} color="#FFFFFF" style={styles.optionIcon} />
              <Text style={[styles.optionText, { fontFamily: 'Poppins-SemiBold' }]}>
                Upload Photo
              </Text>
            </TouchableOpacity>
          </View>
          
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4439642/pexels-photo-4439642.jpeg?auto=compress&cs=tinysrgb&h=350' }}
            style={styles.illustrationImage}
          />
        </View>
      )}
      
      {mode === 'camera' && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            ref={cameraRef}
            facing={cameraType}
            onMountError={(error) => console.error('Camera error:', error)}
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={[styles.backButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                onPress={() => setMode('select')}
              >
                <ArrowLeft size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.flipButton, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                onPress={() => setCameraType(current => (current === 'back' ? 'front' : 'back'))}
              >
                <CameraIcon size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
      
      {mode === 'results' && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <TouchableOpacity
              style={[styles.backButtonAlt, { backgroundColor: colors.card }]}
              onPress={() => setMode('select')}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.resultsTitle, { fontFamily: 'Poppins-SemiBold', color: colors.text }]}>
              Detected Ingredients
            </Text>
          </View>
          
          {capturedImage && (
            <Image
              source={{ uri: capturedImage }}
              style={styles.resultImage}
              resizeMode="cover"
            />
          )}
          
          <ScrollView style={styles.ingredientsList}>
            {detectedIngredients.map(ingredient => (
              <IngredientItem
                key={ingredient.id}
                ingredient={ingredient}
                showRemove
                onRemove={() => removeIngredient(ingredient.id)}
              />
            ))}
          </ScrollView>
          
          <Button
            title="Save Ingredients"
            onPress={handleSaveIngredients}
            variant="primary"
            size="lg"
            icon={<Check size={18} color="#FFFFFF" />}
            style={styles.saveButton}
            textStyle={{ fontFamily: 'Poppins-SemiBold' }}
            fullWidth
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    minWidth: 200,
  },
  selectContainer: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 24,
  },
  selectTitle: {
    fontSize: 28,
    marginBottom: 12,
  },
  selectText: {
    fontSize: 16,
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  optionButton: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  optionIcon: {
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  illustrationImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 30,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonAlt: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultsTitle: {
    fontSize: 20,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  ingredientsList: {
    flex: 1,
    marginBottom: 16,
  },
  saveButton: {
    marginBottom: Platform.OS === 'ios' ? 20 : 10,
  },
});