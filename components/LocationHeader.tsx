import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, ChevronDown } from 'lucide-react-native';

interface LocationHeaderProps {
  location: string;
  onLocationPress: () => void;
}

export default function LocationHeader({ location, onLocationPress }: LocationHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
        <MapPin size={20} color="#4F46E5" />
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Current Location</Text>
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <ChevronDown size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});