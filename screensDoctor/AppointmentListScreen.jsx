// Developed by Sami
import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppointmentsContext } from '../contexts/AppointmentsContext';
import ScreenWithDrawer from './ScreenWithDrawer';
//sami
const primary = '#00b29c';

const AppointmentListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  const { appointments, addOrUpdate, remove } = useContext(AppointmentsContext);

  // When returning from form, we may get params with the new / updated appointment
  useEffect(() => {
    if (isFocused && route.params?.savedAppointment) {
      const appointment = route.params.savedAppointment;
      addOrUpdate(appointment);
      // clear params so useEffect won't loop
      navigation.setParams({ savedAppointment: undefined });
    }
  }, [isFocused, route.params, navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={{flex:1}}
        onPress={() => navigation.navigate('AppointmentForm', { appointment: item })}
      >
      <View style={styles.cardContent}>
        <Ionicons name="calendar" size={24} color={primary} style={styles.icon} />
        <View>
          <Text style={styles.title}>{item.patient}</Text>
          <Text style={styles.subtitle}>{`${item.date}  |  ${item.time}`}</Text>
        </View>
      </View>
          </TouchableOpacity>
      <TouchableOpacity style={styles.cancelBtn} onPress={() => remove(item.id)}>
        <Ionicons name="close" size={20} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWithDrawer title="المواعيد">
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('AppointmentForm')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={20} color="#fff" style={{ marginEnd: 4 }} />
        <Text style={styles.addText}>إضافة موعد جديد</Text>
      </TouchableOpacity>
      
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد مواعيد حاليًا</Text>}
        contentContainerStyle={appointments.length ? undefined : styles.emptyContainer}
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
  }
});

export default AppointmentListScreen;
