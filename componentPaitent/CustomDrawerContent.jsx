// navigation/CustomDrawerContent.js
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "تسجيل الخروج",
      "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تسجيل خروج",
          onPress: () => navigation.replace("Login"),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <DrawerItem
        label="تسجيل الخروج"
        onPress={handleLogout}
        icon={({ size, color }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
      />
    </DrawerContentScrollView>
  );
}
