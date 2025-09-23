import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as Location from "expo-location";

interface DangerZone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  alertLevel: "high" | "medium" | "low";
}

interface Attraction {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  safetyLevel: "safe" | "caution" | "danger";
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);

  // Example data
  const dangerZones: DangerZone[] = [
    { id: "1", name: "Flood Zone", latitude: 28.62, longitude: 77.21, radius: 500, alertLevel: "high" },
    { id: "2", name: "Crime Hotspot", latitude: 28.61, longitude: 77.22, radius: 300, alertLevel: "medium" },
  ];

  const attractions: Attraction[] = [
    { id: "a1", name: "India Gate", latitude: 28.6129, longitude: 77.2295, safetyLevel: "safe" },
    { id: "a2", name: "Connaught Place", latitude: 28.6315, longitude: 77.2167, safetyLevel: "caution" },
  ];

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

      {/* Danger Zones List */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Danger Zones</Text>
        {dangerZones.map((zone) => (
          <View key={zone.id} style={styles.listItem}>
            <Text style={styles.itemName}>{zone.name}</Text>
            <Text style={[styles.alertLevel, { color: getAlertColor(zone.alertLevel) }]}>
              {zone.alertLevel.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>

      {/* Attractions List */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Nearby Attractions</Text>
        {attractions.map((attraction) => (
          <View key={attraction.id} style={styles.listItem}>
            <Text style={styles.itemName}>{attraction.name}</Text>
            <Text style={[styles.safetyLevel, { color: getSafetyColor(attraction.safetyLevel) }]}>
              {attraction.safetyLevel.toUpperCase()}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const getAlertColor = (level: string) => {
  switch (level) {
    case "high": return "#EF4444";
    case "medium": return "#F59E0B";
    case "low": return "#10B981";
    default: return "#6B7280";
  }
};

const getSafetyColor = (safety: string) => {
  switch (safety) {
    case "safe": return "#10B981";
    case "caution": return "#F59E0B";
    case "danger": return "#EF4444";
    default: return "#6B7280";
  }
};

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