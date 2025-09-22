import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MapPin, Users, Shield, CircleAlert as AlertCircle, Clock, Zap } from 'lucide-react-native';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  type: 'police' | 'medical' | 'fire' | 'tourism' | 'personal';
  available247: boolean;
}

const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Police Emergency',
    number: '100',
    type: 'police',
    available247: true
  },
  {
    id: '2',
    name: 'Medical Emergency',
    number: '108',
    type: 'medical',
    available247: true
  },
  {
    id: '3',
    name: 'Fire Department',
    number: '101',
    type: 'fire',
    available247: true
  },
  {
    id: '4',
    name: 'Tourist Helpline',
    number: '1363',
    type: 'tourism',
    available247: true
  }
];

export default function EmergencyScreen() {
  const [panicMode, setPanicMode] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    'Mom - +91 98765 43210',
    'Dad - +91 98765 43211'
  ]);

  const handlePanicButton = () => {
    Alert.alert(
      'Emergency Alert',
      'This will immediately notify emergency services and your emergency contacts with your location. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'ACTIVATE', 
          style: 'destructive',
          onPress: () => {
            setPanicMode(true);
            // Simulate panic mode activation
            Alert.alert(
              'Emergency Activated!',
              'Emergency services and contacts have been notified. Help is on the way.',
              [{ text: 'OK' }]
            );
            setTimeout(() => setPanicMode(false), 10000);
          }
        }
      ]
    );
  };

  const handleEmergencyCall = (contact: EmergencyContact) => {
    Alert.alert(
      'Emergency Call',
      `Call ${contact.name} (${contact.number})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => Linking.openURL(`tel:${contact.number}`)
        }
      ]
    );
  };

  const shareLocation = () => {
    setLocationSharing(!locationSharing);
    Alert.alert(
      locationSharing ? 'Location Sharing Stopped' : 'Location Sharing Started',
      locationSharing 
        ? 'Your location is no longer being shared with emergency contacts.'
        : 'Your live location is now being shared with your emergency contacts.',
      [{ text: 'OK' }]
    );
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'police':
        return <Shield size={20} color="#3B82F6" />;
      case 'medical':
        return <AlertCircle size={20} color="#EF4444" />;
      case 'fire':
        return <Zap size={20} color="#F59E0B" />;
      case 'tourism':
        return <MapPin size={20} color="#10B981" />;
      default:
        return <Phone size={20} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Center</Text>
        <Text style={styles.headerSubtitle}>Quick access to emergency services</Text>
      </View>

      {/* Panic Button */}
      <View style={styles.panicSection}>
        <TouchableOpacity
          style={[styles.panicButton, panicMode && styles.panicButtonActive]}
          onPress={handlePanicButton}
          disabled={panicMode}
        >
          <View style={styles.panicButtonInner}>
            <AlertCircle size={40} color="#FFFFFF" />
            <Text style={styles.panicButtonText}>
              {panicMode ? 'EMERGENCY ACTIVE' : 'SOS PANIC'}
            </Text>
            <Text style={styles.panicButtonSubtext}>
              {panicMode ? 'Help is coming...' : 'Tap to alert authorities'}
            </Text>
          </View>
        </TouchableOpacity>
        {panicMode && (
          <View style={styles.panicStatus}>
            <Clock size={16} color="#EF4444" />
            <Text style={styles.panicStatusText}>Emergency services notified</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton} onPress={shareLocation}>
            <MapPin size={24} color={locationSharing ? "#10B981" : "#6B7280"} />
            <Text style={[styles.actionText, locationSharing && { color: '#10B981' }]}>
              {locationSharing ? 'Stop Sharing' : 'Share Location'}
            </Text>
            <Text style={styles.actionSubtext}>
              {locationSharing ? 'Active' : 'With contacts'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Users size={24} color="#4F46E5" />
            <Text style={styles.actionText}>Find Help</Text>
            <Text style={styles.actionSubtext}>Nearby assistance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Shield size={24} color="#F59E0B" />
            <Text style={styles.actionText}>Safe Mode</Text>
            <Text style={styles.actionSubtext}>Enhanced tracking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={24} color="#EF4444" />
            <Text style={styles.actionText}>Add Contact</Text>
            <Text style={styles.actionSubtext}>Emergency contact</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.contactsSection}>
        <Text style={styles.sectionTitle}>Emergency Services</Text>
        {emergencyContacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactCard}
            onPress={() => handleEmergencyCall(contact)}
          >
            <View style={styles.contactIcon}>
              {getContactIcon(contact.type)}
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <View style={styles.contactDetails}>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                {contact.available247 && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>24/7</Text>
                  </View>
                )}
              </View>
            </View>
            <Phone size={20} color="#4F46E5" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Personal Emergency Contacts */}
      <View style={styles.personalContactsSection}>
        <Text style={styles.sectionTitle}>Personal Contacts</Text>
        {emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.personalContactCard}>
            <Users size={16} color="#6B7280" />
            <Text style={styles.personalContactText}>{contact}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addContactButton}>
          <Text style={styles.addContactText}>+ Add Emergency Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Safety Instructions */}
      <View style={styles.instructionsSection}>
        <Text style={styles.sectionTitle}>Emergency Instructions</Text>
        <View style={styles.instructionCard}>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Stay calm and assess the situation</Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Use panic button if in immediate danger</Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Call appropriate emergency service</Text>
          </View>
          <View style={styles.instructionStep}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>Share your location with contacts</Text>
          </View>
        </View>
      </View>
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
  panicSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  panicButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  panicButtonActive: {
    backgroundColor: '#DC2626',
    transform: [{ scale: 1.05 }],
  },
  panicButtonInner: {
    alignItems: 'center',
  },
  panicButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  panicButtonSubtext: {
    fontSize: 12,
    color: '#FEE2E2',
    marginTop: 4,
    textAlign: 'center',
  },
  panicStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
  },
  panicStatusText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 6,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
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
    padding: 16,
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
  actionSubtext: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  contactsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  contactDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  availableBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  availableText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  personalContactsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  personalContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
  },
  personalContactText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
  },
  addContactButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  addContactText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  instructionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
  },
});