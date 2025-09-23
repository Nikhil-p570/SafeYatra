import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Camera, Image as ImageIcon, Upload, Zap, Clock } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface AnalysisResult {
  id: string;
  confidence: number;
  label: string;
  timestamp: Date;
}

interface HistoryItem {
  id: string;
  imageUri: string;
  result: AnalysisResult;
  timestamp: Date;
}

export default function Detection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Media library permission is required to select photos.');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setCurrentResult(null);
    }
  };

  const uploadPhoto = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setCurrentResult(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        id: Date.now().toString(),
        confidence: Math.floor(Math.random() * 40) + 60, // Random confidence between 60-99%
        label: ['Apple', 'Orange', 'Banana', 'Grape', 'Strawberry'][Math.floor(Math.random() * 5)],
        timestamp: new Date(),
      };

      setCurrentResult(mockResult);
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        imageUri: selectedImage,
        result: mockResult,
        timestamp: new Date(),
      };
      
      setHistory(prev => [historyItem, ...prev]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setCurrentResult(null);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>👁️ AI Detection</Text>
        <Text style={styles.subtitle}>Upload or capture an image to analyze</Text>
      </View>

      {/* Image Selection Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <Camera size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={uploadPhoto}>
          <Upload size={24} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Image */}
      {selectedImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.clearButton} onPress={clearImage}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Analyze Button */}
      {selectedImage && (
        <TouchableOpacity 
          style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]} 
          onPress={analyzeImage}
          disabled={isAnalyzing}
        >
          <Zap size={20} color="#FFFFFF" />
          <Text style={styles.analyzeButtonText}>
            {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Results */}
      {currentResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Analysis Result</Text>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>{currentResult.label}</Text>
            <Text style={styles.resultConfidence}>
              Confidence: {currentResult.confidence}%
            </Text>
            <Text style={styles.resultTimestamp}>
              {formatTimestamp(currentResult.timestamp)}
            </Text>
          </View>
        </View>
      )}

      {/* History */}
      {history.length > 0 && (
        <View style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Clock size={20} color="#6B7280" />
            <Text style={styles.historyTitle}>Recent History</Text>
          </View>
          
          {history.slice(0, 5).map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Image source={{ uri: item.imageUri }} style={styles.historyImage} />
              <View style={styles.historyContent}>
                <Text style={styles.historyLabel}>{item.result.label}</Text>
                <Text style={styles.historyConfidence}>
                  {item.result.confidence}% confidence
                </Text>
                <Text style={styles.historyTimestamp}>
                  {formatTimestamp(item.timestamp)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {!selectedImage && history.length === 0 && (
        <View style={styles.emptyState}>
          <ImageIcon size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>No images analyzed yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Take or upload a photo to get started
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedImage: {
    width: 280,
    height: 280,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  clearButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginBottom: 32,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 24,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
  },
  resultConfidence: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  resultTimestamp: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  historyContainer: {
    marginTop: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  historyContent: {
    flex: 1,
  },
  historyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  historyConfidence: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 2,
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});