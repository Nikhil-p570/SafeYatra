import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
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

  const getDangerColor = (level: string) => {
    switch (level) {
      case "high":
        return "rgba(255,0,0,0.4)";
      case "medium":
        return "rgba(255,165,0,0.4)";
      case "low":
        return "rgba(0,128,0,0.4)";
      default:
        return "rgba(128,128,128,0.4)";
    }
  };

  const getAttractionColor = (safety: string) => {
    switch (safety) {
      case "safe":
        return "green";
      case "caution":
        return "orange";
      case "danger":
        return "red";
      default:
        return "gray";
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
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Current Location */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="You are here"
          pinColor="#4F46E5"
        />

        {/* Danger Zones */}
        {dangerZones.map((zone) => (
          <Circle
            key={zone.id}
            center={{ latitude: zone.latitude, longitude: zone.longitude }}
            radius={zone.radius}
            strokeColor={getDangerColor(zone.alertLevel)}
            fillColor={getDangerColor(zone.alertLevel)}
          />
        ))}

        {/* Attractions */}
        {attractions.map((a) => (
          <Marker
            key={a.id}
            coordinate={{ latitude: a.latitude, longitude: a.longitude }}
            title={a.name}
            pinColor={getAttractionColor(a.safetyLevel)}
          />
        ))}
      </MapView>

      {/* Bottom Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Current Location: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  infoBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
  },
  infoText: { fontSize: 14, color: "#111827" },
});
