// src/components/auth/RegisterForm.tsx

import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import {
  ArrowForward,
  CheckCircle,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

import { COLORS } from '../../utils/constants';
import type { User } from '../../types';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

interface RegisterFormProps {
  onRegister: (userData: User) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm = ({
  onRegister,
  onSwitchToLogin,
}: RegisterFormProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * Password strength.
   */
  const passwordStrength = useMemo(() => {
    const password = formData.password;

    if (!password) {
      return {
        score: 0,
        label: '',
      };
    }

    let score = 0;

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        score: 1,
        label: 'Weak password',
      };
    }

    if (score <= 3) {
      return {
        score: 2,
        label: 'Good password',
      };
    }

    return {
      score: 3,
      label: 'Strong password',
    };
  }, [formData.password]);

  /*
   * Generic field styling.
   */
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      minHeight: 56,
      borderRadius: 2.5,
      backgroundColor: '#F9FAFC',
      transition: 'all .25s ease',

      '& fieldset': {
        borderColor: 'rgba(5,35,97,.10)',
      },

      '&:hover': {
        backgroundColor: '#fff',

        '& fieldset': {
          borderColor: `${COLORS.primary}55`,
        },
      },

      '&.Mui-focused': {
        backgroundColor: '#fff',
        boxShadow: `0 0 0 4px ${COLORS.primary}10`,

        '& fieldset': {
          borderColor: COLORS.primary,
          borderWidth: 1.5,
        },
      },

      '&.Mui-error': {
        boxShadow: 'none',

        '& fieldset': {
          borderColor: '#d32f2f',
        },
      },
    },

    '& input': {
      fontSize: '.9rem',
    },

    '& .MuiFormHelperText-root': {
      mx: 0,
      mt: .7,
      fontSize: '.72rem',
    },
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    if (registerError) {
      setRegisterError('');
    }
  };

  const validateForm = () => {
    const newErrors: RegisterErrors = {};

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      newErrors.name = 'Please enter your full name.';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Name must contain at least 2 characters.';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password.';
    } else if (formData.password.length < 6) {
      newErrors.password =
        'Password must contain at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        'Please confirm your password.';
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        'Passwords do not match.';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms =
        'Please agree to the Terms and Conditions.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setRegisterError('');

    try {
      /*
       * Keep your current registration behaviour.
       *
       * Replace this section with your registration API
       * whenever your backend endpoint is ready.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      const userData: User = {
        id: Date.now(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'client',
      };

      onRegister(userData);
    } catch (error) {
      console.error('Registration Error:', error);

      setRegisterError(
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        width: '100%',
        animation:
          'registerFormEntrance .55s cubic-bezier(.16,1,.3,1)',
        '@keyframes registerFormEntrance': {
          from: {
            opacity: 0,
            transform: 'translateY(15px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* =====================================================
          ERROR MESSAGE
      ====================================================== */}

      {registerError && (
        <Alert
          severity="error"
          onClose={() => setRegisterError('')}
          sx={{
            mb: 2.5,
            borderRadius: 2.5,
            fontSize: '.82rem',
            fontWeight: 600,
            border: '1px solid rgba(211,47,47,.12)',
          }}
        >
          {registerError}
        </Alert>
      )}

      {/* =====================================================
          NAME
      ====================================================== */}

      <Box sx={{ mb: 2.1 }}>
        <Typography
          component="label"
          htmlFor="register-name"
          sx={{
            display: 'block',
            mb: .8,
            color: COLORS.primary,
            fontSize: '.78rem',
            fontWeight: 800,
          }}
        >
          Full Name
        </Typography>

        <TextField
          id="register-name"
          fullWidth
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
          autoFocus
          disabled={isSubmitting}
          placeholder="Enter your full name"
          error={Boolean(errors.name)}
          helperText={errors.name}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person
                  sx={{
                    color: errors.name
                      ? 'error.main'
                      : 'text.secondary',
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={fieldSx}
        />
      </Box>

      {/* =====================================================
          EMAIL
      ====================================================== */}

      <Box sx={{ mb: 2.1 }}>
        <Typography
          component="label"
          htmlFor="register-email"
          sx={{
            display: 'block',
            mb: .8,
            color: COLORS.primary,
            fontSize: '.78rem',
            fontWeight: 800,
          }}
        >
          Email Address
        </Typography>

        <TextField
          id="register-email"
          fullWidth
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
          disabled={isSubmitting}
          placeholder="you@example.com"
          error={Boolean(errors.email)}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email
                  sx={{
                    color: errors.email
                      ? 'error.main'
                      : 'text.secondary',
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={fieldSx}
        />
      </Box>

      {/* =====================================================
          PASSWORD
      ====================================================== */}

      <Box sx={{ mb: 1.2 }}>
        <Typography
          component="label"
          htmlFor="register-password"
          sx={{
            display: 'block',
            mb: .8,
            color: COLORS.primary,
            fontSize: '.78rem',
            fontWeight: 800,
          }}
        >
          Password
        </Typography>

        <TextField
          id="register-password"
          fullWidth
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          placeholder="Create a password"
          error={Boolean(errors.password)}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock
                  sx={{
                    color: errors.password
                      ? 'error.main'
                      : 'text.secondary',
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),

            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  edge="end"
                  disabled={isSubmitting}
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: COLORS.primary,
                    },
                  }}
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={fieldSx}
        />
      </Box>

      {/* Password strength */}
      {formData.password && (
        <Box
          sx={{
            mb: 2,
            mt: .4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: .5,
              mb: .7,
            }}
          >
            {[1, 2, 3].map((level) => (
              <Box
                key={level}
                sx={{
                  flex: 1,
                  height: 4,
                  borderRadius: 99,
                  bgcolor:
                    level <= passwordStrength.score
                      ? COLORS.primary
                      : 'rgba(5,35,97,.09)',
                  transition:
                    'background-color .3s ease',
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: '.68rem',
              color:
                passwordStrength.score === 1
                  ? 'error.main'
                  : passwordStrength.score === 2
                    ? 'text.secondary'
                    : COLORS.primary,
              fontWeight: 700,
            }}
          >
            {passwordStrength.label}
          </Typography>
        </Box>
      )}

      {/* =====================================================
          CONFIRM PASSWORD
      ====================================================== */}

      <Box sx={{ mb: 2 }}>
        <Typography
          component="label"
          htmlFor="register-confirm-password"
          sx={{
            display: 'block',
            mb: .8,
            color: COLORS.primary,
            fontSize: '.78rem',
            fontWeight: 800,
          }}
        >
          Confirm Password
        </Typography>

        <TextField
          id="register-confirm-password"
          fullWidth
          name="confirmPassword"
          type={
            showConfirmPassword
              ? 'text'
              : 'password'
          }
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          disabled={isSubmitting}
          placeholder="Confirm your password"
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock
                  sx={{
                    color: errors.confirmPassword
                      ? 'error.main'
                      : 'text.secondary',
                    fontSize: 20,
                  }}
                />
              </InputAdornment>
            ),

            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="button"
                  edge="end"
                  disabled={isSubmitting}
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: COLORS.primary,
                    },
                  }}
                >
                  {showConfirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={fieldSx}
        />

        {/* Password match indicator */}
        {formData.confirmPassword &&
          !errors.confirmPassword &&
          formData.password ===
            formData.confirmPassword && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: .6,
                mt: .7,
              }}
            >
              <CheckCircle
                sx={{
                  fontSize: 15,
                  color: '#2e7d32',
                }}
              />

              <Typography
                sx={{
                  fontSize: '.68rem',
                  color: '#2e7d32',
                  fontWeight: 700,
                }}
              >
                Passwords match
              </Typography>
            </Box>
          )}
      </Box>

      {/* =====================================================
          TERMS
      ====================================================== */}

      <Box sx={{ mb: 2.3 }}>
        <FormControlLabel
          disabled={isSubmitting}
          control={
            <Checkbox
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              size="small"
              sx={{
                p: .5,
                mr: .5,
                color: errors.agreeToTerms
                  ? 'error.main'
                  : `${COLORS.primary}75`,
                '&.Mui-checked': {
                  color: COLORS.primary,
                },
              }}
            />
          }
          label={
            <Typography
              sx={{
                fontSize: '.73rem',
                color: 'text.secondary',
                lineHeight: 1.5,
                fontWeight: 550,
              }}
            >
              I agree to the{' '}
              <Box
                component="span"
                sx={{
                  color: COLORS.primary,
                  fontWeight: 800,
                }}
              >
                Terms and Conditions
              </Box>
            </Typography>
          }
          sx={{
            alignItems: 'flex-start',
            ml: -.5,
            mr: 0,
          }}
        />

        {errors.agreeToTerms && (
          <Typography
            sx={{
              color: 'error.main',
              fontSize: '.68rem',
              fontWeight: 600,
              mt: .3,
              ml: 3.7,
            }}
          >
            {errors.agreeToTerms}
          </Typography>
        )}
      </Box>

      {/* =====================================================
          CREATE ACCOUNT BUTTON
      ====================================================== */}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        endIcon={
          !isSubmitting ? (
            <ArrowForward
              sx={{
                transition: 'transform .25s ease',
              }}
            />
          ) : undefined
        }
        sx={{
          minHeight: 56,
          borderRadius: 2.5,
          bgcolor: COLORS.primary,
          color: '#fff',
          fontSize: '.9rem',
          fontWeight: 800,
          textTransform: 'none',
          boxShadow:
            `0 14px 30px ${COLORS.primary}30`,
          transition: 'all .3s ease',

          '&:hover': {
            bgcolor: COLORS.primary,
            transform: 'translateY(-2px)',
            boxShadow:
              `0 18px 38px ${COLORS.primary}3d`,

            '& .MuiButton-endIcon': {
              transform: 'translateX(4px)',
            },
          },

          '&:active': {
            transform: 'translateY(0)',
          },

          '&.Mui-disabled': {
            bgcolor: `${COLORS.primary}aa`,
            color: '#fff',
          },

          '& .MuiButton-endIcon': {
            transition: 'transform .25s ease',
          },
        }}
      >
        {isSubmitting ? (
          <>
            <CircularProgress
              size={20}
              thickness={4}
              sx={{
                color: '#fff',
                mr: 1,
              }}
            />
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* =====================================================
          SWITCH TO LOGIN
      ====================================================== */}

      <Box
        sx={{
          textAlign: 'center',
          mt: 2.5,
          pt: 2.3,
          borderTop:
            '1px solid rgba(5,35,97,.07)',
        }}
      >
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: '.76rem',
          }}
        >
          Already have an account?{' '}
          <Button
            type="button"
            onClick={onSwitchToLogin}
            disabled={isSubmitting}
            sx={{
              minWidth: 0,
              p: 0,
              ml: .3,
              color: COLORS.primary,
              fontSize: '.76rem',
              fontWeight: 850,
              textTransform: 'none',
              verticalAlign: 'baseline',

              '&:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline',
              },
            }}
          >
            Sign In
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;