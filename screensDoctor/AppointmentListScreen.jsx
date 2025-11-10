// Developed by Sami
import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppointmentsContext } from '../contexts/AppointmentsContext';
import ScreenWithDrawer from './ScreenWithDrawer';
//sami
const primary = '#00b29c';

const AppointmentListScreen = () => {
  const navigation = useNavigation();
  const {
    appointments,
    deleteAppointment,
    loading,
    error,
    refresh,
  } = useContext(AppointmentsContext);

  const openForm = (appointment) => {
    navigation.navigate('AppointmentForm', appointment ? { appointment } : undefined);
  };

  const handleDelete = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
    } catch (err) {
      Alert.alert('خطأ', err.message || 'تعذر حذف الموعد');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{flex:1}}
        onPress={() => openForm(item)}
      >
      <View style={styles.cardContent}>
        <Ionicons name="calendar" size={24} color={primary} style={styles.icon} />
        <View>
          <Text style={styles.title}>{item.patientName}</Text>
          <Text style={styles.subtitle}>{`${item.dateText}  |  ${item.timeText}`}</Text>
        </View>
      </View>
          </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={() => handleDelete(item.id)}>
        <Ionicons name="close" size={20} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWithDrawer title="المواعيد">
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => openForm()}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={20} color="#fff" style={{ marginEnd: 4 }} />
        <Text style={styles.addText}>إضافة موعد جديد</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {loading && !appointments.length ? (
        <ActivityIndicator color={primary} style={{ marginVertical: 16 }} />
      ) : null}
      
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد مواعيد حاليًا</Text>}
        contentContainerStyle={appointments.length ? undefined : styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={primary} />
        }
      />


    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginEnd: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primary,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  cancelBtn: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#666',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default AppointmentListScreen;
