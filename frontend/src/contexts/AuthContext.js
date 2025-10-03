import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../config/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      try {
        const res = await api.get('/auth/me');
        dispatch({
          type: 'USER_LOADED',
          payload: res.data.user,
        });
      } catch (err) {
        dispatch({ type: 'AUTH_ERROR' });
      }
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });
      setAuthToken(res.data.token);
      toast.success('Registration successful!');
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Registration failed';
      dispatch({
        type: 'REGISTER_FAIL',
        payload: error,
      });
      toast.error(error);
      return { success: false, error };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
      setAuthToken(res.data.token);
      toast.success('Login successful!');
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_FAIL',
        payload: error,
      });
      toast.error(error);
      return { success: false, error };
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setAuthToken(null);
    toast.success('Logged out successfully');
  };

  // Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/profile', formData);
      dispatch({
        type: 'USER_LOADED',
        payload: res.data.user,
      });
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Profile update failed';
      toast.error(error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        loadUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

