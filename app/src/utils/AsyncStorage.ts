import AsyncStorage from '@react-native-community/async-storage';

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    console.error('getData -> e', e);
  }
};

export const storeData = async (key: string, data: object | string) => {
  try {
    if (typeof data === 'object') {
      const jsonData = JSON.stringify(data);
      return await AsyncStorage.setItem(key, jsonData);
    }
    return await AsyncStorage.setItem(key, data);
  } catch (e) {
    console.error('storeData -> e', e);
  }
};

export const APP_OPENED_TIMES_KEY = 'appOpenedTimes';
