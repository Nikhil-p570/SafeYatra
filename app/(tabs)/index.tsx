import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, TriangleAlert as AlertTriangle, Eye, Cloud } from 'lucide-react-native';
import MapView from '@/components/MapView';
import LocationHeader from '@/components/LocationHeader';
import AlertBadge from '@/components/AlertBadge';
import QuickActions from '@/components/QuickActions';
import WeatherSafetyCard from '@/components/WeatherSafetyCard';
import * as Location from 'expo-location';
import { weatherService, type WeatherAlert, type WeatherData } from '@/services/weatherService';

interface DangerZone {
  id: string;
  name: string;
  type: 'crime' | 'natural' | 'restricted';
  latitude: number;
  longitude: number;
  radius: number;
  alertLevel: 'high' | 'medium' | 'low';
}

interface TouristAttraction {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  rating: number;
  safetyLevel: 'safe' | 'caution' | 'danger';
}

const sampleDangerZones: DangerZone[] = [];
const sampleAttractions: TouristAttraction[] = [];

export default function HomeScreen() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Loading location...'
  });
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherAlert, setWeatherAlert] = useState<WeatherAlert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation();
    loadWeatherData();
  }, []);

  useEffect(() => {
    if (currentLocation.latitude && currentLocation.longitude) {
      loadWeatherData();
    }
  }, [currentLocation.latitude, currentLocation.longitude]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentLocation(prev => ({
          ...prev,
          address: 'Permission denied'
        }));
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const latitude = loc.coords.latitude;
      const longitude = loc.coords.longitude;
      // Reverse geocoding to get address
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      const address = data.city && data.principalSubdivision && data.countryName
        ? `${data.city}, ${data.principalSubdivision}, ${data.countryName}`
        : data.locality && data.principalSubdivision && data.countryName
        ? `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`
        : data.countryName
        ? data.countryName
        : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      setCurrentLocation({
        latitude,
        longitude,
        address
      });
    } catch (error) {
      console.error('Error getting location:', error);
      setCurrentLocation(prev => ({
        ...prev,
        address: prev && typeof prev.latitude === 'number' && typeof prev.longitude === 'number'
          ? `${prev.latitude.toFixed(4)}, ${prev.longitude.toFixed(4)}`
          : 'Location unavailable'
      }));
    }
  };

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      
      // Get current weather
      const currentWeather = await weatherService.getCurrentWeather(
        currentLocation.latitude,
        currentLocation.longitude
      );
      
      if (currentWeather) {
        setWeatherData(currentWeather);
        
        // Get historical weather for comparison
        const historicalWeather = await weatherService.getHistoricalWeather(
          currentLocation.latitude,
          currentLocation.longitude,
          7 // Last 7 days
        );
        
        const historicalAvg = historicalWeather ? 
          weatherService.calculateHistoricalAverage(historicalWeather) : undefined;
        
        // Generate weather alert
        const alert = weatherService.generateWeatherAlert(
          currentWeather.current.temp_c,
          historicalAvg
        );
        
        setWeatherAlert(alert);
        
        // Update active alerts count based on weather severity
        if (alert.severity === 'extreme' || alert.severity === 'high') {
          setActiveAlerts(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error loading weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = (location: any) => {
    setCurrentLocation(location);
    checkGeofencing(location);
  };

  const checkGeofencing = (location: any) => {
    // Geofencing logic removed since we don't have real danger zones
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LocationHeader 
        location={currentLocation.address}
        onLocationPress={getCurrentLocation}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.alertsContainer}>
          <AlertBadge count={activeAlerts} type="warning" />
          <View style={styles.weatherContainer}>
            <Cloud size={20} color="#4F46E5" />
            <Text style={styles.weatherText}>
              {weatherData ? `${weatherData.current.temp_c}°C • ${weatherData.current.condition.text}` : 'Loading...'}
            </Text>
          </View>
        </View>

        {/* Weather Safety Alert */}
        {weatherAlert && (
          <View style={styles.weatherSafetyContainer}>
            <WeatherSafetyCard 
              weatherAlert={weatherAlert}
              onPress={() => {
                Alert.alert(
                  'Weather Details',
                  `Current: ${weatherData?.current.temp_c}°C\nFeels like: ${weatherData?.current.feelslike_c}°C\nHumidity: ${weatherData?.current.humidity}%\nWind: ${weatherData?.current.wind_kph} km/h`,
                  [{ text: 'OK' }]
                );
              }}
            />
          </View>
        )}

        <View style={styles.mapContainer}>
          <MapView 
            currentLocation={currentLocation}
            dangerZones={sampleDangerZones}
            attractions={sampleAttractions}
            onLocationUpdate={handleLocationUpdate}
          />
        </View>

        <QuickActions />

        <View style={styles.recentAlertsContainer}>
          <Text style={styles.sectionTitle}>Recent Safety Alerts</Text>
          <View style={styles.alertItem}>
            <AlertTriangle size={20} color="#EF4444" />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>Traffic disruption at Connaught Place</Text>
              <Text style={styles.alertTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.alertItem}>
            <AlertTriangle size={20} color="#F59E0B" />
            <View style={styles.alertContent}>
              <Text style={styles.alertText}>Monsoon flood warning for riverside areas</Text>
              <Text style={styles.alertTime}>5 hours ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  alertsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  weatherText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 4,
  },
  weatherSafetyContainer: {
    paddingHorizontal: 20,
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  recentAlertsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 20,
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});