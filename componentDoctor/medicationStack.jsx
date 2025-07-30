
const { createStackNavigator } = require("@react-navigation/stack")
import Medications from '../screensDoctor/Medications';
import Medicationschedule from '../screensDoctor/Medicationschedule';
import HealthMedicationsDisplay from '../screensDoctor/HealthMedicationsDisplay';



const Stack = createStackNavigator();

const MedicationsStackScreen=()=>{
  return(
      <Stack.Navigator initialRouteName="Medications">
        <Stack.Screen component={Medications}  name="Medications" options={{headerShown:false}}/>
        <Stack.Screen component={Medicationschedule}  name="Medicationschedule" options={{headerShown:false}} />
        <Stack.Screen component={HealthMedicationsDisplay}  name="HealthMedicationsDisplay" options={{headerShown:false}} />
      </Stack.Navigator>

)}

export default MedicationsStackScreen;

