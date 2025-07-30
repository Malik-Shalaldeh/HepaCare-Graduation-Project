// screens/ResetPasswordScreen.jsx
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
     {/* زر الرجوع */}
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
        <Ionicons name='arrow-back' size={24} color={"#000"} />
    </TouchableOpacity>
      
      <Text>تغيير كلمة المرور</Text>
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default ResetPasswordScreen;
