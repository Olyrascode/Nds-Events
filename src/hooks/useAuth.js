
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, clearAuth, setLoading, setError } from '../features/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user details');
      const userData = await response.json();
      dispatch(setUser(userData));
    } catch (err) {
      dispatch(setError('Failed to fetch user details'));
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch(setLoading(true));
      fetchUserDetails(token);
    }
  }, [dispatch]);

  const signup = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Failed to sign up');
      const data = await response.json();
      dispatch(setUser({ email, isAdmin: false }));
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Failed to login');
      const data = await response.json();
      dispatch(setToken(data.token));
      dispatch(setUser(data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    dispatch(clearAuth());
  };

  return {
    user,
    token,
    loading,
    error,
    signup,
    login,
    logout,
  };
}
