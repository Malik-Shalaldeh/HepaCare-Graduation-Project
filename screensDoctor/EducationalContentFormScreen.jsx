//  Sami
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ScreenWithDrawer from './ScreenWithDrawer';
import { EducationalContentContext } from '../contexts/EducationalContentContext';

const primary = '#00b29c';

const EducationalContentFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addOrUpdate } = useContext(EducationalContentContext);

  const editingContent = route.params?.content;

  const [title, setTitle] = useState(editingContent?.title || '');
  const [content, setContent] = useState(editingContent?.content || '');
  const [author, setAuthor] = useState(editingContent?.author || 'د. سامي');
  
  // Dropdown for content type
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(editingContent?.type || null);
  const [typeItems, setTypeItems] = useState([
    { label: 'مقال', value: 'مقال' },
    { label: 'فيديو', value: 'فيديو' },
    { label: 'صورة', value: 'صورة' },
  ]);

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !type) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const savedContent = {
      id: editingContent?.id || Date.now(),
      title: title.trim(),
      content: content.trim(),
      type: type,
      author: author.trim(),
      publishDate: new Date().toLocaleDateString('ar-EG'),
    };

    addOrUpdate(savedContent);
    navigation.goBack();
  };

  const handleFileUpload = () => {
    // TODO: Implement file upload functionality for images/videos
    Alert.alert('قريباً', 'سيتم إضافة ميزة رفع الملفات قريباً');
  };

  return (
    <ScreenWithDrawer title={editingContent ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}>
      <View style={styles.container}>
        <Text style={styles.label}>عنوان المحتوى *</Text>
        <TextInput
          style={styles.input}
          placeholder="اكتب عنوان المحتوى"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>نوع المحتوى *</Text>
        <DropDownPicker
          open={open}
          value={type}
          items={typeItems}
          setOpen={setOpen}
          setValue={setType}
          setItems={setTypeItems}
          placeholder="اختر نوع المحتوى"
          zIndex={3000}
          zIndexInverse={1000}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {type === 'صورة' || type === 'فيديو' ? (
          <View style={styles.fileSection}>
            <Text style={styles.label}>رفع الملف</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleFileUpload}>
              <Ionicons name="cloud-upload" size={20} color={primary} />
              <Text style={styles.uploadText}>اختر ملف</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={styles.label}>المحتوى/الوصف *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="اكتب المحتوى أو وصف المادة التثقيفية"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
        />

        <Text style={styles.label}>اسم المؤلف</Text>
        <TextInput
          style={styles.input}
          placeholder="اسم المؤلف"
          value={author}
          onChangeText={setAuthor}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name="checkmark" size={20} color="#fff" style={{ marginEnd: 4 }} />
          <Text style={styles.saveText}>
            {editingContent ? 'تحديث المحتوى' : 'نشر المحتوى'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#333" style={{ marginEnd: 4 }} />
          <Text style={styles.backText}>العودة إلى القائمة</Text>
        </TouchableOpacity>
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop:40
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  fileSection: {
    marginBottom: 16,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  uploadText: {
    marginLeft: 8,
    color: primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  backText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EducationalContentFormScreen;
