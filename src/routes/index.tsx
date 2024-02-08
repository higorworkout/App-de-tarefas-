import { NavigationContainer } from '@react-navigation/native';
import DrawNavigator from './DrawNavigator'

export default function Routes() {
    return (
       <NavigationContainer>
          <DrawNavigator /> 
       </NavigationContainer> 
    )
}