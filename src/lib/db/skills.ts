import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from '../firebase.js';
import { SkillModel } from '../../models/SkillModel.js';

export interface Skill {
  id: string | number;
  name: string;
  level: string;
  description: string | null;
  category_id: string | number;
}

export interface SkillCategory {
  id: string | number;
  name: string;
  skills?: Skill[];
}

function getInitialCategorizedSkills(): SkillCategory[] {
  const categorized = SkillModel.getCategorizedSkills();
  let skillCounter = 1;
  return categorized.map((cat, catIdx) => {
    const catId = catIdx + 1;
    return {
      id: catId,
      name: cat.category,
      skills: cat.skills.map(s => ({
        id: skillCounter++,
        name: s.name,
        level: s.level,
        description: s.desc || null,
        category_id: catId
      }))
    };
  });
}

export async function getAllCategories(): Promise<SkillCategory[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const catSnap = await getDocs(collection(db, 'skill_categories'));
      if (!catSnap.empty) {
        const categories: SkillCategory[] = catSnap.docs.map(d => ({
          id: d.id,
          name: d.data().name || '',
          skills: []
        }));

        const skillsSnap = await getDocs(collection(db, 'skills'));
        const skills: Skill[] = skillsSnap.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || '',
            level: data.level || 'Intermedio',
            description: data.description || null,
            category_id: data.category_id
          };
        });

        for (const cat of categories) {
          cat.skills = skills.filter(s => String(s.category_id) === String(cat.id));
        }

        return categories;
      }
    } catch (e) {
      console.warn('Error al obtener categorías de skills desde Firestore:', e);
    }
  }

  return getInitialCategorizedSkills();
}

export async function getCategoryById(id: string | number): Promise<SkillCategory | null> {
  const strId = String(id);
  const categories = await getAllCategories();
  return categories.find(c => String(c.id) === strId) || null;
}

export async function createCategory(name: string): Promise<SkillCategory> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const docRef = await addDoc(collection(db, 'skill_categories'), {
    name,
    created_at: new Date().toISOString()
  });

  return {
    id: docRef.id,
    name,
    skills: []
  };
}

export async function getSkillById(id: string | number): Promise<Skill | null> {
  const strId = String(id);
  if (isFirebaseConfigured() && db) {
    try {
      const snap = await getDoc(doc(db, 'skills', strId));
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          name: data.name || '',
          level: data.level || 'Intermedio',
          description: data.description || null,
          category_id: data.category_id
        };
      }
    } catch (e) {
      console.warn('Error al buscar skill en Firestore:', e);
    }
  }

  const flat = await getAllSkillsFlat();
  return flat.find(s => String(s.id) === strId) || null;
}

export async function getAllSkillsFlat(): Promise<Skill[]> {
  const categories = await getAllCategories();
  const flat: Skill[] = [];
  for (const cat of categories) {
    if (cat.skills) {
      flat.push(...cat.skills);
    }
  }
  return flat;
}

export async function createSkill(data: Omit<Skill, 'id'>): Promise<Skill> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const skillData = {
    name: data.name,
    level: data.level,
    description: data.description || null,
    category_id: String(data.category_id),
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'skills'), skillData);
  return {
    id: docRef.id,
    ...skillData
  };
}

export async function updateSkill(id: string | number, data: Partial<Omit<Skill, 'id'>>): Promise<Skill | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const strId = String(id);
  const docRef = doc(db, 'skills', strId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    return null;
  }

  const updateData: any = { ...data };
  if (updateData.category_id !== undefined) {
    updateData.category_id = String(updateData.category_id);
  }
  updateData.updated_at = new Date().toISOString();

  await updateDoc(docRef, updateData);
  const updatedSnap = await getDoc(docRef);
  const updated = updatedSnap.data()!;

  return {
    id: docRef.id,
    name: updated.name || '',
    level: updated.level || '',
    description: updated.description || null,
    category_id: updated.category_id
  };
}

export async function deleteSkill(id: string | number): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const strId = String(id);
  await deleteDoc(doc(db, 'skills', strId));
  return true;
}
