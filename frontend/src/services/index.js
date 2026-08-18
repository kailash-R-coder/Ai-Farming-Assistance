import api from './api';

export const diseaseService = {
  predictDisease: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/disease/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get('/disease/history');
    return res.data;
  }
};

export const chatService = {
  sendMessage: async (message, language = 'auto') => {
    const res = await api.post('/chat', { message, language });
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get('/chat/history');
    return res.data;
  }
};

export const recommendationService = {
  getCropRec: async (data) => {
    const res = await api.post('/crop/recommend', data);
    return res.data;
  },
  getFertilizerRec: async (data) => {
    const res = await api.post('/fertilizer/recommend', data);
    return res.data;
  },
  getIrrigationRec: async (data) => {
    const res = await api.post('/irrigation/recommend', data);
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get('/recommendations/history');
    return res.data;
  }
};

export const weatherService = {
  getWeather: async (latitude = 10.8505, longitude = 76.2711, location = "Palakkad, Kerala") => {
    const res = await api.get(`/weather?latitude=${latitude}&longitude=${longitude}&location=${encodeURIComponent(location)}`);
    return res.data;
  }
};

export const dashboardService = {
  getSummary: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  }
};
