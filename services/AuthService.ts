import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewUser, findUserByPhone, setUserPassword, userExists, validatePassword } from '../data/demoUsers';

export interface User {
  id: string;
  phone: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  phone: string;
  password: string;
}

const STORAGE_KEYS = {
  AUTH_STATE: '@auth_state',
  USER_DATA: '@user_data',
} as const;

export class AuthService {
  private static instance: AuthService;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Проверяет, авторизован ли пользователь
   */
  public async isUserLoggedIn(): Promise<boolean> {
    try {
      const authState = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      if (!authState) return false;
      
      const parsed: AuthState = JSON.parse(authState);
      return parsed.isLoggedIn && parsed.user !== null;
    } catch (error) {
      console.error('Error checking auth state:', error);
      return false;
    }
  }

  /**
   * Получает данные текущего пользователя
   */
  public async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!userData) return null;
      
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Авторизация пользователя
   */
  public async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Валидация формата
      if (!credentials.phone || credentials.phone.length < 10) {
        return { success: false, error: 'Invalid phone number format' };
      }
      
      if (credentials.password.length < 6) {
        return { success: false, error: 'Password must contain at least 6 characters' };
      }

      // Проверяем, существует ли пользователь с таким номером
      const existingUser = findUserByPhone(credentials.phone);
      if (!existingUser) {
        return { success: false, error: 'User with this phone number not found' };
      }

      // Проверяем пароль
      const isPasswordValid = validatePassword(credentials.phone, credentials.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Incorrect password' };
      }

      // Обновляем время последнего входа
      const updatedUser: User = {
        ...existingUser,
        lastLoginAt: new Date().toISOString(),
      };

      // Сохраняем данные
      await this.saveUserData(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login system error' };
    }
  }

  /**
   * Регистрация пользователя
   */
  public async register(credentials: RegisterCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Валидация
      if (!credentials.phone || credentials.phone.length < 10) {
        return { success: false, error: 'Invalid phone number format' };
      }
      
      if (credentials.password.length < 6) {
        return { success: false, error: 'Password must contain at least 6 characters' };
      }
      
      if (!credentials.name.trim()) {
        return { success: false, error: 'Please enter your name' };
      }

      // Проверяем, не существует ли уже пользователь с таким номером
      if (userExists(credentials.phone)) {
        return { success: false, error: 'User with this phone number already exists' };
      }

      // Создаем нового пользователя
      const user = createNewUser(credentials.name, credentials.phone);
      
      // Сохраняем пароль
      setUserPassword(credentials.phone, credentials.password);

      // Сохраняем данные в AsyncStorage
      await this.saveUserData(user);
      
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration system error' };
    }
  }

  /**
   * Выход из системы
   */
  public async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_STATE, STORAGE_KEYS.USER_DATA]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Сохранение данных пользователя
   */
  private async saveUserData(user: User): Promise<void> {
    const authState: AuthState = {
      isLoggedIn: true,
      user: user,
    };

    await AsyncStorage.multiSet([
      [STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState)],
      [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
    ]);
  }

  /**
   * Обновление данных пользователя
   */
  public async updateUser(userData: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      const updatedUser: User = {
        ...currentUser,
        ...userData,
        lastLoginAt: new Date().toISOString(),
      };

      await this.saveUserData(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: 'Profile update error' };
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();
