// navigation/CustomDrawerContent.js
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import Logout from '../Login/logout'

export default function CustomDrawerContent(props) {
  const navigation = useNavigation();


  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      <DrawerItem
        label="تسجيل الخروج"
        onPress={()=>Logout(navigation)}
        icon={({ size, color }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
      />
    </DrawerContentScrollView>
  );
}
