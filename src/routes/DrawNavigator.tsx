import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './StackNavigator'
import TaskList from '../screens/TaskList';
import Menu from '../screens/Menu';
import CommonStyles from '../commonStyles';



const Drawer = createDrawerNavigator();

export default function DrawNavigator() {
    return (
            <Drawer.Navigator 
            screenOptions={{
                drawerLabelStyle: {
                    fontFamily: CommonStyles.fontFamily,
                    fontWeight: 'normal',
                    fontSize: 20
                },
                drawerActiveTintColor: '#080',
                headerShown: false
            }} initialRouteName="Today"
            >
                <Drawer.Screen 
                    name="Today" 
                    component={StackNavigator}  
                    options={{
                        drawerLabel: 'Today'
                    }}
                />
             
                <Drawer.Screen 
                    name="Tomorrow"  
                    options={{
                        drawerLabel: 'Tomorrow'
                    }}
                >
                    {props => (
                        <TaskList {...props} title="Amanhã" daysAhead={1} />
                    )}
                </Drawer.Screen>
                <Drawer.Screen 
                    name="Week"  
                    options={{
                        drawerLabel: 'Week'
                    }}
                >
                    {props => (
                        <TaskList {...props} title="Semana" daysAhead={7} />
                    )}
                </Drawer.Screen>
                <Drawer.Screen 
                    name="Month"  
                    options={{
                        drawerLabel: 'Month'
                    }}
                >
                    {props => (
                        <TaskList {...props} title="Mês" daysAhead={30} />
                    )}
                </Drawer.Screen>
            </Drawer.Navigator>
    )
} 