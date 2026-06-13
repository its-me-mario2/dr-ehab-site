import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'dr_ehab_token';
const USER_KEY = 'dr_ehab_user';

let cachedToken = null;
let cachedUser = null;

export async function loadAuth() {
  try {
    cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
    const userStr = await AsyncStorage.getItem(USER_KEY);
    cachedUser = userStr ? JSON.parse(userStr) : null;
  } catch {
    cachedToken = null;
    cachedUser = null;
  }
}

export function getToken() { return cachedToken; }
export function getUser() { return cachedUser; }

export async function setAuth(token, user) {
  cachedToken = token;
  cachedUser = user;
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuth() {
  cachedToken = null;
  cachedUser = null;
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}
