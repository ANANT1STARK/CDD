import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

// npx expo install expo-image-picker
// (permissions declared in app.json — see plugin config)

export default function CaptureScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  };

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission needed', 'Please enable camera access in settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync(pickerOptions);
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Gallery permission needed', 'Please enable photo access in settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('No photo selected', 'Please take or choose a photo first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'crop_photo.jpg',
      });

      // Replace with your computer's local IP (not localhost) — e.g. http://192.168.1.42:8000
      const response = await fetch('http://10.221.36.235:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      navigation.navigate('Result', { result: data, imageUri });
    } catch (error) {
      setLoading(false);
      Alert.alert('Something went wrong', 'Could not reach the server. Please check your connection and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan crop</Text>
      </View>

      <View style={styles.previewBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Center the affected leaf in the frame</Text>
          </View>
        )}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.galleryButton} onPress={handleGallery}>
          <Text style={styles.galleryButtonText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={handleCamera} />

        <View style={styles.spacer} />
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipText}>
          Good lighting and a close, sharp shot give the best result
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !imageUri && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={!imageUri || loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Analyzing...' : 'Analyze photo'}
        </Text>
      </TouchableOpacity>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f2f2f2',
  },
  previewBox: {
    height: 320,
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#9a9a9a',
    fontSize: 13,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  galleryButton: {
    width: 84,
    height: 84,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4caf50',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  galleryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4caf50',
  },
  spacer: {
    width: 84,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4caf50',
    borderWidth: 4,
    borderColor: '#2a2a2a',
  },
  tipBox: {
    marginHorizontal: 16,
    marginTop: 18,
    padding: 14,
    backgroundColor: '#1e2b1e',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  tipText: {
    fontSize: 14,
    color: '#c8e6c9',
    lineHeight: 20,
    fontWeight: '500',
  },
  submitButton: {
    margin: 16,
    marginTop: 'auto',
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#2f4a30',
  },
  submitButtonText: {
    color: '#0f0f0f',
    fontSize: 15,
    fontWeight: '700',
  },
});