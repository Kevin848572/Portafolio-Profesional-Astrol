import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from '../firebase.js';
import { ProjectModel } from '../../models/ProjectModel.js';

export interface Project {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  category: string;
  tags: string[];
  image: string | null;
  demo_url: string | null;
  github_url: string | null;
  featured: boolean;
}

function mapFromModel(p: any): Project {
  return {
    id: p.id || p.slug,
    slug: p.slug || p.id || '',
    title: p.title || '',
    description: p.description || p.desc || '',
    long_description: p.long_description || p.longDesc || null,
    category: p.category || 'Frontend',
    tags: Array.isArray(p.tags) ? p.tags : [],
    image: p.image || null,
    demo_url: p.demo_url || p.demoUrl || null,
    github_url: p.github_url || p.githubUrl || null,
    featured: Boolean(p.featured)
  };
}

function getInitialProjects(): Project[] {
  return ProjectModel.getProjects().map(mapFromModel);
}

export async function getAllProjects(category?: string | null): Promise<Project[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, 'projects');
      const snapshot = await getDocs(colRef);
      
      if (!snapshot.empty) {
        let projects: Project[] = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            slug: data.slug || docSnap.id,
            title: data.title || '',
            description: data.description || '',
            long_description: data.long_description || null,
            category: data.category || 'Frontend',
            tags: Array.isArray(data.tags) ? data.tags : [],
            image: data.image || null,
            demo_url: data.demo_url || null,
            github_url: data.github_url || null,
            featured: Boolean(data.featured)
          };
        });

        if (category && category !== 'Todos') {
          projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        return projects;
      }
    } catch (error) {
      console.warn('Error al leer proyectos desde Firestore, usando modelo:', error);
    }
  }

  // Fallback a proyectos iniciales
  let list = getInitialProjects();
  if (category && category !== 'Todos') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  return list;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter(p => p.featured);
}

export async function getProjectById(id: string | number): Promise<Project | null> {
  const strId = String(id);
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, 'projects', strId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          slug: data.slug || snap.id,
          title: data.title || '',
          description: data.description || '',
          long_description: data.long_description || null,
          category: data.category || 'Frontend',
          tags: Array.isArray(data.tags) ? data.tags : [],
          image: data.image || null,
          demo_url: data.demo_url || null,
          github_url: data.github_url || null,
          featured: Boolean(data.featured)
        };
      }
    } catch (e) {
      console.warn('Error al obtener proyecto por id en Firestore:', e);
    }
  }

  const all = await getAllProjects();
  return all.find(p => String(p.id) === strId || p.slug === strId) || null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, 'projects');
      const q = query(colRef, where('slug', '==', slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        const data = docSnap.data();
        return {
          id: docSnap.id,
          slug: data.slug || docSnap.id,
          title: data.title || '',
          description: data.description || '',
          long_description: data.long_description || null,
          category: data.category || 'Frontend',
          tags: Array.isArray(data.tags) ? data.tags : [],
          image: data.image || null,
          demo_url: data.demo_url || null,
          github_url: data.github_url || null,
          featured: Boolean(data.featured)
        };
      }
    } catch (e) {
      console.warn('Error al buscar slug en Firestore:', e);
    }
  }

  const all = await getAllProjects();
  return all.find(p => p.slug === slug) || null;
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const colRef = collection(db, 'projects');
  const projectData = {
    slug: data.slug,
    title: data.title,
    description: data.description,
    long_description: data.long_description || null,
    category: data.category,
    tags: data.tags || [],
    image: data.image || null,
    demo_url: data.demo_url || null,
    github_url: data.github_url || null,
    featured: Boolean(data.featured),
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(colRef, projectData);
  return {
    id: docRef.id,
    ...projectData
  };
}

export async function updateProject(id: string | number, data: Partial<Omit<Project, 'id'>>): Promise<Project | null> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const strId = String(id);
  const docRef = doc(db, 'projects', strId);
  const snap = await getDoc(docRef);

  if (!snap.exists()) {
    return null;
  }

  await updateDoc(docRef, {
    ...data,
    updated_at: new Date().toISOString()
  });

  const updatedSnap = await getDoc(docRef);
  const updatedData = updatedSnap.data()!;
  return {
    id: docRef.id,
    slug: updatedData.slug || docRef.id,
    title: updatedData.title || '',
    description: updatedData.description || '',
    long_description: updatedData.long_description || null,
    category: updatedData.category || 'Frontend',
    tags: updatedData.tags || [],
    image: updatedData.image || null,
    demo_url: updatedData.demo_url || null,
    github_url: updatedData.github_url || null,
    featured: Boolean(updatedData.featured)
  };
}

export async function deleteProject(id: string | number): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore no está configurado');
  }

  const strId = String(id);
  const docRef = doc(db, 'projects', strId);
  await deleteDoc(docRef);
  return true;
}
