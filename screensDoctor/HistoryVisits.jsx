// By sami: شاشة سجل الزيارات كملف مستقل
import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList, 
  Modal, 
  Pressable, 
  TextInput, 
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWithDrawer from './ScreenWithDrawer';
import axios from 'axios';
import ENDPOINTS from '../samiendpoint';

const primary = '#00b29c';

const HistoryVisits = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId = null, patientName = '' } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [serverVisits, setServerVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadVisitsHistory = async () => {
      if (!patientId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(ENDPOINTS.visitsHistory, {
          params: { patient_id: patientId }
        });
        
        const visitsData = response.data || [];
        setServerVisits(visitsData);
      } catch (error) {
        console.error('خطأ في جلب سجل الزيارات:', error);
        Alert.alert('خطأ', 'تعذر جلب سجل الزيارات');
      } finally {
        setLoading(false);
      }
    };

    loadVisitsHistory();
  }, [patientId]);

  // ترشيح بيانات الزيارات بناءً على البحث
  const filteredVisitsData = useMemo(() => {
    if (!searchQuery.trim()) return serverVisits;
    
    const query = searchQuery.toLowerCase();
    return serverVisits.filter(visit => 
      (visit.patientName && visit.patientName.toLowerCase().includes(query)) ||
      visit.date.includes(query) ||
      (visit.summary && visit.summary.toLowerCase().includes(query)) ||
      (visit.condition && visit.condition.toLowerCase().includes(query))
    );
  }, [serverVisits, searchQuery]);

  const openVisit = (item) => {
    setSelectedVisit(item);
    setModalVisible(true);
  };

  return (
    <ScreenWithDrawer title="سجل الزيارات">
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        {patientName ? (
          <Text style={styles.patientHeader}>{`المريض: ${patientName}`}</Text>
        ) : null}

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث في الزيارات..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>جار التحميل...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredVisitsData}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              searchQuery.trim() !== '' ? (
                <Text style={styles.noResults}>لا توجد نتائج مطابقة للبحث</Text>
              ) : (
                <Text style={styles.noResults}>لا توجد زيارات سابقة</Text>
              )
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => openVisit(item)}>
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
        )}

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
                  <Text style={styles.multiLine}>{selectedVisit.condition || 'غير محدد'}</Text>
                  
                  <Text style={styles.sectionHeader}>الالتزام بالعلاج</Text>
                  <Text style={styles.multiLine}>{selectedVisit.adherence || 'غير محدد'}</Text>
                  
                  <Text style={styles.sectionHeader}>الملاحظات التفصيلية</Text>
                  <Text style={styles.multiLine}>{selectedVisit.notes || 'لا توجد ملاحظات'}</Text>
                  
                  <Text style={styles.sectionHeader}>الجوانب النفسية والاجتماعية</Text>
                  <Text style={styles.multiLine}>{selectedVisit.psychosocial || 'لا توجد معلومات'}</Text>
                  
                  <Text style={styles.sectionHeader}>الطبيب المعالج</Text>
                  <Text style={styles.multiLine}>{selectedVisit.doctorName || 'غير محدد'}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontFamily: 'Tajawal',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Tajawal',
  },
  multiLine: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Tajawal',
    lineHeight: 24,
  },
});

export default HistoryVisits;