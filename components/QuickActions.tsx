import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share,Linking } from 'react-native';
import { Phone, Route, Share2, Shield } from 'lucide-react-native';

export default function QuickActions() {
  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'This will call emergency services immediately. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call 100',
          onPress: () => Linking.openURL('tel:100')
        }
      ]
    );
  };
  const handleSafeRoute = () => {
    Alert.alert('Safe Route', 'Finding the safest route to your destination...');
  };

  const handleShareLocation = async () => {
    try {
      // Use browser's geolocation for faster response
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 300000 // 5 minutes cache
        });
      });

      const { latitude, longitude } = position.coords;
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      await Share.share({
        message: `Here’s my current location: ${locationUrl}`,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to get location quickly. Please try again.');
    }
  };

  const handleSafeMode = () => {
    Alert.alert('Safe Mode', 'Activating enhanced safety monitoring...');
  };

  const actions = [
    {
      id: 'emergency',
      title: 'Emergency',
      subtitle: 'Call 100',
      icon: <Phone size={24} color="#FFFFFF" />,
      backgroundColor: '#EF4444',
      onPress: handleEmergencyCall
    },
    {
      id: 'route',
      title: 'Safe Route',
      subtitle: 'Avoid danger',
      icon: <Route size={24} color="#FFFFFF" />,
      backgroundColor: '#10B981',
      onPress: handleSafeRoute
    },
    {
      id: 'share',
      title: 'Share Location',
      subtitle: 'With contacts',
      icon: <Share2 size={24} color="#FFFFFF" />,
      backgroundColor: '#4F46E5',
      onPress: handleShareLocation
    },
    {
      id: 'safe',
      title: 'Safe Mode',
      subtitle: 'Enhanced tracking',
      icon: <Shield size={24} color="#FFFFFF" />,
      backgroundColor: '#F59E0B',
      onPress: handleSafeMode
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: action.backgroundColor }]}
            onPress={action.onPress}
          >
            <View style={styles.actionIcon}>
              {action.icon}
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
});