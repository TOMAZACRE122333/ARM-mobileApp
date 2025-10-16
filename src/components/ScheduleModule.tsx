import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location?: string;
  code?: string;
  type: 'class' | 'consultation' | 'admin';
}

interface ScheduleModuleProps extends NativeStackScreenProps<RootStackParamList, 'Schedule'> {
  onBack?: () => void;
  onNotificationPress?: () => void;
  onHomePress?: () => void;
  onProfilePress?: () => void;
  showApprovalMessage?: boolean;
}

export const ScheduleModule: React.FC<ScheduleModuleProps> = ({
  navigation,
  onBack,
  onNotificationPress,
  onHomePress,
  onProfilePress,
  showApprovalMessage = false,
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

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      navigation.navigate('Notification');
    }
  };
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showApprovedMessage, setShowApprovedMessage] = useState(showApprovalMessage);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Sample schedule data for different days
  const scheduleData: Record<string, ScheduleItem[]> = {
    Mon: [
      {
        id: '1',
        time: '8:00AM - 11:00AM',
        title: 'Database Management Systems',
        location: 'COMP LAB 503',
        code: 'CS401',
        type: 'class',
      },
      {
        id: '2',
        time: '1:00PM - 2:00PM',
        title: 'CONSULTATION HOURS',
        type: 'consultation',
      },
      {
        id: '3',
        time: '2:00PM - 5:00PM',
        title: 'Software Engineering',
        location: 'COMP LAB 504',
        code: 'CS402',
        type: 'class',
      },
    ],
    Tue: [
      {
        id: '1',
        time: '9:00AM - 12:00PM',
        title: 'Web Development',
        location: 'COMP LAB 505',
        code: 'CS403',
        type: 'class',
      },
      {
        id: '2',
        time: '2:00PM - 3:00PM',
        title: 'CONSULTATION HOURS',
        type: 'consultation',
      },
    ],
    Wed: [
      {
        id: '1',
        time: '7:00AM - 10:00AM',
        title: 'Information Assurance & Security',
        location: 'COMP LAB 501',
        code: 'BT506',
        type: 'class',
      },
      {
        id: '2',
        time: '10:00AM - 11:00AM',
        title: 'CONSULTATION HOURS',
        type: 'consultation',
      },
      {
        id: '3',
        time: '11:00AM - 2:00PM',
        title: 'Mobile Systems & Technologies',
        location: 'COMP LAB 502',
        code: 'BT602',
        type: 'class',
      },
    ],
    Thu: [
      {
        id: '1',
        time: '8:00AM - 11:00AM',
        title: 'Network Administration',
        location: 'COMP LAB 506',
        code: 'IT404',
        type: 'class',
      },
      {
        id: '2',
        time: '1:00PM - 2:00PM',
        title: 'CONSULTATION HOURS',
        type: 'consultation',
      },
      {
        id: '3',
        time: '3:00PM - 6:00PM',
        title: 'System Analysis & Design',
        location: 'COMP LAB 507',
        code: 'IT405',
        type: 'class',
      },
    ],
    Fri: [
      {
        id: '1',
        time: '9:00AM - 12:00PM',
        title: 'Capstone Project',
        location: 'COMP LAB 508',
        code: 'CS499',
        type: 'class',
      },
      {
        id: '2',
        time: '2:00PM - 4:00PM',
        title: 'Faculty Meeting',
        location: 'Conference Room A',
        type: 'admin',
      },
    ],
  };

  const currentSchedule = scheduleData[selectedDay] || [];

  const getScheduleItemStyle = (type: string) => {
    switch (type) {
      case 'class':
        return styles.classItem;
      case 'consultation':
        return styles.consultationItem;
      case 'admin':
        return styles.adminItem;
      default:
        return styles.classItem;
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
      </View>


      {/* View Options */}
      <TouchableOpacity style={styles.viewOptions} onPress={() => setShowCalendarModal(true)}>
        <Text style={styles.viewText}>View</Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      {/* Day Navigation */}
      <View style={styles.dayNavigation}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === day && styles.selectedDayText,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Today Section */}
      <View style={styles.todaySection}>
        <Text style={styles.todayTitle}>Today</Text>
        <Text style={styles.todayDate}>{getCurrentDate()}</Text>
      </View>

      {/* Schedule List */}
      <ScrollView style={styles.scheduleContainer} showsVerticalScrollIndicator={false}>
        {currentSchedule.length > 0 ? (
          currentSchedule.map((item) => (
            <View key={item.id} style={[styles.scheduleItem, getScheduleItemStyle(item.type)]}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.scheduleDetails}>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
                {item.location && (
                  <Text style={styles.scheduleLocation}>{item.location}</Text>
                )}
                {item.code && (
                  <Text style={styles.scheduleCode}>{item.code}</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.noClassesText}>No classes scheduled for Today</Text>
          </View>
        )}
      </ScrollView>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendarModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <View style={styles.calendarModalOverlay}>
          <View style={styles.calendarModalContainer}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>Calendar View</Text>
              <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarGrid}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthText}>September 2025</Text>
              </View>
              
              <View style={styles.weekDays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>
              
              <View style={styles.daysGrid}>
                {Array.from({ length: 30 }, (_, i) => (
                  <TouchableOpacity key={i} style={styles.dayCell}>
                    <Text style={styles.dayNumber}>{i + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <MaterialIcons name="home" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleNotificationPress}>
          <MaterialIcons name="notifications" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="calendar-today" size={28} color="#1E40AF" />
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
  notificationButton: {
    padding: 5,
  },
  viewOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  viewText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 5,
  },
  dayNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedDayButton: {
    backgroundColor: '#7DD3FC',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  todaySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  todayTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 5,
  },
  todayDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // Add padding for bottom navigation
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  classItem: {
    backgroundColor: '#FEF3C7',
  },
  consultationItem: {
    backgroundColor: '#DBEAFE',
  },
  adminItem: {
    backgroundColor: '#F3E8FF',
  },
  timeContainer: {
    marginRight: 15,
    minWidth: 80,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  scheduleLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  scheduleCode: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
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
    textAlign: 'center',
  },
  noClassesText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContainer: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: '80%',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  calendarGrid: {
    padding: 20,
  },
  monthHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 20,
  },
  dayNumber: {
    fontSize: 16,
    color: '#374151',
  },
});
