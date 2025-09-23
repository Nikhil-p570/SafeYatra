import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, TriangleAlert as AlertTriangle, TrendingUp, MapPin, Route, Bell } from 'lucide-react-native';
import * as Location from 'expo-location';

interface SafetyMetric {
  id: string;
  title: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface SafetyAlert {
  id: string;
  type: 'crime' | 'natural' | 'traffic' | 'health';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
  location: string;
}

const safetyMetrics: SafetyMetric[] = [
  {
    id: '1',
    title: 'Area Safety Score',
    value: '7.2/10',
    trend: 'up',
    color: '#10B981'
  },
  {
    id: '2',
    title: 'Crime Incidents',
    value: '12 this week',
    trend: 'down',
    color: '#F59E0B'
  },
  {
    id: '3',
    title: 'Weather Risk',
    value: 'Moderate',
    trend: 'stable',
    color: '#6366F1'
  }
];

const recentAlerts: SafetyAlert[] = [
  {
    id: '1',
    type: 'crime',
    title: 'Pickpocketing Alert',
    description: 'Increased pickpocketing reported near tourist areas',
    severity: 'medium',
    time: '2 hours ago',
    location: 'Chandni Chowk'
  },
  {
    id: '2',
    type: 'natural',
    title: 'Heavy Rain Warning',
    description: 'Heavy rainfall expected, possible waterlogging',
    severity: 'high',
    time: '4 hours ago',
    location: 'Delhi NCR'
  },
  {
    id: '3',
    type: 'traffic',
    title: 'Road Closure',
    description: 'Major road closed due to construction work',
    severity: 'low',
    time: '6 hours ago',
    location: 'CP Metro Station'
  }
];

export default function DashboardScreen() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'crime':
        return <Shield size={20} color="#EF4444" />;
      case 'natural':
        return <AlertTriangle size={20} color="#F59E0B" />;
      case 'traffic':
        return <Route size={20} color="#6366F1" />;
      default:
        return <Bell size={20} color="#6B7280" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const showSafeRoutes = () => {
    Alert.alert(
      'Safe Routes',
      'Generating safe routes avoiding high-risk areas...',
      [{ text: 'OK' }]
    );
  }

  const shareLocation = async () => {
    try {
      // Ask for permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to share your location.');
        return;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Create a Google Maps link
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Share via system share sheet
      await Share.share({
        message: `Here’s my current location: ${locationUrl}`,
      });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to fetch or share location.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Dashboard</Text>
        <Text style={styles.headerSubtitle}>Your area safety overview</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Time Filter */}
        <View style={styles.filterContainer}>
          {['today', 'week', 'month'].map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.filterButton,
                selectedTimeframe === timeframe && styles.filterButtonActive
              ]}
              onPress={() => setSelectedTimeframe(timeframe as 'today' | 'week' | 'month')}
            >
              <Text style={[
                styles.filterText,
                selectedTimeframe === timeframe && styles.filterTextActive
              ]}>
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Safety Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Safety Metrics</Text>
          {safetyMetrics.map((metric) => (
            <View key={metric.id} style={styles.metricCard}>
              <View style={styles.metricContent}>
                <Text style={styles.metricTitle}>{metric.title}</Text>
                <Text style={[styles.metricValue, { color: metric.color }]}>
                  {metric.value}
                </Text>
              </View>
              <View style={styles.metricTrend}>
                <TrendingUp 
                  size={16} 
                  color={metric.trend === 'up' ? '#10B981' : '#EF4444'} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton} onPress={showSafeRoutes}>
              <Route size={24} color="#4F46E5" />
              <Text style={styles.actionText}>Safe Routes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareLocation}>
              <MapPin size={24} color="#10B981" />
              <Text style={styles.actionText}>Share Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Bell size={24} color="#F59E0B" />
              <Text style={styles.actionText}>Alert Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Shield size={24} color="#EF4444" />
              <Text style={styles.actionText}>Emergency</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.alertsContainer}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {recentAlerts.map((alert) => (
            <TouchableOpacity key={alert.id} style={styles.alertCard}>
              <View style={styles.alertIcon}>
                {getAlertIcon(alert.type)}
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <View style={[
                    styles.severityBadge,
                    { backgroundColor: getSeverityColor(alert.severity) + '20' }
                  ]}>
                    <Text style={[
                      styles.severityText,
                      { color: getSeverityColor(alert.severity) }
                    ]}>
                      {alert.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <View style={styles.alertFooter}>
                  <View style={styles.alertLocation}>
                    <MapPin size={12} color="#6B7280" />
                    <Text style={styles.alertLocationText}>{alert.location}</Text>
                  </View>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

                {/* Safety Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Stay Alert in Crowded Areas</Text>
            <Text style={styles.tipText}>
              Keep your belongings secure and be aware of your surroundings, especially in tourist hotspots.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Weather Precautions</Text>
            <Text style={styles.tipText}>
              Check weather forecasts regularly and avoid travel during severe weather conditions.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Emergency Contacts</Text>
            <Text style={styles.tipText}>
              Save local emergency numbers and share your live location with trusted contacts when traveling.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Safe Travel</Text>
            <Text style={styles.tipText}>
              Prefer well-lit, busy routes at night and avoid isolated shortcuts whenever possible.
            </Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  metricsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  metricCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricTrend: {
    justifyContent: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  alertsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  alertIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  alertDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});