import { createStackNavigator } from '@react-navigation/stack';
import Patients from '../screensDoctor/Patients';
import DataPatientsListScreen from '../screensDoctor/SearchDataPatientSecreen';
import PatientListScreen from '../screensDoctor/PatientListScreen';
import Medications from '../screensDoctor/Medications';
import EvaluationVisitScreen from '../screensDoctor/EvaluationVisitScreen';
import PatientChartScreen from '../screensDoctor/PatientChartScreen';

const Stack = createStackNavigator();

const PatientsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Patients" component={Patients} options={{ headerShown: false }} />
      <Stack.Screen name="DataPatientsListScreen" component={DataPatientsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PatientListScreen" component={PatientListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Medications" component={Medications} />
      <Stack.Screen name="EvaluationVisitScreen" component={EvaluationVisitScreen} />  
      <Stack.Screen name="PatientChartScreen" component={PatientChartScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PatientsStack" component={PatientsStack} options={{ headerShown: false }} />
      

      
    </Stack.Navigator>
  );
};

export default PatientsStack;
