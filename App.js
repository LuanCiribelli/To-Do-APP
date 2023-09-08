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
import { storePendingTasks, getPendingTasks, storeCompletedTasks, getCompletedTasks } from './components/storage';

export default function App() {
  const [task, setTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
  const [completeTaskItems, setCompleteTaskItems] = useState([]);

  // Função para adicionar uma nova tarefa
  const handleAddTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      isEditing: false,
      checked: false
    };
    
    setTaskItems(prev => [...prev, newTask]);
    setTask('');
    Keyboard.dismiss();
  };

  const handleToggleEdit = (taskId) => {
    setTaskItems(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
      )
    );
  };

  const handleToggleCheckbox = (taskId) => {
    setTaskItems((prevTasks) => {
      const taskToToggle = prevTasks.find(t => t.id === taskId);
      
      // Se a tarefa estiver sendo marcada como concluída
      if (taskToToggle && !taskToToggle.checked) {
        setCompleteTaskItems((prevComplete) => [...prevComplete, { ...taskToToggle, checked: true }]);
        return prevTasks.filter(task => task.id !== taskId);
      }
  
      return prevTasks.map(task => task.id === taskId ? { ...task, checked: !task.checked } : task);
    });
  
    setCompleteTaskItems((prevComplete) => {
      const taskToToggle = prevComplete.find(t => t.id === taskId);
      
      if (taskToToggle) {
        setTaskItems((prevTasks) => [...prevTasks, { ...taskToToggle, checked: false }]);
        return prevComplete.filter(task => task.id !== taskId);
      }
  
      return prevComplete;
    });
  };
  


  const toggleFilter = () => {
    setShowCompleted(prevState => !prevState);
  };

  // Função para concluir e remover uma tarefa
  const completeTaskById = (taskId) => {
    const taskToComplete = taskItems.find(t => t.id === taskId);
    if (taskToComplete) {
      setCompleteTaskItems([...completeTaskItems, taskToComplete]);
      setTaskItems((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } else {
      console.warn('Task not found with ID:', taskId);
    }
  };
  // Função para concluir a edição de uma tarefa
  const completeEditingTask = (taskId, newText) => {
    setTaskItems((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, text: newText, isEditing: false } : task
      )
    );
  };

  useEffect(() => {
    storePendingTasks(taskItems);
    storeCompletedTasks(completeTaskItems);
}, [taskItems, completeTaskItems]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const pendingData = await getPendingTasks();
      const completedData = await getCompletedTasks();
      if (pendingData) setTaskItems(pendingData);
      if (completedData) setCompleteTaskItems(completedData);
    } catch (error) {
      console.error("Erro ao buscar dados do AsyncStorage: ", error);
    }
  };
  fetchData();
}, []);

  const tasksToRender = showCompleted ? completeTaskItems : taskItems.filter(task => !task.checked);

  // Renderização da interface de usuário
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
          <TouchableOpacity
            style={[styles.filtro, { backgroundColor: showCompleted ? 'green' : 'white' }]}
            onPress={toggleFilter}
          >
            <Text style={{ color: showCompleted ? 'white' : 'green' }}>
              {showCompleted ? 'Concluídas' : 'Pendentes'}
            </Text>
          </TouchableOpacity>

          <View style={styles.items}>
            {tasksToRender.map((item) => (
              <Task
                key={item.id}
                task={item}
                completeEditingTask={completeEditingTask}
                completeTaskById={completeTaskById}
                toggleEdit={() => handleToggleEdit(item.id)}
                toggleCheckbox={() => handleToggleCheckbox(item.id)}
                completeTaskItems={completeTaskItems}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={'Escreva uma tarefa'}
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

// Estilos
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
  filtro: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  }

});
