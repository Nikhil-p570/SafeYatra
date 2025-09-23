import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Thermometer, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Snowflake, Sun } from 'lucide-react-native';
import type { WeatherAlert } from '@/services/weatherService';

interface WeatherSafetyCardProps {
  weatherAlert: WeatherAlert;
  onPress?: () => void;
}

export default function WeatherSafetyCard({ weatherAlert, onPress }: WeatherSafetyCardProps) {
  const getWeatherIcon = () => {
    switch (weatherAlert.type) {
      case 'extreme_hot':
      case 'hot':
        return <Sun size={24} color={weatherAlert.color} />;
      case 'extreme_cold':
      case 'cold':
        return <Snowflake size={24} color={weatherAlert.color} />;
      case 'normal':
        return <CheckCircle size={24} color={weatherAlert.color} />;
      default:
        return <Thermometer size={24} color={weatherAlert.color} />;
    }
  };

  const getBackgroundColor = () => {
    switch (weatherAlert.severity) {
      case 'extreme':
        return weatherAlert.type.includes('hot') ? '#FEE2E2' : '#DBEAFE';
      case 'high':
        return weatherAlert.type.includes('hot') ? '#FEF3C7' : '#E0F2FE';
      case 'medium':
        return '#FEF3C7';
      case 'low':
        return '#D1FAE5';
      default:
        return '#F3F4F6';
    }
  };

  const getBorderColor = () => {
    switch (weatherAlert.severity) {
      case 'extreme':
        return weatherAlert.color;
      case 'high':
        return weatherAlert.color;
      default:
        return '#E5E7EB';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: weatherAlert.severity === 'extreme' ? 2 : 1
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getWeatherIcon()}
        </View>
        <View style={styles.alertInfo}>
          <Text style={[styles.alertTitle, { color: weatherAlert.color }]}>
            {weatherAlert.message}
          </Text>
          {weatherAlert.severity === 'extreme' && (
            <View style={styles.severityBadge}>
              <AlertTriangle size={12} color="#FFFFFF" />
              <Text style={styles.severityText}>EXTREME</Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.recommendation}>
        {weatherAlert.recommendation}
      </Text>
      
      {weatherAlert.severity !== 'low' && (
        <View style={styles.warningFooter}>
          <AlertTriangle size={16} color={weatherAlert.color} />
          <Text style={[styles.warningText, { color: weatherAlert.color }]}>
            Safety Alert Active
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  recommendation: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  warningFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  warningText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});