import { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, AppState } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { ref, set } from 'firebase/database';
import { database, auth } from './firebase';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_QUEUE_KEY = 'locationQueue';
const MAX_RETRY_INTERVAL = 30000; // 30 seconds
const BASE_INTERVAL = 5000; // 5 seconds

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateInterval, setUpdateInterval] = useState(BASE_INTERVAL);
  const [isOnline, setIsOnline] = useState(true);

  // 1. Battery Optimization: Handle app state changes
  const handleAppStateChange = useCallback((nextAppState) => {
    if (nextAppState === 'background') {
      setUpdateInterval(30000); // 30 seconds when in background
    } else {
      setUpdateInterval(BASE_INTERVAL); // Reset to base interval when active
    }
  }, []);

  // 2. Network Resilience: Handle connectivity changes
  const checkConnectivity = useCallback(async () => {
    const state = await NetInfo.fetch();
    setIsOnline(state.isConnected);
    
    if (state.isConnected) {
      // Process queued locations when coming online
      const queuedLocations = await AsyncStorage.getItem(LOCATION_QUEUE_KEY);
      if (queuedLocations) {
        processQueue(JSON.parse(queuedLocations));
      }
    }
  }, []);

  // 3. Location Update Throttling with exponential backoff
  const updateLocation = useCallback(async (loc) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('Not authenticated');

      if (!isOnline) {
        // Queue location for later sync
        const queued = await AsyncStorage.getItem(LOCATION_QUEUE_KEY);
        const queue = queued ? JSON.parse(queued) : [];
        queue.push({ ...loc.coords, timestamp: Date.now() });
        await AsyncStorage.setItem(LOCATION_QUEUE_KEY, JSON.stringify(queue));
        return;
      }

      const locationRef = ref(database, `users/${userId}/location`);
      await set(locationRef, {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        timestamp: Date.now()
      });
      setLocation(loc.coords);
      setUpdateInterval(BASE_INTERVAL); // Reset to base interval on success
    } catch (err) {
      console.error('Location update failed:', err);
      setUpdateInterval(prev => Math.min(prev * 2, MAX_RETRY_INTERVAL));
    }
  }, [isOnline]);

  const processQueue = useCallback(async (queue) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      for (const loc of queue) {
        const locationRef = ref(database, `users/${userId}/location`);
        await set(locationRef, {
          latitude: loc.latitude,
          longitude: loc.longitude,
          timestamp: loc.timestamp
        });
      }
      await AsyncStorage.removeItem(LOCATION_QUEUE_KEY);
    } catch (err) {
      console.error('Queue processing failed:', err);
    }
  }, []);

  useEffect(() => {
    // Setup app state listener for battery optimization
    const appStateSubscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    // Setup network listener for resilience
    const netInfoSubscription = NetInfo.addEventListener(checkConnectivity);

    let watchId;
    const initLocationTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        // Start watching location with dynamic interval
        watchId = await Location.watchPositionAsync(
          {
            distanceInterval: 10,
            timeInterval: updateInterval,
          },
          updateLocation
        );

        // Initial location check
        const initialLoc = await Location.getCurrentPositionAsync({});
        setLocation(initialLoc.coords);
      } catch (err) {
        setError('Error initializing location tracking');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initLocationTracking();

    // Cleanup function
    return () => {
      appStateSubscription.remove();
      netInfoSubscription();
      if (watchId) watchId.remove();
    };
  }, [updateInterval, handleAppStateChange, checkConnectivity, updateLocation]);

  // ... rest of the component (loading/error states and map rendering)
}