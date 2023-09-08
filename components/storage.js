import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@tasks';

/**
 * Armazena os dados fornecidos no AsyncStorage.
 * @param {Array} value - As tarefas a serem armazenadas.
 */
export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar no AsyncStorage: ", e);
    throw e;
  }
};

/**
 * Recupera tarefas do AsyncStorage.
 * @return {Array} As tarefas recuperadas ou uma lista vazia se nenhuma tarefa estiver armazenada.
 */
export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue !== null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Erro ao buscar dados do AsyncStorage: ", e);
    throw e;
  }
};
