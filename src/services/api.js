const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const generateKoupens = async (number) => {
  const response = await fetch(`${API_BASE_URL}/koupean/add_koupean`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ number }),
  });
  if (!response.ok) throw new Error('Failed to generate koupens');
  return response.json();
};

export const fetchKoupens = async () => {
  const response = await fetch(`${API_BASE_URL}/koupean/get_koupeans`);
  if (!response.ok) throw new Error('Failed to fetch koupens');
  return response.json();
};

export const deleteKoupen = async (code) => {
  const response = await fetch(`${API_BASE_URL}/koupean/delete_koupean`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete koupen');
  }
  
  return response.json();
};