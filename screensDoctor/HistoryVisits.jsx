// By sami: شاشة سجل الزيارات كملف مستقل
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Modal, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWithDrawer from './ScreenWithDrawer';
import { useVisitData } from '../contexts/VisitDataContext';

// استخدام نفس بيانات المرضى من قائمة المرضى
const patientsData = [
  { id: '1', name: 'مالك شلالدة', nationalId: '1234567890', age: 45, lastVisit: '2025-05-20' },
  { id: '2', name: 'عبد الجندي', nationalId: '0987654321', age: 32, lastVisit: '2025-05-15' },
  { id: '3', name: 'محمود علي', nationalId: '5678901234', age: 58, lastVisit: '2025-05-10' },
  { id: '4', name: 'فاطمة أحمد', nationalId: '4321098765', age: 27, lastVisit: '2025-05-05' },
  { id: '5', name: 'خالد عمر', nationalId: '9012345678', age: 63, lastVisit: '2025-04-30' },
  { id: '6', name: 'ريم الخطيب', nationalId: '3456789012', age: 41, lastVisit: '2025-04-25' },
  { id: '7', name: 'عمر حسن', nationalId: '6789012345', age: 36, lastVisit: '2025-04-20' },
  { id: '8', name: 'ليلى كريم', nationalId: '2109876543', age: 29, lastVisit: '2025-04-15' },
];

const primary = '#00b29c';

const HistoryVisits = () => {
  // By sami: إضافة بحث المريض قبل عرض السجل أو التقييم
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId = null, patientName = '' } = route.params || {};
  const { getVisitsForPatient } = useVisitData();

  // حالة البحث
  const [searchText, setSearchText] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ترشيح المرضى
  const filteredPatients = patientsData.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.id.toLowerCase().includes(searchText.toLowerCase())
  );

  // إذا لم يتم تمرير patientId، اعرض واجهة البحث أولاً
  if (!patientId) {
    return (
      <ScreenWithDrawer title="بحث مريض">
        <SafeAreaView style={{ flex: 1 }}>
          {/* حقل البحث */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="أدخل اسم أو رقم المريض..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          </View>

          <FlatList
            data={filteredPatients}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => setSelectedPatient(item)}
              >
                <Text style={styles.resultText}>{item.name} ({item.id})</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchText.trim().length > 0 && filteredPatients.length === 0 ? (
                <Text style={styles.noResults}>لا يوجد نتائج مطابقة.</Text>
              ) : null
            }
          />

          {/* إذا تم اختيار مريض، أظهر الأزرار */}
          {selectedPatient && (
            <View style={{ padding: 16 }}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  navigation.navigate('تقييم الزيارة', {
                    patientId: selectedPatient.id,
                    patientName: selectedPatient.name,
                  });
                }}
              >
                <Text style={styles.actionBtnText}>تقييم الزيارة</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: primary, marginTop: 12 }]}
                onPress={() => {
                  navigation.navigate('سجل الزيارات', {
                    patientId: selectedPatient.id,
                    patientName: selectedPatient.name,
                  });
                }}
              >
                <Text style={styles.actionBtnText}>عرض سجل الزيارات</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </ScreenWithDrawer>
    );
  }

  // *** الكود السابق للسجل في حال توفر patientId أو استعراض الجميع ***

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // الحصول على بيانات الزيارات
  const allVisitsData = useMemo(() => 
    patientId 
      ? getVisitsForPatient(patientId)
      : Object.values(patientsData).flatMap(patient => 
          getVisitsForPatient(patient.id).map(visit => ({
            ...visit,
            patientName: patient.name
          }))
        ),
    [patientId, getVisitsForPatient]
  );

  // ترشيح بيانات الزيارات بناءً على البحث
  const filteredVisitsData = useMemo(() => {
    if (!searchQuery.trim()) return allVisitsData;
    
    const query = searchQuery.toLowerCase();
    return allVisitsData.filter(visit => 
      (visit.patientName && visit.patientName.toLowerCase().includes(query)) ||
      visit.date.includes(query) ||
      (visit.summary && visit.summary.toLowerCase().includes(query)) ||
      (visit.condition && visit.condition.toLowerCase().includes(query))
    );
  }, [allVisitsData, searchQuery]);

  const openVisit = (item) => {
    setSelectedVisit(item);
    setModalVisible(true);
  };

  // إغلاق Modal عند الضغط خارجه
  const handleOverlayPress = (event) => {
    if (event.target === event.currentTarget) {
      setModalVisible(false);
    }
  };

  return (
    <ScreenWithDrawer title="سجل الزيارات">
      <SafeAreaView style={{ flex: 1 }}>
        {/* سهم الرجوع للخلف */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        {patientName ? (
          <Text style={styles.patientHeader}>{`المريض: ${patientName}`}</Text>
        ) : null}

        {/* حقل البحث الموحد */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث في الزيارات..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>

        <FlatList
          data={filteredVisitsData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            searchQuery.trim() !== '' ? (
              <Text style={styles.noResults}>لا توجد نتائج مطابقة للبحث</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => openVisit(item)}>
              {/* إظهار اسم المريض إذا لم يكن في سياق مريض محدد */}
              {!patientName && item.patientName && (
                <Text style={styles.patientNameInVisit}>{`المريض: ${item.patientName}`}</Text>
              )}
              <View style={styles.cardRow}>
                <Text style={styles.date}>{`${item.date} | ${item.time}`}</Text>
                <Ionicons name="chevron-back" size={22} color="#000" />
              </View>
              <Text style={styles.summary}>{item.summary}</Text>
            </TouchableOpacity>
          )}
        />

        {/* FAB لإضافة تقييم جديد */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            navigation.navigate('تقييم الزيارة')
          }
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Modal تفاصيل الزيارة */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>

              {selectedVisit && (
                <>
                  <Text style={styles.modalTitle}>{`زيارة ${selectedVisit.date} في ${selectedVisit.time}`}</Text>
                  
                  <Text style={styles.sectionHeader}>الحالة العامة</Text>
                  <Text style={styles.multiLine}>{selectedVisit.condition}</Text>
                  
                  <Text style={styles.sectionHeader}>الالتزام بالعلاج</Text>
                  <Text style={styles.multiLine}>{selectedVisit.adherence}</Text>
                  
                  <Text style={styles.sectionHeader}>الملاحظات التفصيلية</Text>
                  <Text style={styles.multiLine}>{selectedVisit.notes || 'لا توجد ملاحظات'}</Text>
                  
                  <Text style={styles.sectionHeader}>الجوانب النفسية والاجتماعية</Text>
                  <Text style={styles.multiLine}>{selectedVisit.psychosocial || 'لا توجد معلومات'}</Text>
                  
                  <Text style={styles.sectionHeader}>تعليمات الطبيب</Text>
                  <Text style={styles.multiLine}>{selectedVisit.instructions || 'لا توجد تعليمات'}</Text>
                </>
              )}
              
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>إغلاق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    alignSelf: 'flex-start',
    margin: 16,
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    textAlign: 'right',
    fontFamily: 'Tajawal',
    fontSize: 16,
  },
  searchIcon: {
    marginStart: 8,
  },
  patientHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    fontFamily: 'Tajawal',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientNameInVisit: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 8,
    fontFamily: 'Tajawal',
    color: '#00b29c',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Tajawal',
  },
  summary: {
    fontSize: 16,
    fontFamily: 'Tajawal',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Tajawal',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Tajawal',
    lineHeight: 24,
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#00b29c',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Tajawal',
  },
  // زر إجراءات بعد اختيار المريض - By sami
  actionBtn: {
    backgroundColor: '#A8E6A1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#00b29c',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  closeBtn: { alignSelf: 'flex-start' },
});

export default HistoryVisits;