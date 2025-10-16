import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

interface NotificationItem {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  time?: string;
}

interface NotificationModuleProps extends NativeStackScreenProps<RootStackParamList, 'Notification'> {
  onBack?: () => void;
  onHomePress?: () => void;
  onSchedulePress?: () => void;
  onProfilePress?: () => void;
  showApprovedMessage?: boolean;
  showSubmittedMessage?: boolean;
}

export const NotificationModule: React.FC<NotificationModuleProps> = ({
  navigation,
  onBack,
  onHomePress,
  onSchedulePress,
  onProfilePress,
  showApprovedMessage = false,
  showSubmittedMessage = false,
}) => {
  
  // Back button handler
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  // Navigation handlers
  const handleHomePress = () => {
    if (onHomePress) {
      onHomePress();
    } else {
      navigation.navigate('Home');
    }
  };

  const handleSchedulePress = () => {
    if (onSchedulePress) {
      onSchedulePress();
    } else {
      navigation.navigate('Schedule');
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };
  const [showApproved, setShowApproved] = useState(showApprovedMessage);
  const [showSubmitted, setShowSubmitted] = useState(showSubmittedMessage);

  useEffect(() => {
    if (showApproved) {
      const timer = setTimeout(() => {
        setShowApproved(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showApproved]);

  useEffect(() => {
    if (showSubmitted) {
      const timer = setTimeout(() => {
        setShowSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSubmitted]);

  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'success',
      title: 'Classroom Reservation Approved!',
      message: 'Classroom reservation successful!\nYou\'ve successfully reserved Room 202 on February 26 at\n9:00AM-10:00AM',
      time: '2 hours ago',
    },
    {
      id: '2',
      type: 'info',
      title: 'Schedule Update',
      message: 'Your Mobile Systems & Technologies class has been moved to COMP LAB 503',
      time: '1 day ago',
    },
    {
      id: '3',
      type: 'warning',
      title: 'Consultation Hours Reminder',
      message: 'You have consultation hours scheduled for today at 10:00AM-11:00AM',
      time: '3 hours ago',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <MaterialIcons name="check-circle" size={24} color="#10B981" />;
      case 'info':
        return <MaterialIcons name="info" size={24} color="#3B82F6" />;
      case 'warning':
        return <MaterialIcons name="warning" size={24} color="#F59E0B" />;
      default:
        return <MaterialIcons name="notifications" size={24} color="#6B7280" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return styles.successNotification;
      case 'info':
        return styles.infoNotification;
      case 'warning':
        return styles.warningNotification;
      default:
        return styles.defaultNotification;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Approved Message */}
      {showApproved && (
        <View style={styles.approvedMessage}>
          <Text style={styles.approvedText}>You have approved the schedule</Text>
        </View>
      )}

      {/* Submitted Message */}
      {showSubmitted && (
        <View style={styles.submittedMessage}>
          <Text style={styles.submittedText}>Submitted</Text>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView style={styles.notificationScrollView} showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <View key={notification.id} style={[styles.notificationItem, getNotificationStyle(notification.type)]}>
            <View style={styles.notificationHeader}>
              {getNotificationIcon(notification.type)}
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                {notification.time && (
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                )}
              </View>
            </View>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <MaterialIcons name="home" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="notifications" size={28} color="#1E40AF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleSchedulePress}>
          <MaterialIcons name="calendar-today" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfilePress}>
          <MaterialIcons name="person" size={28} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E40AF',
    flex: 1,
    marginLeft: 10,
  },
  headerSpacer: {
    width: 34,
  },
  placeholder: {
    width: 34,
  },
  notificationScrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // Add padding for bottom navigation
  },
  notificationItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successNotification: {
    backgroundColor: '#ECFDF5',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  infoNotification: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  warningNotification: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  defaultNotification: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#6B7280',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginLeft: 36,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navItem: {
    alignItems: 'center',
    padding: 10,
  },
  approvedMessage: {
    backgroundColor: '#10B981',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  approvedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submittedMessage: {
    backgroundColor: '#3B82F6',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submittedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
