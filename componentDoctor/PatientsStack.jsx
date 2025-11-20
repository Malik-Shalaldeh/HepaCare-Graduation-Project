import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";
import Patients from "../screensDoctor/Patients";
import DataPatientsListScreen from "../screensDoctor/SearchDataPatientSecreen";
import PatientListScreen from "../screensDoctor/PatientListScreen";
import Medications from "../screensDoctor/Medications";
import EvaluationVisitScreen from "../screensDoctor/EvaluationVisitScreen";
import PatientChartScreen from "../screensDoctor/PatientChartScreen";
import AddPatientStack from "./AddPatientStack";
import theme, {colors} from "../style/theme";
import SymptomStack from "./SymptomStack";

const Stack = createStackNavigator();
const primary = colors.primary;

const backBtn = (navigation) => (
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={{ paddingHorizontal: 12 }}
  >
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>
);

export default function PatientsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
         headerBackTitleVisible: false,
          headerStyle: {
          backgroundColor: theme.colors.primary,          //  لون الهيدر 
        },
        headerTintColor: theme.colors.buttonPrimaryText,  // لون النص والأيقونة (زر الرجوع)
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.headingSm,
        },
      }}

      
    >
      <Stack.Screen
        name="Patients"
        component={Patients}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="PatientListScreen"
        component={PatientListScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "البحث عن سجل مريض",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: primary },
          headerTintColor: "#fff",
          headerLeft: () => backBtn(navigation),
        })}
      />

      <Stack.Screen
        name="DataPatientsListScreen"
        component={DataPatientsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchDataPatientSecreen"
        component={DataPatientsListScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="إضافة مريض"
        component={AddPatientStack}
        options={{
          headerShown: false, // الهيدر من AddPatientStack
        }}
      />

      <Stack.Screen name="Medications" component={Medications} />
      <Stack.Screen
        name="EvaluationVisitScreen"
        component={EvaluationVisitScreen}
      />
      <Stack.Screen
        name="PatientChartScreen"
        component={PatientChartScreen}
        options={{
          title: "تطور المؤشرات المخبرية للمريض", 
        }}
      />

      <Stack.Screen
        name="تتبع الأعراض"
        component={SymptomStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
