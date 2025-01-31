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
      const recentScans = await QRService.getRecentScans('current-user-id', 20);
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
      <Text style={styles.scanData}>{item.data}</Text>
      <Text style={styles.scanTime}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
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
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scanItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  scanData: {
    fontSize: 16,
    marginBottom: 4,
  },
  scanTime: {
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default History;
