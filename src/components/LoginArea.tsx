import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

const { width, height } = Dimensions.get('window');

interface LoginAreaProps {
  navigation?: any;
  onLogin?: (email: string, password: string, category: string) => void;
}

// Simple user database simulation
const userDatabase: Array<{id: string, username: string, password: string, fullName: string}> = [];

export const LoginArea: React.FC<LoginAreaProps> = ({ navigation, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showDetailedValidation, setShowDetailedValidation] = useState(false);

  const categories = [
    { name: 'Academic', color: '#1E3A8A' },
    { name: 'Resource', color: '#FDE047' },
    { name: 'Management', color: '#4B5563' },
  ];

  // Validation functions
  const validateUsername = (username: string) => {
    return /^[a-zA-Z0-9]+$/.test(username);
  };

  const validatePassword = (password: string) => {
    const validations = {
      minLength: password.length >= 8,
      hasLowerCase: /[a-z]/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasNumbers: /[0-9]/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasThreeTypes: false
    };
    
    const requirements = [
      validations.hasLowerCase,
      validations.hasUpperCase,
      validations.hasNumbers,
      validations.hasSpecialChars
    ];
    
    const metRequirements = requirements.filter(Boolean).length;
    validations.hasThreeTypes = metRequirements >= 3;
    
    return validations;
  };

  const passwordValidation = validatePassword(password);
  const isUsernameValid = validateUsername(username);
  const isPasswordValid = passwordValidation.minLength && passwordValidation.hasThreeTypes;
  const isConfirmPasswordValid = password === confirmPassword && confirmPassword.length > 0;

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // Check user in database
    const user = userDatabase.find(u => u.username === username && u.password === password);
    
    setTimeout(() => {
      setIsLoading(false);
      if (user) {
        Alert.alert('Success', `Welcome back, ${user.fullName}!`);
        if (onLogin) {
          onLogin(username, password, 'Academic');
        } else if (navigation) {
          navigation.navigate('Home');
        }
      } else {
        Alert.alert('Error', 'Invalid username or password');
      }
    }, 1000);
  };

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isUsernameValid) {
      Alert.alert('Error', 'Username must only contain alphanumeric values!');
      return;
    }

    if (!isPasswordValid) {
      Alert.alert('Error', 'Password does not meet requirements');
      return;
    }

    if (!isConfirmPasswordValid) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Check if username already exists
    if (userDatabase.find(u => u.username === username)) {
      Alert.alert('Error', 'Username already exists');
      return;
    }
    
    setIsLoading(true);
    
    // Add user to database
    setTimeout(() => {
      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        fullName: username // Use username as display name
      };
      userDatabase.push(newUser);
      
      setIsLoading(false);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => {
          setIsRegistering(false);
          setUsername('');
          setPassword('');
          setConfirmPassword('');
        }}
      ]);
    }, 1000);
  };

  const toggleToRegister = () => {
    setIsRegistering(true);
    setUsername('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#7DD3FC" translucent={false} />
      <LinearGradient
        colors={['#7DD3FC', '#93C5FD', '#A5B4FC']}
        style={styles.gradient}
      >
        {/* Category Design Elements - Text Only */}
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <View
              key={category.name}
              style={[
                styles.categoryButton,
                { backgroundColor: category.color }
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: category.name === 'Resource' ? '#000' : '#FFF' }
                ]}
              >
                {category.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Login/Register Card */}
        <View style={[styles.loginCard, isRegistering && styles.loginCardExpanded]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, isRegistering && username && !isUsernameValid && styles.inputError]}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (isRegistering) setShowValidation(true);
              }}
              autoCapitalize="none"
            />
            <View style={[styles.inputUnderline, isRegistering && username && !isUsernameValid && styles.underlineError]} />
            
            {isRegistering && username && !isUsernameValid && (
              <View style={styles.validationMessage}>
                <Ionicons name="warning" size={16} color="#DC2626" style={styles.errorIcon} />
                <Text style={styles.validationText}>Your username must only contain alphanumeric values!</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.input, isRegistering && password && !isPasswordValid && styles.inputError]}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (isRegistering) setShowValidation(true);
                }}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye" : "eye-off"} 
                  size={20} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.inputUnderline, isRegistering && password && !isPasswordValid && styles.underlineError]} />
            
            {isRegistering && password && showValidation && (
              <View style={[styles.passwordValidationCompact, showDetailedValidation && styles.validationExpanded]}>
                {/* Compact Progress Indicators */}
                <View style={styles.validationProgress}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.validationTitleCompact}>Password Strength:</Text>
                    <TouchableOpacity 
                      onPress={() => setShowDetailedValidation(!showDetailedValidation)}
                      style={styles.toggleButton}
                    >
                      <Text style={styles.toggleText}>
                        {showDetailedValidation ? 'Hide' : 'Show'} Details
                      </Text>
                      <Ionicons 
                        name={showDetailedValidation ? "chevron-up" : "chevron-down"} 
                        size={14} 
                        color="#6B7280" 
                      />
                    </TouchableOpacity>
                  </View>
                  
                  {/* Visual Progress Bar */}
                  <View style={styles.strengthMeter}>
                    <View style={styles.strengthBarContainer}>
                      <View 
                        style={[
                          styles.strengthBar,
                          {
                            width: `${((passwordValidation.minLength ? 1 : 0) + 
                                     (passwordValidation.hasThreeTypes ? 1 : 0)) * 50}%`,
                            backgroundColor: isPasswordValid ? '#10B981' : 
                                           passwordValidation.minLength ? '#F59E0B' : '#EF4444'
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.strengthText}>
                      {isPasswordValid ? 'Strong' : 
                       passwordValidation.minLength ? 'Medium' : 'Weak'}
                    </Text>
                  </View>

                  {/* Quick Status Icons */}
                  <View style={styles.quickStatus}>
                    <View style={styles.statusItem}>
                      <Ionicons 
                        name={passwordValidation.minLength ? "checkmark-circle" : "close-circle"} 
                        size={16} 
                        color={passwordValidation.minLength ? "#10B981" : "#EF4444"} 
                      />
                      <Text style={styles.statusText}>8+ chars</Text>
                    </View>
                    <View style={styles.statusItem}>
                      <Ionicons 
                        name={passwordValidation.hasThreeTypes ? "checkmark-circle" : "close-circle"} 
                        size={16} 
                        color={passwordValidation.hasThreeTypes ? "#10B981" : "#EF4444"} 
                      />
                      <Text style={styles.statusText}>3+ types</Text>
                    </View>
                  </View>
                </View>

                {/* Detailed Requirements (Collapsible) */}
                <View style={[styles.detailedValidation, !showDetailedValidation && styles.detailedValidationHidden]}>
                  {showDetailedValidation && (
                    <>
                      <Text style={styles.detailedTitle}>Requirements:</Text>
                    
                    <View style={styles.compactValidationItem}>
                      <Ionicons 
                        name={passwordValidation.minLength ? "checkmark" : "close"} 
                        size={14} 
                        color={passwordValidation.minLength ? "#10B981" : "#EF4444"} 
                      />
                      <Text style={[styles.compactValidationText, passwordValidation.minLength && styles.validTextGreen]}>
                        At least 8 characters
                      </Text>
                    </View>
                    
                    <View style={styles.compactValidationItem}>
                      <Ionicons 
                        name={passwordValidation.hasLowerCase ? "checkmark" : "close"} 
                        size={14} 
                        color={passwordValidation.hasLowerCase ? "#10B981" : "#EF4444"} 
                      />
                      <Text style={[styles.compactValidationText, passwordValidation.hasLowerCase && styles.validTextGreen]}>
                        Lowercase (a-z)
                      </Text>
                    </View>
                    
                    <View style={styles.compactValidationItem}>
                      <Ionicons 
                        name={passwordValidation.hasUpperCase ? "checkmark" : "close"} 
                        size={14} 
                        color={passwordValidation.hasUpperCase ? "#10B981" : "#EF4444"} 
                      />
                      <Text style={[styles.compactValidationText, passwordValidation.hasUpperCase && styles.validTextGreen]}>
                        Uppercase (A-Z)
                      </Text>
                    </View>
                    
                    <View style={styles.compactValidationItem}>
                      <Ionicons 
                        name={passwordValidation.hasNumbers ? "checkmark" : "close"} 
                        size={14} 
                        color={passwordValidation.hasNumbers ? "#10B981" : "#EF4444"} 
                      />
                      <Text style={[styles.compactValidationText, passwordValidation.hasNumbers && styles.validTextGreen]}>
                        Numbers (0-9)
                      </Text>
                    </View>
                    
                    <View style={styles.compactValidationItem}>
                      <Ionicons 
                        name={passwordValidation.hasSpecialChars ? "checkmark" : "close"} 
                        size={14} 
                        color={passwordValidation.hasSpecialChars ? "#10B981" : "#EF4444"} 
                      />
                      <Text style={[styles.compactValidationText, passwordValidation.hasSpecialChars && styles.validTextGreen]}>
                        Special (!@#$%^&*)
                      </Text>
                    </View>
                    </>
                  )}
                </View>
              </View>
            )}
          </View>

          {isRegistering && (
            <View style={styles.inputContainer}>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, confirmPassword && !isConfirmPasswordValid && styles.inputError]}
                  placeholder="Confirm Password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#9CA3AF" 
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.inputUnderline, confirmPassword && !isConfirmPasswordValid && styles.underlineError]} />
              
              {confirmPassword && !isConfirmPasswordValid && (
                <View style={styles.validationMessage}>
                  <Ionicons name="warning" size={16} color="#DC2626" style={styles.errorIcon} />
                  <Text style={styles.validationText}>Passwords do not match!</Text>
                </View>
              )}
            </View>
          )}

          {/* Button Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing in...' : 'Log-In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.disabledButton]} 
              onPress={isRegistering ? handleRegister : toggleToRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isRegistering 
                  ? (isLoading ? 'Creating...' : 'Create Account')
                  : 'Register'
                }
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 20, // Add vertical padding to prevent edge cases
  },
  categoryContainer: {
    marginBottom: 40,
    alignItems: 'center',
    gap: 12,
    position: 'relative', // Ensure stable positioning
    zIndex: 1, // Keep above other elements
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
    fontSize: 14,
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
    minHeight: 400, // Ensure minimum height to prevent shifting
  },
  loginCardExpanded: {
    minHeight: 500, // Extra space when in registration mode
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    flex: 1,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  registerButtonText: {
    color: '#1E3A8A',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A0A0A0',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  // Password input with eye icon
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Validation styles
  inputError: {
    borderColor: '#DC2626',
    borderWidth: 1,
    borderRadius: 4,
  },
  underlineError: {
    backgroundColor: '#DC2626',
    height: 2,
  },
  validationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorIcon: {
    marginRight: 8,
  },
  validationText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    flex: 1,
  },
  // Enhanced Password Validation Styles
  passwordValidationCompact: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden', // Prevent content from affecting layout
  },
  validationExpanded: {
    // Additional styles when expanded if needed
  },
  validationProgress: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  validationTitleCompact: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  toggleText: {
    fontSize: 11,
    color: '#6B7280',
    marginRight: 4,
  },
  strengthMeter: {
    marginBottom: 8,
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'right',
    fontWeight: '500',
  },
  quickStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  detailedValidation: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    maxHeight: 200, // Limit maximum height
    overflow: 'hidden',
  },
  detailedValidationHidden: {
    maxHeight: 0,
    paddingTop: 0,
    borderTopWidth: 0,
    opacity: 0,
  },
  detailedTitle: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 6,
  },
  compactValidationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  compactValidationText: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  validTextGreen: {
    color: '#10B981',
    fontWeight: '500',
  },
  validText: {
    color: '#10B981',
    fontWeight: '500',
  },
});
