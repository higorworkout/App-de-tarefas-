import React, { useState } from 'react';
import { 
    Modal, 
    View, 
    StyleSheet, 
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    TouchableWithoutFeedback } from 'react-native';
import commonStyles from '../commonStyles';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'

const initialState = {
    desc: '',
    date: new Date(),
    showDatePicker: false
}

export default props => {
    const [taskDesc, setTaskDesc] = useState(initialState)

    const save = () => {
        const newTask = {
            desc: taskDesc.desc,
            date: taskDesc.date
        }

        props.onSave && props.onSave(newTask)
        setTaskDesc({...initialState})

    }
    

    const getDatePicker = () => {
        let datePicker = <DateTimePicker value={taskDesc.date}
                onChange={(_,date) => setTaskDesc({...taskDesc, date, showDatePicker: false})}
                mode='date'
             />

        const dateString = moment(taskDesc.date).format('ddd, D [de] MMMM [de] YYYY')
        
         if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => setTaskDesc((td) => ({...td, showDatePicker: true}))}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {taskDesc.showDatePicker && datePicker}
                </View>
            )

            return datePicker;
         }  
    }

    return (
        <Modal
            transparent={true}
            visible={props.isVisible}
            onRequestClose={props.onCancel}
            animationType='slide'
        >
            <TouchableWithoutFeedback
                onPress={props.onCancel}
            >
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
            <View style={styles.container}>
                <Text style={styles.header}>Nova Tarefa</Text>
                <TextInput style={styles.input}
                    placeholder="Informe a Descrição"
                    value={taskDesc.desc}
                    onChangeText={desc => setTaskDesc((td) => ({...td, desc}))}
                 />
                 {getDatePicker()}
                <View style={styles.buttons}>
                    <TouchableOpacity onPress={props.onCancel}>
                        <Text style={styles.button}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={save}>
                        <Text style={styles.button}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableWithoutFeedback
                onPress={props.onCancel}
            >
                <View style={styles.background}></View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        backgroundColor: '#fff'
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 15
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today
    },
    date: {
       fontFamily: commonStyles.fontFamily,
       fontSize: 20,
       marginLeft: 15
    }
})