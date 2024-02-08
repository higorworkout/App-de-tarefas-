import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import commonStyles from '../commonStyles.ts';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default props => {
    
    const doneOrNotStyle = props.doneAt != null ? 
    { textDecorationLine: 'line-through'} : {}
    
    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')
    const id = props.id

    const getRightContent = () => {
        return (
            
                <TouchableOpacity style={styles.right}
                    onPress={() => props.onDelete && props.onDelete(props.id)}
                >
                    <FontAwesome 
                        name="trash"
                        size={30} 
                        color='#FFF' >
                    </FontAwesome>
                </TouchableOpacity>
            
        )
    }

    const getLeftContent = () => {
        return (
            
                <View style={styles.left}>
                    <FontAwesome 
                        name="trash"
                        size={20} 
                        color='#FFF' 
                        style={styles.excludeIcon}    
                    >
                    </FontAwesome>
                    <Text style={styles.excludeText}>Excluir</Text>
                </View>
            
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1}}>
            <Swipeable 
            renderRightActions={getRightContent}
            renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onToggleTask && props.onToggleTask(props.id)}
            >
                <View style={styles.container}>
                    <TouchableWithoutFeedback
                        onPress={() => props.toggleTask(props.id)}
                    >
                        <View style={styles.checkContainer}>
                            {getCheckView(props.doneAt)}
                        </View>
                    </TouchableWithoutFeedback>
                    <View>
                    </View>
                    <View>
                        <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    )
}

function getCheckView(doneAt) {
    if(doneAt != null) {
        return (
            <View style={styles.done}>
                <FontAwesome 
                name='check' 
                size={20} 
                color='#ffff'>
                </FontAwesome>
            </View>
        )
    }else {
        return (
            <View style={styles.pending}></View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
    },
    checkContainer: {
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: '#4d7031',
        justifyContent: 'center',
        alignItems: 'center'
    },

    desc: {
        /* fontFamily: commonStyles.fontFamily, */
        color: commonStyles.colors.mainText,
        fontSize: 15 
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 12 
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },

    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center'
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#ffff',
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
})