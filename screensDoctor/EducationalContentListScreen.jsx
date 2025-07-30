// Developed by Sami
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWithDrawer from './ScreenWithDrawer';
import { EducationalContentContext } from '../contexts/EducationalContentContext';

const primary = '#00b29c';

const EducationalContentListScreen = () => {
  const navigation = useNavigation();
  const { items, remove } = useContext(EducationalContentContext);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'مقال': return 'document-text';
      case 'فيديو': return 'videocam';
      case 'صورة': return 'image';
      default: return 'document';
    }
  };

  const handleDelete = (post) => {
    Alert.alert(
      'حذف المحتوى',
      `هل أنت متأكد من حذف "${post.title}"?،\n\nلن يمكن استرجاع هذا المحتوى بعد الحذف.`,
      [
        {
          text: 'إلغاء',
          style: 'cancel'
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            remove(post.id);
            Alert.alert('تم الحذف', 'تم حذف المحتوى بنجاح');
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={20} color="#fff" />
          </View>
          <View>
            <Text style={styles.authorName}>{item.author}</Text>
            <Text style={styles.postDate}>{item.publishDate}</Text>
          </View>
        </View>
        <View style={styles.typeTag}>
          <Ionicons name={getTypeIcon(item.type)} size={16} color={primary} />
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postText}>{item.content}</Text>
        
        {/* Media placeholder for images/videos */}
        {(item.type === 'صورة' || item.type === 'فيديو') && (
          <View style={styles.mediaPlaceholder}>
            <Ionicons 
              name={item.type === 'صورة' ? 'image' : 'play-circle'} 
              size={40} 
              color={primary} 
            />
            <Text style={styles.mediaText}>
              {item.type === 'صورة' ? 'صورة توضيحية' : 'فيديو تعليمي'}
            </Text>
          </View>
        )}
      </View>

      {/* Admin Actions */}
      <View style={styles.adminActions}>
        <TouchableOpacity 
          style={styles.adminBtn}
          onPress={() => navigation.navigate('EducationalContentForm', { content: item })}
        >
          <Ionicons name="create" size={18} color="#ff9800" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.adminBtn}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={18} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenWithDrawer title="المحتوى الثقافي">
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('EducationalContentForm')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={20} color="#fff" style={{ marginEnd: 4 }} />
        <Text style={styles.addText}>إضافة محتوى جديد</Text>
      </TouchableOpacity>
      
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>لا يوجد محتوى ثقافي حالياً</Text>}
        contentContainerStyle={items.length ? undefined : styles.emptyContainer}
      />
      </ScreenWithDrawer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: primary,
    marginStart: 4,
    fontWeight: '600',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  postText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaPlaceholder: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  mediaText: {
    fontSize: 14,
    color: primary,
    marginTop: 8,
    fontWeight: '600',
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  adminBtn: {
    padding: 8,
    marginStart: 8,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#666',
  },
});

export default EducationalContentListScreen;
