import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

const { width } = Dimensions.get('window');

interface ReserveClassroomModuleProps extends NativeStackScreenProps<RootStackParamList, 'ReserveClassroom'> {
  onBack?: () => void;
  onNotificationPress?: () => void;
  onHomePress?: () => void;
  onSchedulePress?: () => void;
  onProfilePress?: () => void;
}

export const ReserveClassroomModule: React.FC<ReserveClassroomModuleProps> = ({
  navigation,
  onBack,
  onNotificationPress,
  onHomePress,
  onSchedulePress,
  onProfilePress,
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

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      navigation.navigate('Notification');
    }
  };
  const [currentScreen, setCurrentScreen] = useState<'available' | 'reserve' | 'feedback'>('available');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<'lecture' | 'laboratory' | 'all'>('all');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [showSubmittedModal, setShowSubmittedModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarSelectedDate, setCalendarSelectedDate] = useState<Date | null>(null);

  // Mock data for available rooms - changes based on selected date
  const getAvailableRooms = () => {
    const baseRooms = [
      { id: '1', name: 'Room 101', type: 'lecture', capacity: 50 },
      { id: '2', name: 'Room 102', type: 'lecture', capacity: 30 },
      { id: '3', name: 'Lab 201', type: 'laboratory', capacity: 25 },
      { id: '4', name: 'Lab 202', type: 'laboratory', capacity: 20 },
      { id: '5', name: 'Room 103', type: 'lecture', capacity: 40 },
      { id: '6', name: 'Lab 203', type: 'laboratory', capacity: 30 },
    ];
    
    // Filter rooms based on selected date (simulate availability)
    if (calendarSelectedDate) {
      const dayOfWeek = calendarSelectedDate.getDay();
      // Weekend - fewer rooms available
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return baseRooms.slice(0, 3);
      }
      // Weekdays - more rooms available
      return baseRooms;
    }
    return baseRooms;
  };
  
  const availableRooms = getAvailableRooms();
  const filteredRooms = availableRooms.filter(room => 
    roomType === 'all' || room.type === roomType
  );

  const timeSlots = [
    '7:00 AM - 8:00 AM',
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
  ];

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter your feedback');
      return;
    }
    setShowSubmittedModal(true);
    setTimeout(() => {
      setShowSubmittedModal(false);
      setCurrentScreen('available');
      // Reset form
      setSelectedRoom(null);
      setSelectedDate('');
      setSelectedTimeSlot(null);
      setFeedbackText('');
    }, 2000);
  };

  const handleAttachFile = () => {
    Alert.alert('File Attachment', 'File attachment feature coming soon!');
  };

  const selectDate = (date: Date) => {
    setCalendarSelectedDate(date);
    const formattedDate = date.toLocaleDateString();
    setSelectedDate(formattedDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    return date && calendarSelectedDate && date.getDate() === calendarSelectedDate.getDate() && date.getMonth() === calendarSelectedDate.getMonth() && date.getFullYear() === calendarSelectedDate.getFullYear();
  };

  const renderAvailableRooms = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Rooms</Text>
          <TouchableOpacity onPress={handleNotificationPress}>
            <MaterialIcons name="notifications" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          
          {/* Month Navigation */}
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.monthNavButton}>
              <MaterialIcons name="chevron-left" size={24} color="#1E40AF" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.monthNavButton}>
              <MaterialIcons name="chevron-right" size={24} color="#1E40AF" />
            </TouchableOpacity>
          </View>
          
          {/* Calendar Grid */}
          <View style={styles.calendarContainer}>
            {/* Day headers */}
            <View style={styles.dayHeadersRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={styles.dayHeader}>{day}</Text>
              ))}
            </View>
            
            {/* Calendar days */}
            <View style={styles.calendarGrid}>
              {getDaysInMonth(currentMonth).map((date: Date | null, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    !date && styles.emptyDay,
                    date && isToday(date) && styles.todayDay,
                    date && isSelected(date) && styles.selectedDay,
                  ]}
                  onPress={() => date && selectDate(date)}
                  disabled={!date}
                >
                  {date && (
                    <Text style={[
                      styles.calendarDayText,
                      isToday(date) && styles.todayDayText,
                      isSelected(date) && styles.selectedDayText,
                    ]}>
                      {date.getDate()}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Room Type Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Room Type</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                roomType === 'lecture' && styles.activeFilterButton,
              ]}
              onPress={() => setRoomType('lecture')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  roomType === 'lecture' && styles.activeFilterButtonText,
                ]}
              >
                Lecture Rooms
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                roomType === 'laboratory' && styles.activeFilterButton,
              ]}
              onPress={() => setRoomType('laboratory')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  roomType === 'laboratory' && styles.activeFilterButtonText,
                ]}
              >
                Laboratory
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Rooms List */}
        <View style={styles.roomList}>
          <Text style={styles.sectionTitle}>
            Available Rooms {calendarSelectedDate && `for ${calendarSelectedDate.toLocaleDateString()}`}
          </Text>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <TouchableOpacity
                key={room.id}
                style={styles.roomCard}
                onPress={() => {
                  setSelectedRoom(room.name);
                  setRoomType(room.type as 'lecture' | 'laboratory');
                  setCurrentScreen('reserve');
                }}
              >
                <View style={styles.roomInfo}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <Text style={styles.roomCapacity}>Capacity: {room.capacity}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.roomCard}>
              <Text style={styles.roomName}>No rooms available for the selected date</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <MaterialIcons name="home" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleNotificationPress}>
          <MaterialIcons name="notifications" size={28} color="#6B7280" />
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

  const renderReserveRoom = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('available')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reserve Room</Text>
          <TouchableOpacity onPress={handleNotificationPress}>
            <MaterialIcons name="notifications" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Room Layout Image */}
        <View style={styles.roomLayoutContainer}>
          <View style={styles.roomLayoutImageContainer}>
            <Image 
              source={roomType === 'laboratory' ? 
                require('../../assets/LAB.png') : 
                require('../../assets/Room 1.png')
              }
              style={styles.roomLayoutImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.roomInfoCard}>
            <Text style={styles.roomTitle}>
              {roomType === 'laboratory' ? 
                `${selectedRoom} (Capacity: 40)` : 
                `${selectedRoom} (Capacity: 60)`
              }
            </Text>
          </View>
        </View>

        {/* Time Slots Selection */}
        <View style={styles.timeSlotsSection}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.timeSlotsContainer}>
            {timeSlots.slice(0, 2).map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTimeSlot === slot && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTimeSlot === slot && styles.selectedTimeSlotText,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* Next Button */}
        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedTimeSlot && styles.disabledButton,
          ]}
          onPress={() => setCurrentScreen('feedback')}
          disabled={!selectedTimeSlot}
        >
          <Text style={styles.nextButtonText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <MaterialIcons name="home" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleNotificationPress}>
          <MaterialIcons name="notifications" size={28} color="#6B7280" />
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

  const renderFeedback = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentScreen('reserve')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feedback</Text>
          <TouchableOpacity onPress={handleNotificationPress}>
            <MaterialIcons name="notifications" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Feedback Header */}
        <View style={styles.feedbackHeaderCard}>
          <Text style={styles.feedbackTitle}>Feedback</Text>
        </View>

        {/* Feedback Form */}
        <View style={styles.feedbackContainer}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>From Room</Text>
            <View style={styles.roomSelector}>
              <Text style={styles.roomSelectorText}>{selectedRoom}</Text>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Enter your notes here..."
              multiline
              numberOfLines={4}
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
          </View>

          <TouchableOpacity style={styles.attachButton} onPress={handleAttachFile}>
            <Text style={styles.attachButtonText}>ATTACH FILE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <MaterialIcons name="home" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleNotificationPress}>
          <MaterialIcons name="notifications" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleSchedulePress}>
          <MaterialIcons name="calendar-today" size={28} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfilePress}>
          <MaterialIcons name="person" size={28} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Submitted Modal */}
      <Modal
        visible={showSubmittedModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.submittedOverlay}>
          <View style={styles.submittedPopup}>
            <MaterialIcons name="check-circle" size={60} color="#10B981" />
            <Text style={styles.submittedText}>Successfully Submitted!</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );

  // Main render function
  switch (currentScreen) {
    case 'available':
      return renderAvailableRooms();
    case 'reserve':
      return renderReserveRoom();
    case 'feedback':
      return renderFeedback();
    default:
      return renderAvailableRooms();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  roomTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  roomTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  selectedRoomType: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  roomTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedRoomTypeText: {
    color: '#FFFFFF',
  },
  roomList: {
    paddingHorizontal: 20,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roomCapacity: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedRoomCard: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomLayoutContainer: {
    margin: 20,
  },
  roomLayoutImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomLayoutImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  roomInfoCard: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    padding: 15,
    marginTop: 5,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  dateSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#374151',
  },
  timeSlotsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: '#7DD3FC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#FDE047',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedTimeSlotText: {
    color: '#000000',
  },
  nextButton: {
    backgroundColor: '#FDE047',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  feedbackHeaderCard: {
    backgroundColor: '#1E40AF',
    margin: 20,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  feedbackContainer: {
    backgroundColor: '#7DD3FC',
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  roomSelector: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  roomSelectorText: {
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#374151',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  attachButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  attachButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // Calendar styles
  calendarSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeadersRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    paddingVertical: 5,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  emptyDay: {
    backgroundColor: 'transparent',
  },
  todayDay: {
    backgroundColor: '#FDE047',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#1E40AF',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  todayDayText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Filter styles
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#1E40AF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  // No rooms message
  noRoomsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noRoomsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    padding: 10,
  },
  submittedOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submittedPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  submittedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default ReserveClassroomModule;
