
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth };

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Récupérer les informations utilisateur depuis le backend
  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  // Inscription
  const signup = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('sessionExpiry', Date.now() + 60 * 60 * 1000); // 1 heure
      setCurrentUser({ email });
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Stocke le token JWT
      localStorage.setItem('sessionExpiry', Date.now() + 60 * 60 * 1000); // 1 heure
      setCurrentUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('authToken'); // Supprime le token JWT
    localStorage.removeItem('sessionExpiry'); // Supprime la durée de session
    setCurrentUser(null);
  };

  // Charger l'utilisateur connecté au démarrage
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('authToken'); // Récupère le token JWT
      const sessionExpiry = localStorage.getItem('sessionExpiry'); // Récupère l'heure d'expiration

      if (token && sessionExpiry && Date.now() < parseInt(sessionExpiry, 10)) {
        const userDetails = await fetchUserDetails(token); // Récupère les détails utilisateur depuis le backend
        if (userDetails) {
          setCurrentUser(userDetails); // Met à jour l'état avec les informations utilisateur
        } else {
          logout(); // Si le token est invalide, déconnecte l'utilisateur
        }
      } else {
        logout(); // Si la session est expirée, déconnecte l'utilisateur
      }

      setLoading(false); // Charge terminé
    };

    initializeUser();
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
