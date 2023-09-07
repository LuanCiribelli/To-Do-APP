import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@tasks';

export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(TASKS_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving to AsyncStorage: ", e);
    throw e;  
  }
}

export const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(TASKS_KEY);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Error fetching from AsyncStorage: ", e);
    throw e;  
  }
}
