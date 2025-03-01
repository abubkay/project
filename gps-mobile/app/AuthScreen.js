import { StyleSheet } from "react-native";
import { useState } from "react";




export default function AuthScreen() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleEmailPasswordSignIn = async () => {
        try {
          await signInWithEmailAndPassword(localAuth, email, password);
        } catch (error) {
          setError(error.message);
        }
      };

    const handleGoogleSignIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
          await signInWithCredential(localAuth, googleCredential);
          navigation.navigate('Map');
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            setError('User cancelled the login flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            setError('Sign in is in progress');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            setError('Play services not available or outdated');
          } else {
            setError(error.message);
          }
        }
      };
    return (
      <View style={styles.container}>
        <Text style={styles.title}>GPS Tracker</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <FontAwesome5 name="google" size={16} color="white" />
          <Text style={styles.buttonText}>Sign In with Google</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f5f5f5'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 30
    },
    input: {
      height: 50,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      backgroundColor: 'white'
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 50,
      borderRadius: 8,
      backgroundColor: '#007AFF',
      marginBottom: 10
    },
    googleButton: {
      backgroundColor: '#DB4437'
    },
    buttonText: {
      color: 'white',
      marginLeft: 10,
      fontWeight: '600'
    }
  });