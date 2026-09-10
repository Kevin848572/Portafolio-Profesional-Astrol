import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from '../firebase.js';
import { ExperienceModel } from '../../models/ExperienceModel.js';

export interface ExperienceAchievement {
  id: string | number;
  text: string;
  experience_id?: string | number;
}

export interface Experience {
  id: string | number;
  year: string;
  period: string;
  role: string;
  company: string;
  description: string;
  tags: string[];
  achievements?: ExperienceAchievement[];
}

function getInitialExperiences(): Experience[] {
  return ExperienceModel.getExperiences().map((exp, idx) => ({
    id: idx + 1,
    year: exp.year,
    period: exp.period,
    role: exp.role,
    company: exp.company,
    description: exp.description,
    tags: exp.tags || [],
    achievements: (exp.achievements || []).map((text, aIdx) => ({
      id: `${idx + 1}-${aIdx + 1}`,
      text,
      experience_id: idx + 1
    }))
  }));
}

export async function getAllExperiences(): Promise<Experience[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDocs(collection(db, 'experiences'));
      if (!snap.empty) {
        return snap.docs.map(docSnap => {
          const data = docSnap.data();
          const rawAchievements = Array.isArray(data.achievements) ? data.achievements : [];
          return {
            id: docSnap.id,
            year: data.year || '',
            period: data.period || '',
            role: data.role || '',
            company: data.company || '',
            description: data.description || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            achievements: rawAchievements.map((item: any, i: number) => ({
              id: item.id || `${docSnap.id}-${i}`,
              text: typeof item === 'string' ? item : item.text || '',
              experience_id: docSnap.id
            }))
          };
        });
      }
    } catch (e) {
      console.warn('Error al leer experiencias desde Firestore:', e);
    }
  }

  return getInitialExperiences();
}

export async function getExperienceById(id: string | number): Promise<Experience | null> {
  const strId = String(id);
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, 'experiences', strId));
      if (snap.exists()) {
        const data = snap.data();
        const rawAchievements = Array.isArray(data.achievements) ? data.achievements : [];
        return {
          id: snap.id,
          year: data.year || '',
          period: data.period || '',
          role: data.role || '',
          company: data.company || '',
          description: data.description || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          achievements: rawAchievements.map((item: any, i: number) => ({
            id: item.id || `${snap.id}-${i}`,
            text: typeof item === 'string' ? item : item.text || '',
            experience_id: snap.id
          }))
        };
      }
    } catch (e) {
      console.warn('Error al buscar experiencia en Firestore:', e);
    }
  }

  const all = await getAllExperiences();
  return all.find(e => String(e.id) === strId) || null;
}

export async function createExperience(
  data: Omit<Experience, 'id'> & { achievements?: (string | { text: string })[] }
): Promise<Experience> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const achievementsList = (data.achievements || []).map(a => ({
    text: typeof a === 'string' ? a : a.text
  }));

  const expData = {
    year: data.year,
    period: data.period,
    role: data.role,
    company: data.company,
    description: data.description,
    tags: data.tags || [],
    achievements: achievementsList,
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'experiences'), expData);
  return {
    id: docRef.id,
    ...expData,
    achievements: achievementsList.map((a, i) => ({
      id: `${docRef.id}-${i}`,
      text: a.text,
      experience_id: docRef.id
    }))
  };
}

export async function updateExperience(
  id: string | number,
  data: Partial<Omit<Experience, 'id'>> & { achievements?: (string | { text: string })[] }
): Promise<Experience | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const strId = String(id);
  const docRef = doc(db, 'experiences', strId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    return null;
  }

  const updateData: any = { ...data };
  if (data.achievements !== undefined) {
    updateData.achievements = data.achievements.map(a => ({
      text: typeof a === 'string' ? a : a.text
    }));
  }
  updateData.updated_at = new Date().toISOString();

  await updateDoc(docRef, updateData);
  return await getExperienceById(strId);
}

export async function deleteExperience(id: string | number): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const strId = String(id);
  await deleteDoc(doc(db, 'experiences', strId));
  return true;
}
