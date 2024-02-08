import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskList from '../screens/TaskList';
import Auth from '../screens/Auth';
import AuthOrApp from '../screens/AuthOrApp';


const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
            <Stack.Navigator >
                <Stack.Screen name="AuthOrApp" component={AuthOrApp} options={{ headerShown: false}}/>
                <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false}}/>
                <Stack.Screen name="TaskList" options={{ headerShown: false}}>
                    {props => (
                        <TaskList {...props} title="Hoje" daysAhead={0} />
                    )}
                </Stack.Screen>
            </Stack.Navigator>
    )
}

