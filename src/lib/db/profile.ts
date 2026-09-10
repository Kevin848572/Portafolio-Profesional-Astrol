import { 
  db, 
  isFirebaseConfigured, 
  doc, 
  getDoc, 
  setDoc 
} from '../firebase.js';
import { ProfileModel } from '../../models/ProfileModel.js';

export interface Profile {
  id: string | number;
  name: string;
  role: string;
  status: string;
  title: string;
  subtitle: string;
  image_url: string;
  email: string;
  location: string;
  cv_url: string | null;
  stats: any;
  socials: any;
}

function getInitialProfile(): Profile {
  const p = ProfileModel.getProfile();
  return {
    id: 'main',
    name: p.name,
    role: p.role,
    status: p.status,
    title: p.title,
    subtitle: p.subtitle,
    image_url: p.imageUrl,
    email: p.email,
    location: p.location,
    cv_url: p.cvUrl || null,
    stats: p.stats,
    socials: p.socials
  };
}

export async function getProfile(): Promise<Profile | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'profile', 'main');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          name: data.name || '',
          role: data.role || '',
          status: data.status || '',
          title: data.title || '',
          subtitle: data.subtitle || '',
          image_url: data.image_url || data.imageUrl || '',
          email: data.email || '',
          location: data.location || '',
          cv_url: data.cv_url || data.cvUrl || null,
          stats: data.stats || [],
          socials: data.socials || {}
        };
      }
    } catch (e) {
      console.warn('Error al leer perfil desde Firestore:', e);
    }
  }

  return getInitialProfile();
}

export async function updateProfile(id: string | number, data: Partial<Omit<Profile, 'id'>>): Promise<Profile | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const docRef = doc(db, 'profile', 'main');
  const current = (await getProfile()) || getInitialProfile();

  const updated: Profile = {
    ...current,
    ...data,
    id: 'main'
  };

  await setDoc(docRef, {
    ...updated,
    updated_at: new Date().toISOString()
  }, { merge: true });

  return updated;
}
