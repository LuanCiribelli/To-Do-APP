import React, { useState, useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import Task from './components/Task';
import { storePendingTasks, getPendingTasks, storeCompletedTasks, getCompletedTasks } from './components/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AppStyles as styles } from './components/UI/AppStyles';
import COLORS from './components/UI/colors';



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
            <Icon name="plus" size={20} color={COLORS.text} />
          </View>
      </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

// Estilos
const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

