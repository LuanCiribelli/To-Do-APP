import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Dimensions
} from 'react-native';
import Task from './components/Task';
import { storeData, getData } from './components/storage';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  // Event Handlers
  const handleAddTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      isEditing: false,
      checked: false
    };
    const updatedTasks = [...taskItems, newTask];

    Keyboard.dismiss();
    setTaskItems(updatedTasks);
    storeData(updatedTasks);
    setTask('');
  };

  const updateTaskItems = (callback) => {
    const updatedTasks = callback(taskItems);
    setTaskItems(updatedTasks);
    storeData(updatedTasks);
  };

  const completeTaskById = (taskId) => {
    updateTaskItems(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const togglePropertyById = (taskId, property) => {
    updateTaskItems(prevTasks =>
      prevTasks.map(task => task.id === taskId ? { ...task, [property]: !task[property] } : task)
    );
  };

  const completeEditingTask = (taskId, newText) => {
    updateTaskItems(prevTasks =>
      prevTasks.map(task => task.id === taskId ? { ...task, text: newText, isEditing: false } : task)
    );
  };

  // Fetch Data
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

  // JSX
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>Tarefas De hoje</Text>
          <View style={styles.items}>
            {taskItems.map((item, index) => (
              <Task
                key={index}
                task={item}
                toggleEdit={() => togglePropertyById(item.id, 'isEditing')}
                completeEditingTask={completeEditingTask}
                toggleCheckbox={() => togglePropertyById(item.id, 'checked')}
                completeTaskById={completeTaskById}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>
        <TextInput style={styles.input} placeholder={'Escreva uma tarefa'} value={task} onChangeText={setTask} />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

// Styles
const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

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






