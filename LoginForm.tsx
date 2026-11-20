import { useEffect, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';

import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  AutoAwesome,
  Security,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/constants';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface LoginFormProps {
  onLogin: (userData: User) => void;
}

const previewImages = [
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=85',
];

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const primary = COLORS.primary || '#052361';
  const secondary = COLORS.secondary || '#0B4AA2';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeImage, setActiveImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  /*
   * Automatically change preview image
   */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setImageLoaded(false);

      setTimeout(() => {
        setActiveImage((current) => (current + 1) % previewImages.length);
      }, 250);
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  /*
   * Form change handler
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name as keyof LoginErrors]) {
      setErrors((previous) => ({
        ...previous,
        [name]: '',
      }));
    }

    if (loginError) {
      setLoginError('');
    }
  };

  /*
   * Validation
   */
  const validateForm = () => {
    const newErrors: LoginErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
   * Login
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError('');

    try {
      // Replace this with your real PHP/API request.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: 1,
        name: 'John Doe',
        email: formData.email,
        role: formData.email.toLowerCase().includes('admin')
          ? 'admin'
          : 'user',
      };

      onLogin(userData);
    } catch {
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((previous) => !previous);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(
            circle at 10% 10%,
            ${alpha(primary, 0.08)},
            transparent 32%
          ),
          radial-gradient(
            circle at 90% 90%,
            ${alpha('#E923DA', 0.07)},
            transparent 28%
          ),
          ${theme.palette.background.default}
        `,
        px: {
          xs: 2,
          sm: 3,
          md: 5,
        },
        py: {
          xs: 3,
          md: 5,
        },

        '&::before': {
          content: '""',
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: alpha(primary, 0.035),
          top: -180,
          left: -160,
          animation: 'loginFloatOne 10s ease-in-out infinite',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: alpha('#E923DA', 0.035),
          bottom: -160,
          right: -130,
          animation: 'loginFloatTwo 12s ease-in-out infinite',
        },

        '@keyframes loginFloatOne': {
          '0%, 100%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '50%': {
            transform: 'translate3d(35px, 30px, 0)',
          },
        },

        '@keyframes loginFloatTwo': {
          '0%, 100%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '50%': {
            transform: 'translate3d(-25px, -35px, 0)',
          },
        },
      }}
    >
      {/* HOME BUTTON */}
      <Button
        onClick={() => navigate('/')}
        startIcon={<ArrowBack />}
        sx={{
          position: 'fixed',
          top: {
            xs: 16,
            md: 25,
          },
          left: {
            xs: 16,
            md: 30,
          },
          zIndex: 20,
          borderRadius: '14px',
          px: 2,
          py: 1,
          fontWeight: 800,
          color: primary,
          backgroundColor: alpha(
            theme.palette.background.paper,
            0.86
          ),
          backdropFilter: 'blur(14px)',
          border: `1px solid ${alpha(primary, 0.1)}`,
          boxShadow: `0 10px 30px ${alpha(primary, 0.08)}`,
          textTransform: 'none',

          '&:hover': {
            backgroundColor: theme.palette.background.paper,
            transform: 'translateX(-3px)',
            boxShadow: `0 14px 35px ${alpha(primary, 0.14)}`,
          },

          transition: 'all .3s ease',
        }}
      >
        Home
      </Button>

      {/* MAIN LOGIN CARD */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 1180,
          minHeight: {
            xs: 'auto',
            md: 680,
          },
          position: 'relative',
          zIndex: 2,
          overflow: 'hidden',
          borderRadius: {
            xs: 4,
            md: 6,
          },
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '0.95fr 1.05fr',
          },
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${alpha(primary, 0.08)}`,
          boxShadow: `
            0 35px 90px ${alpha(primary, 0.14)},
            0 8px 30px ${alpha('#000', 0.06)}
          `,
          animation: 'loginCardEnter .9s cubic-bezier(.16,1,.3,1)',
          '@keyframes loginCardEnter': {
            from: {
              opacity: 0,
              transform: 'translateY(45px) scale(.97)',
            },
            to: {
              opacity: 1,
              transform: 'translateY(0) scale(1)',
            },
          },
        }}
      >
        {/* =========================================================
            LEFT — IMAGE PREVIEW
        ========================================================= */}
        <Box
          sx={{
            position: 'relative',
            minHeight: {
              xs: 320,
              sm: 400,
              md: 680,
            },
            overflow: 'hidden',
            backgroundColor: primary,
            display: {
              xs: 'none',
              sm: 'block',
            },
          }}
        >
          {/* IMAGE */}
          <Box
            component="img"
            src={previewImages[activeImage]}
            alt="Preview"
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transform: imageLoaded
                ? 'scale(1.02)'
                : 'scale(1.08)',
              transition:
                'opacity .9s ease, transform 6s cubic-bezier(.16,1,.3,1)',
              animation: 'previewZoom 6s ease-out',
              '@keyframes previewZoom': {
                from: {
                  transform: 'scale(1.08)',
                },
                to: {
                  transform: 'scale(1.02)',
                },
              },
            }}
          />

          {/* DARK IMAGE OVERLAY */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(
                  180deg,
                  ${alpha(primary, 0.2)} 0%,
                  ${alpha(primary, 0.55)} 55%,
                  ${alpha(primary, 0.94)} 100%
                )
              `,
            }}
          />

          {/* FLOATING ORB */}
          <Box
            sx={{
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: '50%',
              top: '12%',
              right: '-60px',
              border: `1px solid ${alpha('#fff', 0.22)}`,
              backgroundColor: alpha('#fff', 0.04),
              backdropFilter: 'blur(3px)',
              animation: 'previewOrb 7s ease-in-out infinite',
              '@keyframes previewOrb': {
                '0%, 100%': {
                  transform: 'translateY(0) rotate(0deg)',
                },
                '50%': {
                  transform: 'translateY(-25px) rotate(8deg)',
                },
              },
            }}
          />

          {/* CONTENT */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: {
                sm: 4,
                md: 5,
                lg: 6,
              },
              color: '#fff',
            }}
          >
            {/* TOP */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'previewTop .8s .2s both',
                '@keyframes previewTop': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(-20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.8,
                  borderRadius: '30px',
                  backgroundColor: alpha('#fff', 0.12),
                  border: `1px solid ${alpha('#fff', 0.16)}`,
                  backdropFilter: 'blur(12px)',
                }}
              >
                <AutoAwesome sx={{ fontSize: 17 }} />

                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Welcome Back
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha('#fff', 0.12),
                  border: `1px solid ${alpha('#fff', 0.15)}`,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Security sx={{ fontSize: 19 }} />
              </Box>
            </Box>

            {/* BOTTOM CONTENT */}
            <Box
              sx={{
                maxWidth: 480,
                animation: 'previewContent 1s .25s both',
                '@keyframes previewContent': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(35px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    sm: 34,
                    md: 44,
                    lg: 50,
                  },
                  lineHeight: 1.02,
                  fontWeight: 900,
                  letterSpacing: '-1.8px',
                  mb: 2,
                }}
              >
                Your space.
                <br />
                Your standard.
                <br />
                <Box
                  component="span"
                  sx={{
                    color: '#fff',
                    opacity: 0.72,
                  }}
                >
                  Your CleanPro.
                </Box>
              </Typography>

              <Typography
                sx={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: alpha('#fff', 0.78),
                  maxWidth: 420,
                }}
              >
                Sign in to continue managing your account,
                services and cleaning experience.
              </Typography>

              {/* FEATURES */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1.2,
                  mt: 3,
                }}
              >
                {[
                  'Professional Service',
                  'Easy Management',
                  'Trusted Team',
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.7,
                      px: 1.3,
                      py: 0.8,
                      borderRadius: '12px',
                      backgroundColor: alpha('#fff', 0.09),
                      border: `1px solid ${alpha('#fff', 0.12)}`,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 15 }} />

                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: alpha('#fff', 0.85),
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* IMAGE INDICATORS */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.8,
                  mt: 4,
                }}
              >
                {previewImages.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: index === activeImage ? 30 : 8,
                      height: 8,
                      borderRadius: '20px',
                      backgroundColor:
                        index === activeImage
                          ? '#fff'
                          : alpha('#fff', 0.35),
                      transition: 'all .45s ease',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* =========================================================
            RIGHT — LOGIN FORM
        ========================================================= */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: {
              xs: 3,
              sm: 5,
              md: 6,
              lg: 7,
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 470,
              animation:
                'formEnter 1s .15s cubic-bezier(.16,1,.3,1) both',

              '@keyframes formEnter': {
                from: {
                  opacity: 0,
                  transform: 'translateX(35px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            {/* FORM HEADER */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                  color: '#fff',
                  background: `linear-gradient(
                    135deg,
                    ${primary},
                    ${secondary}
                  )`,
                  boxShadow: `0 14px 30px ${alpha(primary, 0.2)}`,
                  animation: 'iconFloat 4s ease-in-out infinite',

                  '@keyframes iconFloat': {
                    '0%, 100%': {
                      transform: 'translateY(0)',
                    },
                    '50%': {
                      transform: 'translateY(-5px)',
                    },
                  },
                }}
              >
                <Lock />
              </Box>

              <Typography
                sx={{
                  fontSize: {
                    xs: 31,
                    sm: 37,
                  },
                  fontWeight: 900,
                  lineHeight: 1.08,
                  letterSpacing: '-1.4px',
                  color: theme.palette.text.primary,
                }}
              >
                Welcome back
              </Typography>

              <Typography
                sx={{
                  mt: 1.2,
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: theme.palette.text.secondary,
                  maxWidth: 390,
                }}
              >
                Sign in to your account to continue where
                you left off.
              </Typography>
            </Box>

            {/* ERROR */}
            {loginError && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: '14px',
                  alignItems: 'center',
                  animation: 'errorShake .4s ease',

                  '@keyframes errorShake': {
                    '0%, 100%': {
                      transform: 'translateX(0)',
                    },
                    '25%': {
                      transform: 'translateX(-5px)',
                    },
                    '75%': {
                      transform: 'translateX(5px)',
                    },
                  },
                }}
              >
                {loginError}
              </Alert>
            )}

            {/* FORM */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* EMAIL */}
              <TextField
                fullWidth
                required
                id="email"
                name="email"
                label="Email address"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email
                        sx={{
                          fontSize: 20,
                          color: errors.email
                            ? 'error.main'
                            : alpha(primary, 0.7),
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2.4,

                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    minHeight: 58,
                    transition: 'all .25s ease',
                    backgroundColor: alpha(primary, 0.018),

                    '&:hover': {
                      backgroundColor: alpha(primary, 0.035),
                    },

                    '&.Mui-focused': {
                      backgroundColor: 'transparent',
                      boxShadow: `0 0 0 4px ${alpha(
                        primary,
                        0.08
                      )}`,
                    },
                  },

                  '& .MuiInputLabel-root.Mui-focused': {
                    color: primary,
                  },
                }}
              />

              {/* PASSWORD */}
              <TextField
                fullWidth
                required
                id="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock
                        sx={{
                          fontSize: 20,
                          color: errors.password
                            ? 'error.main'
                            : alpha(primary, 0.7),
                        }}
                      />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{
                          mr: 0.2,
                          color: theme.palette.text.secondary,

                          '&:hover': {
                            color: primary,
                            backgroundColor: alpha(
                              primary,
                              0.06
                            ),
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
                sx={{
                  mb: 1.2,

                  '& .MuiOutlinedInput-root': {
                    borderRadius: '15px',
                    minHeight: 58,
                    transition: 'all .25s ease',
                    backgroundColor: alpha(primary, 0.018),

                    '&:hover': {
                      backgroundColor: alpha(primary, 0.035),
                    },

                    '&.Mui-focused': {
                      backgroundColor: 'transparent',
                      boxShadow: `0 0 0 4px ${alpha(
                        primary,
                        0.08
                      )}`,
                    },
                  },

                  '& .MuiInputLabel-root.Mui-focused': {
                    color: primary,
                  },
                }}
              />

              {/* FORGOT PASSWORD */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  mb: 3,
                }}
              >
                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    fontSize: 13,
                    fontWeight: 750,
                    color: primary,
                    cursor: 'pointer',

                    '&:hover': {
                      color: secondary,
                    },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              {/* SUBMIT */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                endIcon={
                  !isSubmitting ? <ArrowForward /> : undefined
                }
                sx={{
                  minHeight: 58,
                  borderRadius: '15px',
                  textTransform: 'none',
                  fontSize: 15,
                  fontWeight: 850,
                  letterSpacing: 0.1,
                  color: '#fff',

                  background: `linear-gradient(
                    135deg,
                    ${primary} 0%,
                    ${secondary} 100%
                  )`,

                  boxShadow: `
                    0 14px 28px ${alpha(primary, 0.2)}
                  `,

                  transition:
                    'transform .25s ease, box-shadow .25s ease',

                  '&:hover': {
                    background: `linear-gradient(
                      135deg,
                      ${secondary} 0%,
                      ${primary} 100%
                    )`,
                    transform: 'translateY(-2px)',
                    boxShadow: `
                      0 18px 35px ${alpha(primary, 0.28)}
                    `,
                  },

                  '&:active': {
                    transform: 'translateY(0)',
                  },

                  '&.Mui-disabled': {
                    color: alpha('#fff', 0.85),
                    background: alpha(primary, 0.55),
                  },
                }}
              >
                {isSubmitting ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                    }}
                  >
                    <CircularProgress
                      size={19}
                      thickness={4}
                      sx={{
                        color: '#fff',
                      }}
                    />

                    <span>Signing in...</span>
                  </Box>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* SECURITY NOTE */}
              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.8,
                  color: theme.palette.text.secondary,
                }}
              >
                <Security sx={{ fontSize: 16 }} />

                <Typography
                  sx={{
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  Your account information is protected
                </Typography>
              </Box>
            </Box>

            {/* MOBILE HOME */}
            <Box
              sx={{
                display: {
                  xs: 'flex',
                  sm: 'none',
                },
                justifyContent: 'center',
                mt: 3,
              }}
            >
              <Button
                onClick={() => navigate('/')}
                startIcon={<ArrowBack />}
                sx={{
                  color: primary,
                  textTransform: 'none',
                  fontWeight: 750,
                }}
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;