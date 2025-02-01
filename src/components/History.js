import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import QRService from '../services/qrService';

const History = () => {
  const [scans, setScans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadScans = async () => {
    try {
      setError(null);
      const recentScans = await QRService.getRecentScans(20);
      setScans(recentScans);
    } catch (err) {
      setError('Failed to load scan history');
      console.error('Error loading scans:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScans();
    setRefreshing(false);
  };

  useEffect(() => {
    loadScans();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.scanItem}>
      <View style={styles.scanContent}>
        <Text style={styles.scanData}>{item.uid}</Text>
        <Text style={styles.scanTime}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      </View>
      <View style={[
        styles.statusBadge,
        item.isValid ? styles.successBadge : styles.failedBadge
      ]}>
        <Text style={styles.statusText}>
          {item.isValid ? 'Success' : 'Failed'}
        </Text>
      </View>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={scans}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centerContainer}>
            <Text>No scans yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10
  },
  scanItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2
  },
  scanContent: {
    flex: 1
  },
  scanData: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4
  },
  scanTime: {
    fontSize: 12,
    color: '#666'
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: 10
  },
  successBadge: {
    backgroundColor: '#e6f4ea',
  },
  failedBadge: {
    backgroundColor: '#fce8e6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16
  }
});

export default History;
