import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MapPin, Navigation, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface MapViewProps {
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dangerZones: Array<{
    id: string;
    name: string;
    type: 'crime' | 'natural' | 'restricted';
    latitude: number;
    longitude: number;
    radius: number;
    alertLevel: 'high' | 'medium' | 'low';
  }>;
  attractions: Array<{
    id: string;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    rating: number;
    safetyLevel: 'safe' | 'caution' | 'danger';
  }>;
  onLocationUpdate: (location: any) => void;
}

export default function MapView({ currentLocation, dangerZones, attractions, onLocationUpdate }: MapViewProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Mock map implementation since we can't use actual maps in WebContainer
  const mockMapData = {
    zoom: 12,
    center: currentLocation,
  };

  const renderMarker = (item: any, type: 'danger' | 'attraction' | 'current', index: number) => {
    const getMarkerColor = () => {
      if (type === 'current') return '#4F46E5';
      if (type === 'danger') {
        switch (item.alertLevel) {
          case 'high': return '#EF4444';
          case 'medium': return '#F59E0B';
          case 'low': return '#10B981';
          default: return '#6B7280';
        }
      }
      if (type === 'attraction') {
        switch (item.safetyLevel) {
          case 'safe': return '#10B981';
          case 'caution': return '#F59E0B';
          case 'danger': return '#EF4444';
          default: return '#6B7280';
        }
      }
      return '#6B7280';
    };

    const getMarkerIcon = () => {
      if (type === 'current') return <MapPin size={16} color="#FFFFFF" />;
      if (type === 'danger') return <AlertTriangle size={16} color="#FFFFFF" />;
      return <MapPin size={16} color="#FFFFFF" />;
    };

    return (
      <TouchableOpacity
        key={`${type}-${item.id || index}`}
        style={[
          styles.marker,
          {
            backgroundColor: getMarkerColor(),
            left: `${20 + (index * 15) % 60}%`,
            top: `${20 + (index * 20) % 50}%`,
          }
        ]}
        onPress={() => type === 'danger' && setSelectedZone(item.id)}
      >
        {getMarkerIcon()}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Mock Map Background */}
      <View style={styles.mapBackground}>
        <View style={styles.mapGrid} />
        
        {/* Current Location Marker */}
        {renderMarker(currentLocation, 'current', 0)}
        
        {/* Danger Zone Markers */}
        {dangerZones.map((zone, index) => renderMarker(zone, 'danger', index + 1))}
        
        {/* Attraction Markers */}
        {attractions.map((attraction, index) => renderMarker(attraction, 'attraction', index + dangerZones.length + 1))}
        
        {/* Danger Zone Overlays */}
        {dangerZones.map((zone, index) => (
          <View
            key={`overlay-${zone.id}`}
            style={[
              styles.dangerZoneOverlay,
              {
                left: `${15 + (index * 15) % 60}%`,
                top: `${15 + (index * 20) % 50}%`,
                backgroundColor: zone.alertLevel === 'high' ? '#EF444420' : 
                                zone.alertLevel === 'medium' ? '#F59E0B20' : '#10B98120',
                borderColor: zone.alertLevel === 'high' ? '#EF4444' : 
                            zone.alertLevel === 'medium' ? '#F59E0B' : '#10B981',
              }
            ]}
          />
        ))}
      </View>
      
      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Navigation size={20} color="#4F46E5" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <MapPin size={20} color="#4F46E5" />
        </TouchableOpacity>
      </View>
      
      {/* Map Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>High Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Medium Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Safe</Text>
        </View>
      </View>
      
      {/* Current Location Info */}
      <View style={styles.locationInfo}>
        <MapPin size={16} color="#4F46E5" />
        <Text style={styles.locationText}>{currentLocation.address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#E5E7EB',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(45deg, #E5E7EB 25%, transparent 25%), linear-gradient(-45deg, #E5E7EB 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #E5E7EB 75%), linear-gradient(-45deg, transparent 75%, #E5E7EB 75%)',
    backgroundSize: '20px 20px',
    opacity: 0.3,
  },
  marker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dangerZoneOverlay: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    opacity: 0.3,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  legend: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
});