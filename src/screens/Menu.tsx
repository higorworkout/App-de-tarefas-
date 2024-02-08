import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { DrawerItems } from 'react-navigation-drawer';
import { Gravatar } from 'react-native-gravatar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default props => {
    const logout = () => {
        delete axios.defaults.headers.common['Authorization'];
        AsyncStorage.removeItem('userData');
        props.navigation.navigate('AuthOrApp');
    }
    // const optionsGravatar = {
    //     email: props.navigation.getParam('email'),
    //     secure: true
    // }
    return (
        <ScrollView>
            <View style={styles.header}>
                {/* <Gravatar style={styles.avatar}
                    options={optionsGravatar}
                /> */}
            <TouchableOpacity onPress={logout}>
                <View style={styles.logoutIcon}>
                    <Icon name="sign-out" size={30} color='#800'/>
                </View>
            </TouchableOpacity>
            </View>
            {/* <DrawerItems {...props} /> */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#ddd'
    },
    avatar: {
        width: 60,
        height: 60
    },
    logoutIcon: {
        marginLeft: 10,
        marginBottom: 10,
    }
})