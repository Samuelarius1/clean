// src/pages/auth/LoginForm.tsx
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Link
} from '@mui/material';
import { COLORS } from '../../utils/constants';
import { authAPI } from '../../API/api';
// ✅ FIXED: Import shared User type
import type { User } from '../../types';

interface LoginFormProps {
  // ✅ FIXED: Match LoginHandler signature (userData, token)
  onLogin: (userData: User, token: string) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);

      if (response.status === 'success' && response.data?.user) {
        // ✅ FIXED: Pass both user AND token to onLogin
        const token = response.data.token || '';
        onLogin(response.data.user as User, token);
      } else {
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      
      let errorMessage = 'An error occurred. Please try again.';
      
      if (err.response?.data) {
        errorMessage = err.response.data.message || err.response.data.error || errorMessage;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
        disabled={loading}
        sx={{ 
          mb: 3, 
          '& .MuiOutlinedInput-root': { 
            borderRadius: 2,
            '&.Mui-focused fieldset': { borderColor: COLORS.primary }
          } 
        }}
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        autoComplete="current-password"
        disabled={loading}
        sx={{ 
          mb: 2, 
          '& .MuiOutlinedInput-root': { 
            borderRadius: 2,
            '&.Mui-focused fieldset': { borderColor: COLORS.primary }
          } 
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox 
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              sx={{ color: COLORS.primary, '&.Mui-checked': { color: COLORS.primary } }}
            />
          }
          label="Remember me"
          disabled={loading}
        />
        <Link 
          href="#" 
          variant="body2" 
          sx={{ color: COLORS.primary, fontWeight: 500, textDecoration: 'none' }}
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          py: 1.5,
          borderRadius: 2,
          bgcolor: COLORS.primary,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: `0 4px 12px ${COLORS.primary}66`,
          '&:hover': { bgcolor: '#C2185B' }
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
      </Button>

      <Typography variant="caption" display="block" align="center" sx={{ mt: 3, color: 'text.secondary' }}>
        Protected by FaithsCleanPro Security
      </Typography>
    </Box>
  );
};

export default LoginForm;