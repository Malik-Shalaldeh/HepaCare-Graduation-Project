import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const primary = '#00b29c';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          navigation.navigate('اعادة تعيين كلمة المرور');
        }}
      >
        <Ionicons name="key-outline" size={28} color={primary} />
        <Text style={styles.itemText}>إعادة تعيين كلمة المرور</Text>
        <Ionicons name="chevron-forward" size={24} color="#999" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  item: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  itemText: {
    flex: 1,
    marginStart: 15,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
