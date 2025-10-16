import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

const { width, height } = Dimensions.get('window');

interface LoginAreaProps {
  navigation?: any;
  onLogin?: (email: string, password: string, category: string) => void;
}

export const LoginArea: React.FC<LoginAreaProps> = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Academic');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { name: 'Academic', color: '#1E3A8A' },
    { name: 'Resource', color: '#FDE047' },
    { name: 'Management', color: '#4B5563' },
  ];

  const handleMicrosoftLogin = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid Microsoft email address');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate Microsoft authentication
    setTimeout(() => {
      setIsLoading(false);
      if (onLogin) {
        // Extract username from email for display
        const username = email.split('@')[0];
        onLogin(username, '', selectedCategory);
      } else if (navigation) {
        navigation.navigate('Home');
      }
    }, 1500); // Simulate loading time
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#7DD3FC', '#93C5FD', '#A5B4FC']}
        style={styles.gradient}
      >
        {/* Category Design Elements */}
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <View
              key={category.name}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: category.color,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: category.name === 'Resource' ? '#000' : '#FFF',
                  },
                ]}
              >
                {category.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          {/* Microsoft Logo/Title */}
          <View style={styles.microsoftHeader}>
            <View style={styles.microsoftLogo}>
              <Text style={styles.microsoftLogoText}>Microsoft</Text>
            </View>
            <Text style={styles.signInText}>Sign in with your Microsoft account</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <View style={styles.inputUnderline} />
          </View>

          <TouchableOpacity 
            style={[styles.microsoftButton, isLoading && styles.disabledButton]} 
            onPress={handleMicrosoftLogin}
            disabled={isLoading}
          >
            <Text style={styles.microsoftButtonText}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Use your Microsoft work or school account
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  categoryContainer: {
    marginBottom: 40,
    gap: 12,
  },
  categoryButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    minWidth: width * 0.7,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 25,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 0,
    color: '#374151',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginTop: 5,
  },
  microsoftHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  microsoftLogo: {
    backgroundColor: '#0078D4',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 15,
  },
  microsoftLogoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signInText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
  microsoftButton: {
    backgroundColor: '#0078D4',
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  microsoftButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});
