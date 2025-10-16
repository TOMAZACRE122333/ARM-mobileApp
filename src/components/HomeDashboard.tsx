import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';

const { width } = Dimensions.get('window');

interface ScheduleItem {
  time: string;
  title: string;
  location: string
  code: string;
}

interface HomeDashboardProps extends NativeStackScreenProps<RootStackParamList, 'Home'> {
  professorName?: string;
  onLogout?: () => void;
  onSchedulePress?: () => void;
  onReservePress?: () => void;
  onNotificationsPress?: () => void;
  onHomePress?: () => void;
  onProfilePress?: () => void;
  onAdminSchedulePress?: () => void;
  onScheduleWithApproval?: () => void;
  onShowSubmittedPopup?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  navigation,
  professorName = "",
  onLogout,
  onSchedulePress,
  onReservePress,
  onNotificationsPress,
  onHomePress,
  onProfilePress,
  onAdminSchedulePress,
  onScheduleWithApproval,
  onShowSubmittedPopup,
}) => {
  
  // Navigation handlers
  const handleSchedulePress = () => {
    if (onSchedulePress) {
      onSchedulePress();
    } else {
      navigation.navigate('Schedule');
    }
  };

  const handleReservePress = () => {
    if (onReservePress) {
      onReservePress();
    } else {
      navigation.navigate('ReserveClassroom');
    }
  };

  const handleNotificationsPress = () => {
    if (onNotificationsPress) {
      onNotificationsPress();
    } else {
      navigation.navigate('Notification');
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };
  const [showNotification, setShowNotification] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1);
  const badgeScale = useState(new Animated.Value(1))[0];
  const [showApprovedPopup, setShowApprovedPopup] = useState(false);
  const [showDeclinedPopup, setShowDeclinedPopup] = useState(false);
  const [showSubmittedPopup, setShowSubmittedPopup] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const todaySchedule: ScheduleItem[] = [
    {
      time: "7:00AM - 10:00AM",
      title: "Information Assurance & Security",
      location: "COMP LAB 501",
      code: "IT503"
    },
    {
      time: "10:00AM - 11:00AM",
      title: "CONSULTATION HOURS",
      location: "",
      code: ""
    },
    {
      time: "11:00AM - 2:00PM",
      title: "Mobile Systems & Technologies",
      location: "COMP LAB 502",
      code: "BT602"
    }
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Professor Info */}
        <LinearGradient
          colors={['#FDE68A', '#7DD3FC']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.professorCard} onPress={handleProfilePress}>
              <View style={styles.avatarContainer}>
                <MaterialIcons name="person" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.professorLabel}>Professor</Text>
                <Text style={styles.professorName}>{professorName}</Text>
              </View>
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={20} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerNotificationButton}
              onPress={() => {
                // Animate badge before removing
                Animated.sequence([
                  Animated.timing(badgeScale, {
                    toValue: 1.3,
                    duration: 150,
                    useNativeDriver: true,
                  }),
                  Animated.timing(badgeScale, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                  }),
                ]).start(() => {
                  setNotificationCount(0);
                });
                handleNotificationsPress();
              }}
            >
              <MaterialIcons name="notifications" size={28} color="#FFFFFF" />
              {notificationCount > 0 && (
                <Animated.View style={[styles.headerNotificationBadge, { transform: [{ scale: badgeScale }] }]}>
                  <Text style={styles.headerBadgeText}>{notificationCount}</Text>
                </Animated.View>
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton} onPress={handleSchedulePress}>
                <View style={styles.actionIcon}>
                  <MaterialIcons name="calendar-today" size={24} color="#000" />
                </View>
                <Text style={styles.actionText}>Schedule</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleReservePress}>
                <View style={styles.actionIcon}>
                  <MaterialIcons name="meeting-room" size={24} color="#000" />
                </View>
                <Text style={styles.actionText}>Reserve Classroom</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Dashboard Title */}
          <Text style={styles.dashboardTitle}>Dashboard</Text>

          {/* Notification Card */}
          {showNotification && (
            <TouchableOpacity 
              style={styles.notificationCard}
              onPress={() => setShowModal(true)}
            >
              <Text style={styles.notificationTitle}>Classroom Reservation Approved!</Text>
              <Text style={styles.notificationText}>
                Classroom reservation successful!{'\n'}
                You've successfully reserved <Text style={styles.boldText}>Room 202</Text> on <Text style={styles.boldText}>February 26</Text> at{'\n'}
                <Text style={styles.boldText}>9:00AM-10:00AM</Text>
              </Text>
            </TouchableOpacity>
          )}

          {/* Today's Schedule */}
          <View style={styles.scheduleSection}>
            <View style={styles.scheduleHeader}>
              <Text style={styles.todayText}>Today</Text>
              <Text style={styles.dateText}>{getCurrentDate()}</Text>
            </View>

            <View style={styles.scheduleCard}>
              {todaySchedule.map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <Text style={styles.scheduleTime}>{item.time}</Text>
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
              ))}
            </View>
          </View>
        </View>

        {/* Admin Schedule Modal */}
        <Modal
          visible={showAdminModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAdminModal(false)}
        >
          <View style={styles.adminModalOverlay}>
            <View style={styles.adminModalContainer}>
              <View style={styles.adminModalHeader}>
                <Text style={styles.adminModalTitle}>Admin & Consultation Schedule</Text>
              </View>
              
              <View style={styles.adminModalContent}>
                <Text style={styles.adminModalQuestion}>
                  Do you want to reject this schedule assignment?
                </Text>
                
                <View style={styles.adminTextArea}>
                  {/* Text area placeholder */}
                </View>
                
                <TouchableOpacity 
                  style={styles.adminSubmitButton}
                  onPress={() => {
                    setShowAdminModal(false);
                    setShowDeclinedPopup(true);
                    setNotificationCount((prev: number) => prev + 1);
                    setTimeout(() => setShowDeclinedPopup(false), 3000);
                  }}
                >
                  <Text style={styles.adminSubmitButtonText}>SUBMIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        {/* Modal for Notification Actions */}
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Admin & Consultation Schedule</Text>
              <Text style={styles.modalQuestion}>Are you approving this schedule?</Text>
              <TouchableOpacity onPress={onSchedulePress}>
                <Text style={styles.viewScheduleLink}>View full schedule</Text>
              </TouchableOpacity>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={() => {
                    setShowModal(false);
                    setShowNotification(false);
                    setShowAdminModal(true);
                  }}
                >
                  <MaterialIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.approveButton}
                  onPress={() => {
                    setShowModal(false);
                    setShowNotification(false);
                    setShowApprovedPopup(true);
                    setNotificationCount((prev: number) => prev + 1);
                    setTimeout(() => setShowApprovedPopup(false), 3000);
                  }}
                >
                  <MaterialIcons name="check" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Improved Notification Popups */}
        {showApprovedPopup && (
          <View style={styles.improvedNotificationPopup}>
            <View style={styles.improvedPopupContent}>
              <View style={styles.popupIconContainer}>
                <MaterialIcons name="check-circle" size={20} color="#10B981" />
              </View>
              <Text style={styles.improvedPopupText}>You have approved the schedule</Text>
              <TouchableOpacity 
                style={styles.popupCloseButton}
                onPress={() => setShowApprovedPopup(false)}
              >
                <MaterialIcons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showDeclinedPopup && (
          <View style={styles.improvedNotificationPopup}>
            <View style={styles.improvedPopupContent}>
              <View style={styles.popupIconContainer}>
                <MaterialIcons name="cancel" size={20} color="#EF4444" />
              </View>
              <Text style={styles.improvedPopupText}>You have declined the schedule</Text>
              <TouchableOpacity 
                style={styles.popupCloseButton}
                onPress={() => setShowDeclinedPopup(false)}
              >
                <MaterialIcons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {showSubmittedPopup && (
          <View style={styles.improvedNotificationPopup}>
            <View style={styles.improvedPopupContent}>
              <View style={styles.popupIconContainer}>
                <MaterialIcons name="send" size={20} color="#1E40AF" />
              </View>
              <Text style={styles.improvedPopupText}>Successfully submitted</Text>
              <TouchableOpacity 
                style={styles.popupCloseButton}
                onPress={() => setShowSubmittedPopup(false)}
              >
                <MaterialIcons name="close" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerNotificationButton: {
    padding: 12,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerNotificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  professorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#667EEA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667EEA',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  professorLabel: {
    fontSize: 14,
    color: '#374151',
  },
  professorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  flex1: {
    flex: 1,
  },
  logoutButton: {
    padding: 8,
    marginLeft: 12,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  quickActions: {
    marginBottom: 30,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#FDE047',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#374151',
    fontWeight: '500',
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalQuestion: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 15,
    textAlign: 'center',
  },
  viewScheduleLink: {
    fontSize: 14,
    color: '#1E40AF',
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  rejectButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  approveButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  improvedNotificationPopup: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  improvedPopupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1E40AF',
  },
  popupIconContainer: {
    marginRight: 12,
  },
  improvedPopupText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  popupCloseButton: {
    padding: 4,
  },
  notificationIcon: {
    position: 'relative',
  },
  popupBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  feedbackOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#1E40AF',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
  },
  scheduleButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  reserveButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  notificationButton: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonIcon: {
    backgroundColor: '#FDE047',
    borderRadius: 15,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  smallNotificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scheduleSection: {
    marginBottom: 100,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 15,
  },
  todayText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scheduleItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scheduleTime: {
    fontSize: 12,
    color: '#6B7280',
    width: 100,
    fontWeight: '500',
  },
  scheduleDetails: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  scheduleLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  scheduleCode: {
    fontSize: 12,
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
  },
  navItem: {
    alignItems: 'center',
    padding: 10,
  },
  adminModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminModalContainer: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  adminModalHeader: {
    backgroundColor: '#1E40AF',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  adminModalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  adminModalContent: {
    backgroundColor: '#E3F2FD',
    padding: 20,
  },
  adminModalQuestion: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 15,
  },
  adminTextArea: {
    backgroundColor: '#FFFFFF',
    height: 80,
    borderRadius: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  adminSubmitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  adminSubmitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
