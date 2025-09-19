import { User } from '../services/AuthService';

// Демо база данных пользователей
export const demoUsers: User[] = [
  {
    id: 'user_001',
    name: 'Front Maksim',
    phone: '905438549992',
    avatar: undefined,
    createdAt: '2024-01-15T10:30:00.000Z',
    lastLoginAt: '2024-09-18T12:00:00.000Z',
  },
  {
    id: 'user_002', 
    name: 'Emrah Developer',
    phone: '05312496600',
    avatar: undefined,
    createdAt: '2024-02-20T14:45:00.000Z',
    lastLoginAt: '2024-09-17T16:30:00.000Z',
  },
];

// Демо пароли (в реальном приложении должны быть хешированы)
export const demoPasswords: Record<string, string> = {
  '905438549992': '123456', // Front Maksim
  '05312496600': '123456',  // Emrah Developer
};

// Функция для поиска пользователя по номеру телефона
export const findUserByPhone = (phone: string): User | null => {
  return demoUsers.find(user => user.phone === phone) || null;
};

// Функция для проверки пароля
export const validatePassword = (phone: string, password: string): boolean => {
  return demoPasswords[phone] === password;
};

// Функция для проверки, существует ли пользователь с таким номером
export const userExists = (phone: string): boolean => {
  return demoUsers.some(user => user.phone === phone);
};

// Функция для создания нового пользователя (для регистрации)
export const createNewUser = (name: string, phone: string): User => {
  const newUser: User = {
    id: `user_${Date.now()}`,
    name: name,
    phone: phone,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  
  // В реальном приложении здесь был бы API вызов
  // Для демо просто добавляем в массив
  demoUsers.push(newUser);
  
  return newUser;
};

// Функция для добавления пароля нового пользователя
export const setUserPassword = (phone: string, password: string): void => {
  demoPasswords[phone] = password;
};
