const API_BASE = 'http://localhost:5000/api';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const userStr = localStorage.getItem('dpr_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
  }
  return headers;
};

const getUserId = () => {
  const userStr = localStorage.getItem('dpr_user');
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  return user._id || user.id;
};

// 1️⃣ Get Learning Domains (Dashboard Cards)
export const getTechnologies = async () => {
  const res = await fetch(`${API_BASE}/domains`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch technologies');
  }
  // Backend responds with { success, data: [domains] }
  return json.data;
};

// Helper: fetch a single technology/domain by id or name
export const getTechnology = async (id) => {
  const technologies = await getTechnologies();
  return technologies.find(
    (t) =>
      t._id === id ||
      (typeof t.name === 'string' && t.name.toLowerCase() === id.toLowerCase())
  );
};

// 2️⃣ Submit Learning Preferences (Generate Roadmap)
export const submitLearningPreferences = async (data) => {
  const userId = getUserId();
  if (!userId) throw new Error('User not logged in');

  const res = await fetch(`${API_BASE}/roadmap/generate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      userId,
      // Map selected technology/domain from frontend to backend field
      domain: data.techId,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to generate roadmap');
  }

  // Return the created roadmap document from backend
  return json.data;
};

// 3️⃣ Get User Roadmap (domain-specific)
export const getRoadmap = async (techId) => {
  const userId = getUserId();
  if (!userId) return [];

  const res = await fetch(
    `${API_BASE}/roadmap/${userId}?domain=${encodeURIComponent(techId)}`,
    {
      headers: getHeaders(),
    }
  );

  const json = await res.json();
  if (!res.ok || !json.success || !json.data) {
    return [];
  }

  // Transform backend roadmap into the module list the UI expects
  return (json.data.skills || []).map((item) => ({
    id: item.skillId?._id,
    title: item.skillId?.name,
    status: item.status,
    type: item.resourceId?.type,
    description: item.skillId?.description,
  }));
};

// 5️⃣ Get Resources for a Skill (Module Detail)
export const getModuleResources = async (skillId) => {
  const res = await fetch(`${API_BASE}/roadmap/skill/${skillId}`, {
    headers: getHeaders(),
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch module resources');
  }
  return json.data;
};

// 4️⃣ Update Progress
export const updateProgress = async (progressDataOrSkillId) => {
  const userId = getUserId();
  if (!userId) throw new Error('User not logged in');

  const payload =
    typeof progressDataOrSkillId === 'string'
      ? {
          userId,
          skillId: progressDataOrSkillId,
          status: 'completed',
        }
      : {
          userId,
          ...progressDataOrSkillId,
        };

  const res = await fetch(`${API_BASE}/progress/update`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to update progress');
  }

  return json.data;
};

// Extra: Get overall user progress for the Progress page
export const getProgress = async () => {
  const userId = getUserId();
  if (!userId) throw new Error('User not logged in');

  const res = await fetch(`${API_BASE}/progress/${userId}`, {
    headers: getHeaders(),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to fetch progress');
  }

  return json.data;
};

// Auth helpers
export const login = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to login');
  }

  return json.data; // { _id, name, email, token }
};

export const register = async (name, email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to register');
    }

    return json.data;
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
    }
    throw error;
  }
};

// Admin: create a new learning domain
export const createDomain = async ({ name, description, icon, technologies }) => {
  const res = await fetch(`${API_BASE}/domains`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      name,
      description,
      icon,
      technologies,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Failed to create domain');
  }

  return json.data;
};
