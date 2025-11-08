import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';

import ScreenWithDrawer from './ScreenWithDrawer';
import ENDPOINTS from '../samiendpoint';

const AI_URL = 'http://192.168.1.122:11434/api/generate';   
const AI_MODEL = 'Hepa_care_version_17:latest';             

const VisitsSummaryScreen = ({ route }) => {
  const { patientId, patientName } = route.params || {};

  const [status, setStatus] = useState('idle');
  const [summary, setSummary] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const insets = useSafeAreaInsets();

  // دالة لبناء الـ prompt مباشرة في الواجهة
  const buildPrompt = (visitsPayload) => {
    const dataForAi = {
      patient: { id: patientId, name: patientName || 'غير معروف' },
      visits: visitsPayload,
    };

    return [
      'البيانات التالية:',
      JSON.stringify(dataForAi, null, 2),
      'قدّم ملخصاً طبياً بالعربية وفق التعليمات المسبقة.'
    ].join('\n\n');
  };

  const loadSummary = useCallback(async () => {
    if (!patientId) {
      setErrorMessage('لا يوجد معرف للمريض.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setSummary('');
    setErrorMessage('');

    try {
      const visitsResponse = await axios.get(ENDPOINTS.visitsHistory, {
        params: { patient_id: patientId },
      });

      const visits = Array.isArray(visitsResponse.data)
        ? visitsResponse.data
        : [];

      const visitsPayload = visits.map((visit) => ({
        id: visit.id,
        date: visit.date,
        time: visit.time,
        doctor: visit.doctorName || '',
        condition: visit.condition || '',
        adherence: visit.adherence || '',
        notes: visit.notes || '',
        psychosocial: visit.psychosocial || '',
        summary: visit.summary || '',
      }));

      const prompt = buildPrompt(visitsPayload);

      
      const aiResponse = await fetch(AI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: AI_MODEL,
          prompt,
          stream: false,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('تعذر الحصول على الملخص من الخادم الذكي.');
      }

      const aiJson = await aiResponse.json();
      const text = aiJson?.response?.trim();

      if (!text) {
        throw new Error('الرد من الخادم فارغ.');
      }

      setSummary(text);
      setStatus('done');
    } catch (error) {
      console.error('خطأ في إنشاء ملخص الزيارات:', error);
      setErrorMessage(
        error?.message ?? 'حدث خطأ أثناء توليد الملخص، حاول مرة أخرى.'
      );
      setStatus('error');
    }
  }, [patientId, patientName]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <ScreenWithDrawer title="ملخص الزيارات">
      <View style={styles.container}>
        <View style={styles.patientBox}>
          <Text style={styles.patientLabel}>المريض:</Text>
          <Text style={styles.patientName}>{patientName || 'غير معروف'}</Text>
        </View>

        {status === 'loading' && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#00b29c" />
            <Text style={styles.infoText}>جاري تحليل الزيارات...</Text>
          </View>
        )}

        {status === 'error' && (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadSummary}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'done' && (
          <ScrollView
            nestedScrollEnabled={true}
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 24 },
            ]}
          >
            <Text style={styles.summaryText}>{summary}</Text>
          </ScrollView>
        )}
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  patientBox: {
    backgroundColor: '#e0f4f1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  patientLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    textAlign: 'right',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#00b29c',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#00b29c',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
  },
  scrollContent: {
    padding: 16,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
    color: '#333',
  },
});

export default VisitsSummaryScreen;

