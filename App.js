import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Platform } from 'react-native';
import Task from './components/Task.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';


export default function App() {

  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);



  const handleAddTask = () => {
    Keyboard.dismiss();

    const newTask = {
      id: Date.now(),  // Usando timestamp como ID para simplicidade
      text: task,
      isEditing: false
    };

    setTaskItems([...taskItems, newTask]);
    storeData([...taskItems, newTask]);
    setTask('');
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
    storeData(itemsCopy);
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@tasks', jsonValue)
    } catch (e) {
      console.error("Erro ao salvar no AsyncStorage: ", e);
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@tasks')
      if (jsonValue !== null) {
        setTaskItems(JSON.parse(jsonValue))
      }
    } catch (e) {
      console.error("Erro ao carregar do AsyncStorage: ", e);
    }
  }
  const startEditingTask = (taskId) => {
    setTaskItems(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isEditing: true } : task
      )
    );
  }

  const toggleEdit = (taskId) => {
    setTaskItems(prevTasks =>
      [...prevTasks.map(task =>
        task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
      )]
    );
  }

  const completeEditingTask = (taskId, newText) => {
    setTaskItems(prevTasks =>
      [...prevTasks.map(task =>
        task.id === taskId ? { ...task, text: newText, isEditing: false } : task
      )]
    );
  }

  useEffect(() => {
    getData();
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

          <Text style={styles.sectionTitle} >Tarefas De hoje</Text>

          <View style={styles.items}>
            {
              taskItems.map((item, index) => {
                return (
                  <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                    <Task
                      task={item}
                      toggleEdit={toggleEdit}
                      completeEditingTask={completeEditingTask}
                    />
                  </TouchableOpacity>
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
  },
  taskWrapper: {
    paddingTop: 0.1 * windowHeight,  // 10% da altura da tela
    paddingHorizontal: 0.05 * windowWidth,  // 5% da largura da tela
  },
  sectionTitle: {
    fontSize: 0.05 * windowWidth,  // Ajuste conforme necessário
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o texto horizontalmente
  },
  items: {
    marginTop: 0.03 * windowHeight,  // 3% da altura da tela
    paddingHorizontal: 0.05 * windowWidth,  // Adiciona padding horizontal
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 0.08 * windowHeight,  // 8% da altura da tela
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Distribui os elementos igualmente na linha
    alignItems: 'center',
    paddingHorizontal: 0.05 * windowWidth,  // Adiciona padding horizontal
  },
  input: {
    paddingVertical: 0.02 * windowHeight,  // 2% da altura da tela
    width: '65%', // Reduziu um pouco a largura para ajustar o padding
    backgroundColor: '#FFF',
    borderRadius: 30,  // Ajuste conforme necessário
    borderColor: '#C0C0C0',
    borderWidth: 1,
    textAlign: 'center',
  },
  addWrapper: {
    width: 0.15 * windowWidth,  // 15% da largura da tela
    height: 0.15 * windowWidth,  // Manter um círculo perfeito
    backgroundColor: '#FFF',
    borderRadius: 0.075 * windowWidth,  // 7.5% da largura da tela
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {
    fontSize: 0.05 * windowWidth,  // Ajuste conforme necessário
  },
});

