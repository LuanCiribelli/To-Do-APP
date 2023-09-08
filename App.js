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

  // Função para adicionar uma nova tarefa
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
    setTask('');
    setTaskItems(updatedTasks);
  };

  // Função para marcar ou desmarcar uma tarefa como em edição
  const handleToggleEdit = (taskId) => {
    setTaskItems((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
      )
    );
  };

  // Função para marcar ou desmarcar uma tarefa como concluída
  const handleToggleCheckbox = (taskId) => {
    setTaskItems((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, checked: !task.checked } : task
      )
    );
  };

  // Função para concluir e remover uma tarefa
  const completeTaskById = (taskId) => {
    setTaskItems((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
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
    // Salva as tarefas no armazenamento ao serem atualizadas
    storeData(taskItems);
  }, [taskItems]);

  useEffect(() => {
    // Recupera tarefas do armazenamento ao carregar o aplicativo
    const fetchData = async () => {
      try {
        const data = await getData();
        if (data) setTaskItems(data);
      } catch (error) {
        console.error("Erro ao buscar dados do AsyncStorage: ", error);
      }
    };
    fetchData();
  }, []);

  // Renderização da interface de usuário
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.taskWrapper}>
          <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
          <View style={styles.items}>
            {taskItems.map((item) => (
              <Task
                key={item.id}
                task={item}
                completeEditingTask={completeEditingTask}
                completeTaskById={completeTaskById}
                toggleEdit={() => handleToggleEdit(item.id)}
                toggleCheckbox={() => handleToggleCheckbox(item.id)}
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
});
