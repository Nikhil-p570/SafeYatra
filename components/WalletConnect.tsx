import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Wallet, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Zap } from 'lucide-react-native';
import { walletService, type WalletConnection } from '@/services/walletService';

interface WalletConnectProps {
  onConnectionChange?: (connected: boolean, address?: string) => void;
}

export default function WalletConnect({ onConnectionChange }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState<string>('');
  const [authToken, setAuthToken] = useState<string>('');

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const hasWallet = await walletService.detectWallet();
      if (!hasWallet) {
        return;
      }

      const currentAddress = walletService.getCurrentAddress();
      if (currentAddress) {
        setWalletAddress(currentAddress);
        setIsConnected(true);
        onConnectionChange?.(true, currentAddress);
        await loadBalance();
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);

      const hasWallet = await walletService.detectWallet();
      if (!hasWallet) {
        Alert.alert(
          'Wallet Not Found',
          'Please install MetaMask or another Web3 wallet to continue.',
          [{ text: 'OK' }]
        );
        return;
      }

      const connection: WalletConnection = await walletService.connectWallet();
      
      // Authenticate with backend
      const authResponse = await walletService.authenticateWithBackend(connection.address);
      
      if (authResponse.success) {
        setWalletAddress(connection.address);
        setIsConnected(true);
        setAuthToken(authResponse.token || '');
        onConnectionChange?.(true, connection.address);
        
        await loadBalance();
        
        Alert.alert(
          'Wallet Connected!',
          `Successfully connected to ${walletService.formatAddress(connection.address)}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(authResponse.message || 'Authentication failed');
      }

    } catch (error: any) {
      console.error('Wallet connection error:', error);
      Alert.alert(
        'Connection Failed',
        error.message || 'Failed to connect wallet. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await walletService.disconnectWallet();
      setIsConnected(false);
      setWalletAddress('');
      setBalance('');
      setAuthToken('');
      onConnectionChange?.(false);
      
      Alert.alert(
        'Wallet Disconnected',
        'Your wallet has been disconnected successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const loadBalance = async () => {
    try {
      const walletBalance = await walletService.getBalance();
      setBalance(parseFloat(walletBalance).toFixed(4));
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance('0.0000');
    }
  };

  if (isConnected) {
    return (
      <View style={styles.connectedContainer}>
        <View style={styles.connectedHeader}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.connectedTitle}>Wallet Connected</Text>
        </View>
        
        <View style={styles.walletInfo}>
          <Text style={styles.addressLabel}>Address:</Text>
          <Text style={styles.addressText}>
            {walletService.formatAddress(walletAddress)}
          </Text>
        </View>
        
        <View style={styles.balanceInfo}>
          <Zap size={16} color="#F59E0B" />
          <Text style={styles.balanceText}>{balance} ETH</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.disconnectButton}
          onPress={disconnectWallet}
        >
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Wallet size={24} color="#4F46E5" />
        <Text style={styles.title}>Connect Your Wallet</Text>
      </View>
      
      <Text style={styles.description}>
        Connect your Web3 wallet to access blockchain features and secure authentication.
      </Text>
      
      <TouchableOpacity 
        style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
        onPress={connectWallet}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Wallet size={20} color="#FFFFFF" />
        )}
        <Text style={styles.connectButtonText}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.supportedWallets}>
        <Text style={styles.supportedTitle}>Supported Wallets:</Text>
        <Text style={styles.supportedText}>MetaMask, WalletConnect, Coinbase Wallet</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  connectButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  supportedWallets: {
    alignItems: 'center',
  },
  supportedTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  supportedText: {
    fontSize: 12,
    color: '#6B7280',
  },
  connectedContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  connectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 8,
  },
  walletInfo: {
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D97706',
    marginLeft: 6,
  },
  disconnectButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});