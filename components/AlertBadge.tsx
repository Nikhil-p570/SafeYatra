import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, Shield, Info } from 'lucide-react-native';

interface AlertBadgeProps {
  count: number;
  type: 'warning' | 'danger' | 'info';
  onPress?: () => void;
}

export default function AlertBadge({ count, type, onPress }: AlertBadgeProps) {
  const getAlertStyle = () => {
    switch (type) {
      case 'danger':
        return {
          backgroundColor: '#FEE2E2',
          borderColor: '#FECACA',
          color: '#DC2626'
        };
      case 'warning':
        return {
          backgroundColor: '#FEF3C7',
          borderColor: '#FDE68A',
          color: '#D97706'
        };
      case 'info':
        return {
          backgroundColor: '#DBEAFE',
          borderColor: '#BFDBFE',
          color: '#2563EB'
        };
      default:
        return {
          backgroundColor: '#F3F4F6',
          borderColor: '#E5E7EB',
          color: '#6B7280'
        };
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={16} color={getAlertStyle().color} />;
      case 'warning':
        return <Shield size={16} color={getAlertStyle().color} />;
      case 'info':
        return <Info size={16} color={getAlertStyle().color} />;
      default:
        return <Info size={16} color={getAlertStyle().color} />;
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: alertStyle.backgroundColor, borderColor: alertStyle.borderColor }]}
      onPress={onPress}
    >
      {getIcon()}
      <Text style={[styles.count, { color: alertStyle.color }]}>
        {count} Alert{count !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  count: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});