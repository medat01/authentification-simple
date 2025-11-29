// Configuration de l'API
// Modifiez cette URL selon votre environnement
export const API_CONFIG = {
  BASE_URL: 'http://10.0.2.2:3000', // Émulateur Android utilise 10.0.2.2 pour accéder à localhost
  // Pour émulateur Android: 'http://10.0.2.2:3000'
  // Pour simulateur iOS: 'http://localhost:3000'
  // Pour appareil physique: utilisez l'IP de votre ordinateur (ex: 'http://192.168.1.100:3000')
  
  ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/users/me'
  }
};

