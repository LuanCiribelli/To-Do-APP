import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Platform } from 'react-native';
import Task from './components/Task.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { storeData, getData } from './components/storage.js';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  

  const handleAddTask = () => {
    if (task.trim().length === 0) {
      return;
    }

    Keyboard.dismiss();

    const newTask = {
      id: Date.now(),
      text: task,
      isEditing: false,
      checked: false
    };


    setTaskItems([...taskItems, newTask]);
    storeData([...taskItems, newTask]);
    setTask('');
  };


  const completeTaskById = (taskId) => {
    setTaskItems(prevTasks => prevTasks.filter(task => task.id !== taskId));
    itemsCopy= taskItems;
    storeData(itemsCopy);
  };

  const toggleEdit = (taskId) => {
    setTaskItems(prevTasks =>
      [...prevTasks.map(task =>
        task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
      )]
    );
  }

  const completeEditingTask = (taskId, newText) => {
    setTaskItems(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            text: newText,
            isEditing: false
          };
        }
        return { ...task };  
      })
    );
  };
  
  

  const toggleCheckbox = (taskId) => {
    setTaskItems(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        if (data) setTaskItems(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);


  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>Tarefas De hoje</Text>
          <View style={styles.items}>
            {
              taskItems.map((item, index) => {
                return (
                  <Task
                    key={index}
                    task={item}
                    toggleEdit={toggleEdit}
                    completeEditingTask={completeEditingTask}
                    toggleCheckbox={toggleCheckbox}
                    completeTaskById={completeTaskById}
                  />
                )
              })
            }
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Escreva uma tarefa'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
  
}

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  taskWrapper: {
    flex: 1,
    paddingTop: 0.1 * windowHeight,
    paddingHorizontal: 0.05 * windowWidth,
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontSize: 0.05 * windowWidth,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  items: {
    marginTop: 0.03 * windowHeight,
    paddingHorizontal: 0.05 * windowWidth,
  },
  writeTaskWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0.05 * windowWidth,
    position: 'absolute',
    bottom: 0.08 * windowHeight,
    width: '100%',
  },
  input: {
    paddingVertical: 0.02 * windowHeight,
    width: '65%',
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    textAlign: 'center',
  },
  addWrapper: {
    width: 0.15 * windowWidth,
    height: 0.15 * windowWidth,
    backgroundColor: '#FFF',
    borderRadius: 0.075 * windowWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    fontSize: 0.05 * windowWidth,
  },
});
