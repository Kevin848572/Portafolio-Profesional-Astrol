import { db, isFirebaseConfigured, collection, getDocs, query, where, addDoc } from '../firebase.js';

export interface User {
  id: string | number;
  username: string;
  hashed_password: string;
  is_active: boolean;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
  if (username === defaultAdminUser) {
    return {
      id: 'default-admin',
      username: defaultAdminUser,
      hashed_password: '',
      is_active: true
    };
  }

  if (!isFirebaseConfigured() || !db) {
    return null;
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();

    return {
      id: docSnap.id,
      username: data.username,
      hashed_password: data.hashed_password,
      is_active: data.is_active !== false
    };
  } catch (error) {
    console.warn('Error al buscar usuario en Firestore:', error);
    return null;
  }
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const defaultAdminUser = process.env.ADMIN_USERNAME || 'admin';
  const defaultAdminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (username === defaultAdminUser && password === defaultAdminPass) {
    return {
      id: 'default-admin',
      username: defaultAdminUser,
      hashed_password: '',
      is_active: true
    };
  }

  try {
    const user = await getUserByUsername(username);
    if (!user || !user.is_active || !user.hashed_password) return null;
    
    const bcryptModule = await import('bcryptjs');
    const bcrypt = bcryptModule.default || bcryptModule;
    const matches = bcrypt.compareSync(password, user.hashed_password);
    if (!matches) return null;
    
    return user;
  } catch (error) {
    console.warn('Error en authenticateUser:', error);
    return null;
  }
}

export async function createUser(username: string, password: string): Promise<User> {
  const bcryptModule = await import('bcryptjs');
  const bcrypt = bcryptModule.default || bcryptModule;
  const hashed = bcrypt.hashSync(password, 10);

  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase no está configurado');
  }

  const usersRef = collection(db, 'users');
  const docRef = await addDoc(usersRef, {
    username,
    hashed_password: hashed,
    is_active: true,
    created_at: new Date().toISOString()
  });

  return {
    id: docRef.id,
    username,
    hashed_password: hashed,
    is_active: true
  };
}
