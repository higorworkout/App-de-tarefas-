import React, { Component, useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity, Platform } from 'react-native';
import todayImage from '../../assets/imgs/today.jpg';
import tomorrowImage from '../../assets/imgs/tomorrow.jpg';
import weekImage from '../../assets/imgs/week.jpg';
import monthImage from '../../assets/imgs/month.jpg';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AddTask from './AddTask';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { server, showError } from '../common';


/* -------------------- State inicial das tasks ------------------*/
type taskInicial = [{
    tasks: [
        {
            id: number,
            desc: string,
            estimateAt: Date,
            doneAt: Date
        }
    ]
},
{
    showDoneTasks: number,
    showAddTask: boolean,
    visibleTasks: []
}

]

const tasksInicial: taskInicial = [{
    tasks: []
     },
    {
        showDoneTasks: true,
        showAddTask: false,
        visibleTasks: []
    }

]

/*------------------------------------------------------*/

export default props => {
    const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
    const [tasks, setTasks] = useState(tasksInicial);

/* ---------------------------- useEffect ----------------------*/

useEffect(() => {
    async function storageData() {
        const stateString = await AsyncStorage.getItem('tasks');
        const state = JSON.parse(stateString) || tasksInicial;
        const taskState = [...tasks];
        taskState[1].showDoneTasks = state.showDoneTasks;
        setTasks(taskState);
        loadTasks();
    }
   
    storageData()

    return () => {
        setTasks([]);
    }

},[])

/* Api access */

const loadTasks = async () => {
    try {
        const maxDate = moment().add({ days: props.daysAhead}).format('YYYY-MM-DD 23:59:59')
        const res = await axios.get(`${server}/tasks?date=${maxDate}`)
        
        const taskState = [...tasks];
        taskState[0].tasks = res.data;
        setTasks(taskState, filterTask())
    }catch(e) {
        showError(e);
    }
}

/* -----------     Methods   ----------------*/
/* -------------------- Switch de toggle ------------------*/
    const toggleTask = async (taskId) => {

        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            await loadTasks()
        } catch(e) {
            showError(e)
        }
    }

   

/* ---------------------------------------------------------*/

/* -------------------- Filter toggle ------------------*/

    const toggleFilter = () => {
        const toggle = [...tasks];
        toggle[1].showDoneTasks = !toggle[1].showDoneTasks

        setTasks(toggle, filterTask())

    }

/* --------------------------------------------------------*/
/*  -------------------------- filtro de tarefas -------------- */
    const filterTask = () => {
        let visibleTasks;

        if(tasks[1].showDoneTasks) {
            visibleTasks = [...tasks];
            setTasks(visibleTasks)
        } else {
            const visibleTasks = [...tasks] 
            const pending = task => task.doneAt === null
            let filter = visibleTasks[0].tasks.filter(pending)
            visibleTasks[1].visibleTasks = []
            visibleTasks[1].visibleTasks.push(filter)
            setTasks(visibleTasks)

            AsyncStorage.setItem('tasks', JSON.stringify({
                showDoneTasks: tasks[1].showDoneTasks
            }))
        }

    }
/* ------------------------------------------------------------ */
  let CancelModal = () => {
     const flagTask = [...tasks]
     flagTask[1].showAddTask = false;
     setTasks(flagTask);
  }


/* ------------------ Show Modal --------------------------------*/

const changeShowAddTask = () => {
    const state = [...tasks];
    state[1].showAddTask = true;

    setTasks(state);
}

/* ----------------------- Add new task --------------------------*/

const addTask = async newTask => {
    if(!newTask.desc || !newTask.desc.trim()) {
        Alert.alert('Dados Inválidos', 'Descrição não informada!')
        return
    }

    try {
        await axios.post(`${server}/tasks`, {
            desc: newTask.desc,
            estimateAt: newTask.date
        })

        const stateTask = [...tasks];
        stateTask[1].showAddTask = false 
        setTasks(stateTask, loadTasks());

    } catch(e) {
        showError(e)
    }

}



/* -------------------------- deleteTask ------------------------ */
const deleteTask = async taskId => {

    try {
        await axios.delete(`${server}/tasks/${taskId}`)
        loadTasks();
    }catch(e) {
        showError(e)
    }
}

/* switch image */

const getImage = () => {
    switch(props.daysAhead) {
        case 0: return todayImage
        case 1: return tomorrowImage
        case 7: return weekImage
        default: return monthImage
    }
}
const getColor = () => {
    switch(props.daysAhead) {
        case 0: return commonStyles.colors.today
        case 1: return commonStyles.colors.tomorrow
        case 7: return commonStyles.colors.week
        default: return commonStyles.colors.month
    }
}

    return (
        <View style={styles.container}>
            <AddTask 
            isVisible={tasks[1].showAddTask} 
            onCancel={() => CancelModal()}
            onSave={addTask}
            />
            <ImageBackground source={getImage()}
                style={styles.background}
            >
            
                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                        <FontAwesome 
                            name='bars'
                            size={20} 
                            color={commonStyles.colors.secondary} >
                        </FontAwesome>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleFilter}>
                        <FontAwesome 
                            name={tasks[1].showDoneTasks ? 'eye' : 'eye-slash'}
                            size={20} 
                            color={commonStyles.colors.secondary} >
                        </FontAwesome>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleBar}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.subtitle}>{today}</Text>
                </View>
            </ImageBackground>
            <View style={styles.taskContainer}>
                 <FlatList 
                    data={tasks[1].showDoneTasks ? tasks[0].tasks :tasks[1].visibleTasks[0] }
                    keyExtractor={item => `${item.id}`}
                    renderItem={({item}) => <Task {...item} 
                    toggleTask={toggleTask} 
                    onDelete={deleteTask}
                    onToggleTask={deleteTask}
                    />}
                 />
            </View>
            <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: getColor()}]}
                onPress={changeShowAddTask}
                activeOpacity={0.7}
            >
                <FontAwesome 
                    name="plus"
                    size={20} 
                    color={commonStyles.colors.secondary} >
                </FontAwesome>
            </TouchableOpacity>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        flex: 3
    },
    taskContainer: {
        flex: 7
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 20
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: 50
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    }
  });