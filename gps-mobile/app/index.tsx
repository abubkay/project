import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { signInWithEmailAndPassword, GoogleAuthProvider, User, signInWithCredential } from 'firebase/auth';
import { app } from './firebase';
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import auth from '@react-native-firebase/auth';

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';


// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: '252591472515-mekbpmt3irtoq7cin850m01vosdat2hc.apps.googleusercontent.com', // Replace with your web client ID from Firebase console
});


const localAuth = initializeAuth(app, {
  // persistence: getReactNativePersistence(AsyncStorage)
});

type AuthScreenProps = {
  navigation: NavigationProp<any>;
};

function AuthScreen({ navigation }: AuthScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailPasswordSignIn = async () => {
    try {
      await signInWithEmailAndPassword(localAuth, email, password);
    } catch (error) {
      setError((error as any).message);
    }
  };

  // Remove Google popup sign-in for mobile compatibility
  const handleGoogleSignIn = async () => {
    setError('Google sign-in needs mobile implementation');
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Sign In" onPress={handleEmailPasswordSignIn} />
      <Button
        title="Sign In with Google"
        onPress={handleGoogleSignIn}
        color="#841584"
      />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
    </View>
  );
}

function MapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Map Screen</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = localAuth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Screen name="Map" component={MapScreen} />
        )}
      </Stack.Navigator>
    // </NavigationContainer>
  );
}