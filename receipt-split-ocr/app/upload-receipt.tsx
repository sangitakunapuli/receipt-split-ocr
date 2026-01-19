import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useReceiptContext } from '@/contexts/ReceiptContext';
import { parseReceiptWithGoogleVision } from '@/services/ocrService';
import { Receipt } from '@/types';
import Config from 'react-native-config';


// From https://console.cloud.google.com/
const GOOGLE_VISION_API_KEY = "";

export default function UploadReceiptScreen() {
  const router = useRouter();
  const { addGroupMember, groupMembers, setReceipt } = useReceiptContext();
  const [newMemberName, setNewMemberName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleCameraCapture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleProcessReceipt = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    if (groupMembers.length < 2) {
      Alert.alert('Error', 'Please add at least 2 group members');
      return;
    }

    setLoading(true);
    try {
      const ocrResult = await parseReceiptWithGoogleVision(selectedImage, GOOGLE_VISION_API_KEY);

      const newReceipt: Receipt = {
        id: Date.now().toString(),
        imageUri: selectedImage,
        items: ocrResult.items.map((item, index) => ({
          id: index.toString(),
          name: item.name,
          price: item.price,
          assignedTo: [],
        })),
        subtotal: ocrResult.subtotal,
        tax: ocrResult.tax,
        tip: ocrResult.tip,
        total: ocrResult.total,
        createdAt: new Date(),
      };

      setReceipt(newReceipt);
      router.push('/edit-receipt');
    } catch (error) {
      Alert.alert('Error', 'Failed to process receipt. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addGroupMember(newMemberName);
      setNewMemberName('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Step 1: Create Group</Text>
        <Text style={styles.description}>
          Add the people who will share this receipt
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter member name"
            value={newMemberName}
            onChangeText={setNewMemberName}
            onSubmitEditing={handleAddMember}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddMember}>
            <Text style={styles.buttonText}>Add Member</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.membersList}>
          {groupMembers.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <Text style={styles.memberName}>{member.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Step 2: Upload Receipt</Text>
        <Text style={styles.description}>
          Take a photo or upload an image of your receipt
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.flex1]}
            onPress={handleCameraCapture}
          >
            <Text style={styles.buttonText}>📷 Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.flex1, styles.marginLeft]}
            onPress={handlePickImage}
          >
            <Text style={styles.buttonText}>🖼️ Gallery</Text>
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <Text style={styles.successText}>✓ Image selected</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          (loading || !selectedImage || groupMembers.length < 2) &&
            styles.disabledButton,
        ]}
        onPress={handleProcessReceipt}
        disabled={loading || !selectedImage || groupMembers.length < 2}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.primaryButtonText}>Process Receipt with OCR</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  marginLeft: {
    marginLeft: 8,
  },
  membersList: {
    gap: 8,
  },
  memberItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  successText: {
    color: '#34C759',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
