import { createStackNavigator } from '@react-navigation/stack';
import Patients from '../screensDoctor/Patients';
import DataPatientsListScreen from '../screensDoctor/SearchDataPatientSecreen';
import PatientListScreen from '../screensDoctor/PatientListScreen';
import Medications from '../screensDoctor/Medications';
import EvaluationVisitScreen from '../screensDoctor/EvaluationVisitScreen';
import ChatScreen from '../screensDoctor/ChatScreen';
import MedicalIndicatorsScreen from '../screensDoctor/MedicalIndicatorsScreen';
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
    
      <Stack.Screen 
        name="ChatScreen" 
        component={ChatScreen} 
        options={{
          headerShown: false // Hide the default header since we're using ChatHeader
        }} 
      />
      
    </Stack.Navigator>
  );
};

export default PatientsStack;
