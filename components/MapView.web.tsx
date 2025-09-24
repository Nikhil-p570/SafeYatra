import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { Navigation } from "lucide-react-native";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  const refreshLocation = async () => {
    setLoading(true);
    try {
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (error) {
      console.error('Error refreshing location:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>No location available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Web placeholder for map */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderTitle}>Map View (Web)</Text>
        <Text style={styles.placeholderText}>
          Interactive maps are not available on web platform.
        </Text>
        <Text style={styles.placeholderText}>
          Use the mobile app for full map functionality.
        </Text>
        
        {/* Center Button for Web */}
        <TouchableOpacity 
          style={styles.centerButton}
          onPress={refreshLocation}
        >
          <Navigation size={20} color="#4F46E5" />
          <Text style={styles.centerButtonText}>Refresh Location</Text>
        </TouchableOpacity>
      </View>

      {/* Location Info */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Current Location</Text>
        <Text style={styles.infoText}>
          Latitude: {location.coords.latitude.toFixed(4)}
        </Text>
        <Text style={styles.infoText}>
          Longitude: {location.coords.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginVertical: 2,
  },
  centerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  centerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#374151",
    marginVertical: 2,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemName: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  alertLevel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  safetyLevel: {
    fontSize: 12,
    fontWeight: "bold",
  },
});