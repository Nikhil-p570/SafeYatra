import { View, Text, StyleSheet } from 'react-native';

export default function Detection() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👁️ Detection Screen</Text>
      <Text style={styles.subText}>This is a placeholder for detection features.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
