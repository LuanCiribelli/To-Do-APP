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
import { SwipeListView } from 'react-native-swipe-list-view';
import * as Animatable from 'react-native-animatable';

export default function App() {
  const [task, setTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
  const [completeTaskItems, setCompleteTaskItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchExpanded, setSearchExpanded] = useState(false);

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
    if (showCompleted) {
      // Task is currently in the completed list and needs to be moved back to pending.
      const taskToMove = completeTaskItems.find(t => t.id === taskId);
      if (taskToMove) {
        setTaskItems(prev => [...prev, { ...taskToMove, checked: false }]);
        setCompleteTaskItems(prev => prev.filter(task => task.id !== taskId));
      }
    } else {
      // Task is currently in the pending list and needs to be moved to completed.
      const taskToMove = taskItems.find(t => t.id === taskId);
      if (taskToMove) {
        setCompleteTaskItems(prev => [...prev, { ...taskToMove, checked: true }]);
        setTaskItems(prev => prev.filter(task => task.id !== taskId));
      }
    }
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

  // When taskItems or completeTaskItems changes, store them in AsyncStorage
  useEffect(() => {
    storePendingTasks(taskItems);
    storeCompletedTasks(completeTaskItems);
  }, [taskItems, completeTaskItems]);

  // Fetch tasks from AsyncStorage when the component mounts
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


  const handleSearchClick = () => {
    setSearchExpanded(!isSearchExpanded);
  };

  // Determine which tasks to render based on filters and search term
  const tasksToRender = React.useMemo(() => {
    let filteredTasks = showCompleted ? completeTaskItems : taskItems.filter(task => !task.checked);

    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filteredTasks.length === 0) {
      if (searchTerm) {
        return [{ id: 'search-empty', text: 'There is no task with the searched name.', isEmptyState: true }];
      } else if (showCompleted) {
        return [{ id: 'completed-empty', text: 'There are no completed tasks.', isEmptyState: true }];
      } else {
        return [{ id: 'tasks-empty', text: "There isn't any task created yet. Try to create one by clicking on the '+' button.", isEmptyState: true }];
      }
    }

    return filteredTasks;
  }, [showCompleted, taskItems, completeTaskItems, searchTerm]);

  // Renderização da interface de usuário
  return (
    <View style={styles.container}>
      <View style={styles.taskWrapper}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
          <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
          <TouchableOpacity onPress={toggleFilter}>
            <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>
              {showCompleted ? 'Show Pending' : 'Show Completed'}
            </Text>
          </TouchableOpacity>
        </View>

        {isSearchExpanded ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchTerm}
              onChangeText={text => setSearchTerm(text)}
            />
            <TouchableOpacity onPress={handleSearchClick}>
              <Icon name="search" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleSearchClick}>
         
            <Icon name="search" size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}


        <SwipeListView
          data={tasksToRender}
          renderItem={(data, rowMap) => {
            if (data.item.isEmptyState) {
              return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: windowHeight - 200 }}>
                  <Text style={styles.emptyStateMessage}>{data.item.text}</Text>
                </View>
              );
            }
            return (
              <Task
                key={data.item.id}
                task={data.item}
                completeEditingTask={completeEditingTask}
                toggleEdit={() => handleToggleEdit(data.item.id)}
                toggleCheckbox={() => handleToggleCheckbox(data.item.id)}
                completeTaskItems={completeTaskItems}
              />
            );
          }}
          renderHiddenItem={(data, rowMap) => {
            if (data.item.isEmptyState) return null;  // Return null for empty state items

            return (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnRight]}
                  onPress={() => {
                    if (showCompleted) {
                      setCompleteTaskItems(prevTasks => prevTasks.filter(task => task.id !== data.item.id));
                    } else {
                      setTaskItems(prevTasks => prevTasks.filter(task => task.id !== data.item.id));
                    }
                  }}>
                  <Text style={styles.backTextWhite}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          rightOpenValue={-75}
        />
      </View>

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
            <Icon name="plus-circle" size={24} color={COLORS.text} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );

}

// Estilos
const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

