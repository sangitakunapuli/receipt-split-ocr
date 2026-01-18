import { Image } from 'expo-image';
import { Platform, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Receipt Splitter</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.descriptionContainer}>
        <ThemedText>
          Split receipts easily with your friends. Upload a photo, assign items, and see who owes who.
        </ThemedText>
      </ThemedView>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.push('/upload-receipt')}
      >
        <Text style={styles.primaryButtonText}>📸 Start New Receipt</Text>
      </TouchableOpacity>

      <ThemedView style={styles.stepsContainer}>
        <ThemedText type="subtitle">How it works</ThemedText>
        
        <ThemedView style={styles.stepBox}>
          <ThemedText style={styles.stepNumber}>1</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">Create Group</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Add the people who shared the receipt
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepBox}>
          <ThemedText style={styles.stepNumber}>2</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">Upload & Scan</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Take a photo of the receipt. OCR reads the items and amounts.
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepBox}>
          <ThemedText style={styles.stepNumber}>3</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">Assign Items</ThemedText>
            <ThemedText style={styles.stepDescription}>
              Choose who ordered each item
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.stepBox}>
          <ThemedText style={styles.stepNumber}>4</ThemedText>
          <ThemedView style={styles.stepContent}>
            <ThemedText type="defaultSemiBold">See Settlements</ThemedText>
            <ThemedText style={styles.stepDescription}>
              View who owes who and how much
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#34C759',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepsContainer: {
    gap: 12,
  },
  stepBox: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
