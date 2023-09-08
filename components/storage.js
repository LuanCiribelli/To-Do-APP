import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para tarefas pendentes
const PENDING_TASKS_KEY = '@pending_tasks';
// Chave para tarefas concluídas
const COMPLETED_TASKS_KEY = '@completed_tasks';

// Salva as tarefas pendentes
export const storePendingTasks = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(PENDING_TASKS_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar tarefas pendentes: ", e);
  }
};

// Armazena as tarefas concluídas
export const storeCompletedTasks = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(COMPLETED_TASKS_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar tarefas concluídas: ", e);
  }
};

// Recupera tarefas pendentes
export const getPendingTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(PENDING_TASKS_KEY);
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao buscar tarefas pendentes do AsyncStorage: ", e);
    throw e;
  }
};

// Recupera tarefas concluídas
export const getCompletedTasks = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(COMPLETED_TASKS_KEY);
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao buscar tarefas concluídas do AsyncStorage: ", e);
    throw e;
  }
};
