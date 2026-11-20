// src/pages/LoginPage.tsx

import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  CleaningServices,
  Home,
  Shield,
  Star,
  Verified,
} from '@mui/icons-material';

import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

import LoginForm from './auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';

import { COLORS } from '../utils/constants';
import type { User, LoginHandler } from '../types';

interface LoginPageProps {
  onLogin: LoginHandler;
}

interface PreviewSlide {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}

const previewSlides: PreviewSlide[] = [
  {
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1800&q=90',
    eyebrow: 'PROFESSIONAL CLEANING',
    title: 'Excellence in every clean.',
    description:
      'Professional cleaning solutions for homes, offices and commercial spaces.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1800&q=90',
    eyebrow: 'FRESH SPACES',
    title: 'Clean spaces. Better living.',
    description:
      'We help create fresh, comfortable environments you can be proud of.',
  },
  {
    image:
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=90',
    eyebrow: 'HOMES & BUSINESSES',
    title: 'Made for modern spaces.',
    description:
      'Reliable cleaning services tailored around the way you use your space.',
  },
];

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [tabValue, setTabValue] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = previewSlides[currentSlide];

  /*
   * Stable decorative circles.
   * These are deliberately fixed instead of using Math.random()
   * inside the render function.
   */
  const decorativeCircles = useMemo(
    () => [
      {
        size: 190,
        top: '8%',
        left: '72%',
        duration: 7,
        delay: 0,
      },
      {
        size: 110,
        top: '62%',
        left: '8%',
        duration: 9,
        delay: 1,
      },
      {
        size: 260,
        top: '72%',
        left: '70%',
        duration: 11,
        delay: 2,
      },
      {
        size: 75,
        top: '28%',
        left: '16%',
        duration: 6,
        delay: 1.5,
      },
      {
        size: 145,
        top: '45%',
        left: '82%',
        duration: 8,
        delay: .5,
      },
      {
        size: 95,
        top: '78%',
        left: '38%',
        duration: 10,
        delay: 2.5,
      },
    ],
    []
  );

  /*
   * Automatic preview slideshow.
   */
  useEffect(() => {
    if (isMobile) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => {
        return (previous + 1) % previewSlides.length;
      });
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isMobile]);

  /*
   * Register handler.
   */
  const handleRegister = (userData: User) => {
    const mockToken = `mock_token_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;

    onLogin(userData, mockToken);
  };

  /*
   * Navigation.
   */
  const goHome = () => {
    window.location.href = '/';
  };

  const previousSlide = () => {
    setCurrentSlide(
      (previous) =>
        (previous - 1 + previewSlides.length) % previewSlides.length
    );
  };

  const nextSlide = () => {
    setCurrentSlide(
      (previous) => (previous + 1) % previewSlides.length
    );
  };

  /*
   * Form animation.
   */
  const formVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 25,
      scale: 0.985,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },

    exit: {
      opacity: 0,
      y: -20,
      scale: 0.985,
      transition: {
        duration: 0.28,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        position: 'relative',
        overflow: isMobile ? 'auto' : 'hidden',
        bgcolor: isDark ? COLORS.background : '#F4F7FB',
      }}
    >
      {/* =========================================================
          LEFT VISUAL SIDE
      ========================================================== */}

      {!isMobile && (
        <Box
          sx={{
            width: '53%',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            bgcolor: COLORS.primary,
          }}
        >
          {/* Current image */}
          <AnimatePresence mode="sync">
            <motion.img
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              initial={{
                opacity: 0,
                scale: 1.08,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 1.03,
              }}
              transition={{
                opacity: {
                  duration: 1,
                },
                scale: {
                  duration: 6,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </AnimatePresence>

          {/* Dark gradient */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `
                linear-gradient(
                  135deg,
                  rgba(3,18,48,.96) 0%,
                  rgba(5,35,97,.72) 45%,
                  rgba(5,35,97,.25) 100%
                )
              `,
              zIndex: 1,
            }}
          />

          {/* Bottom gradient */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(0deg, rgba(2,12,30,.9) 0%, rgba(2,12,30,.1) 65%)',
              zIndex: 1,
            }}
          />

          {/* Decorative circles */}
          {decorativeCircles.map((circle, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                width: circle.size,
                height: circle.size,
                top: circle.top,
                left: circle.left,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,.12)',
                background: 'rgba(255,255,255,.025)',
                backdropFilter: 'blur(2px)',
                zIndex: 2,
                animation: `loginCircleFloat${index} ${circle.duration}s ease-in-out ${circle.delay}s infinite`,
                [`@keyframes loginCircleFloat${index}`]: {
                  '0%, 100%': {
                    transform: 'translate3d(0,0,0) rotate(0deg)',
                  },
                  '50%': {
                    transform: 'translate3d(0,-22px,0) rotate(8deg)',
                  },
                },
              }}
            />
          ))}

          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <Box
            sx={{
              position: 'relative',
              zIndex: 4,
              minHeight: '100vh',
              p: {
                md: 5,
                lg: 7,
              },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Top brand */}
            <motion.div
              initial={{
                opacity: 0,
                y: -25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: .7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 2.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255,255,255,.12)',
                      border:
                        '1px solid rgba(255,255,255,.2)',
                      backdropFilter: 'blur(15px)',
                      boxShadow:
                        '0 15px 40px rgba(0,0,0,.2)',
                    }}
                  >
                    <CleaningServices
                      sx={{
                        color: '#fff',
                        fontSize: 29,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '1.1rem',
                        fontWeight: 850,
                        lineHeight: 1,
                        letterSpacing: '.01em',
                      }}
                    >
                      FaithsCleanPro
                    </Typography>

                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,.62)',
                        fontSize: '.68rem',
                        fontWeight: 700,
                        mt: .6,
                        letterSpacing: '.13em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Professional Cleaning
                    </Typography>
                  </Box>
                </Box>

                {/* Home button */}
                <Button
                  type="button"
                  onClick={goHome}
                  startIcon={<Home />}
                  sx={{
                    color: '#fff',
                    px: 2,
                    py: 1,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 750,
                    bgcolor: 'rgba(255,255,255,.09)',
                    border:
                      '1px solid rgba(255,255,255,.18)',
                    backdropFilter: 'blur(12px)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,.17)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all .25s ease',
                  }}
                >
                  Home
                </Button>
              </Box>
            </motion.div>

            {/* Middle content */}
            <Box
              sx={{
                maxWidth: 650,
                mt: 8,
                mb: 6,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{
                    opacity: 0,
                    x: -35,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: 25,
                  }}
                  transition={{
                    duration: .65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Eyebrow */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: .8,
                      borderRadius: 99,
                      bgcolor: 'rgba(255,255,255,.1)',
                      border:
                        '1px solid rgba(255,255,255,.17)',
                      backdropFilter: 'blur(10px)',
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: '#62EFA9',
                        boxShadow:
                          '0 0 0 5px rgba(98,239,169,.12)',
                      }}
                    />

                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '.7rem',
                        fontWeight: 800,
                        letterSpacing: '.12em',
                      }}
                    >
                      {slide.eyebrow}
                    </Typography>
                  </Box>

                  {/* Heading */}
                  <Typography
                    component="h1"
                    sx={{
                      color: '#fff',
                      fontSize: {
                        md: '3.4rem',
                        lg: '4.4rem',
                      },
                      fontWeight: 900,
                      lineHeight: 1.02,
                      letterSpacing: '-.055em',
                      maxWidth: 620,
                    }}
                  >
                    {slide.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      mt: 2.5,
                      color: 'rgba(255,255,255,.74)',
                      fontSize: {
                        md: '1rem',
                        lg: '1.08rem',
                      },
                      lineHeight: 1.75,
                      maxWidth: 560,
                    }}
                  >
                    {slide.description}
                  </Typography>
                </motion.div>
              </AnimatePresence>

              {/* Feature row */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 4,
                }}
              >
                {[
                  {
                    icon: <Verified />,
                    label: 'Trusted',
                  },
                  {
                    icon: <CheckCircle />,
                    label: 'Reliable',
                  },
                  {
                    icon: <Shield />,
                    label: 'Professional',
                  },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: .7,
                      px: 1.4,
                      py: 1,
                      borderRadius: 2,
                      bgcolor:
                        'rgba(255,255,255,.08)',
                      border:
                        '1px solid rgba(255,255,255,.12)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        color: '#fff',
                        '& svg': {
                          fontSize: 16,
                        },
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,.82)',
                        fontSize: '.72rem',
                        fontWeight: 750,
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Bottom */}
            <Box>
              {/* Controls */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  maxWidth: 610,
                }}
              >
                {/* Dots */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: .8,
                  }}
                >
                  {previewSlides.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      sx={{
                        width:
                          index === currentSlide
                            ? 34
                            : 8,
                        height: 6,
                        borderRadius: 99,
                        bgcolor:
                          index === currentSlide
                            ? '#fff'
                            : 'rgba(255,255,255,.3)',
                        cursor: 'pointer',
                        transition:
                          'all .35s cubic-bezier(.16,1,.3,1)',
                      }}
                    />
                  ))}
                </Box>

                {/* Arrows */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Button
                    type="button"
                    onClick={previousSlide}
                    sx={{
                      minWidth: 44,
                      width: 44,
                      height: 44,
                      p: 0,
                      color: '#fff',
                      borderRadius: 2.5,
                      border:
                        '1px solid rgba(255,255,255,.2)',
                      bgcolor:
                        'rgba(255,255,255,.08)',
                      '&:hover': {
                        bgcolor:
                          'rgba(255,255,255,.16)',
                      },
                    }}
                  >
                    <ArrowBack fontSize="small" />
                  </Button>

                  <Button
                    type="button"
                    onClick={nextSlide}
                    sx={{
                      minWidth: 44,
                      width: 44,
                      height: 44,
                      p: 0,
                      color: '#fff',
                      borderRadius: 2.5,
                      border:
                        '1px solid rgba(255,255,255,.2)',
                      bgcolor:
                        'rgba(255,255,255,.08)',
                      '&:hover': {
                        bgcolor:
                          'rgba(255,255,255,.16)',
                      },
                    }}
                  >
                    <ArrowForward fontSize="small" />
                  </Button>
                </Box>
              </Box>

              {/* Copyright */}
              <Typography
                sx={{
                  color: 'rgba(255,255,255,.42)',
                  fontSize: '.68rem',
                  mt: 3,
                }}
              >
                © {new Date().getFullYear()} FaithsCleanPro
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* =========================================================
          RIGHT SIDE
      ========================================================== */}

      <Box
        sx={{
          width: isMobile ? '100%' : '47%',
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          bgcolor: isDark ? COLORS.background : '#F7F9FC',
          px: {
            xs: 2,
            sm: 4,
            md: 5,
            lg: 8,
          },
          py: {
            xs: 3,
            sm: 5,
            md: 6,
          },
        }}
      >
        {/* Right-side decorative glow */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            top: -200,
            right: -170,
            background: `radial-gradient(circle, ${COLORS.primary}12 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            bottom: -160,
            left: -130,
            background:
              'radial-gradient(circle, #E923DA10 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <Container
          maxWidth="sm"
          disableGutters
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
          }}
        >
          {/* Mobile header */}
          {isMobile && (
            <Box
              sx={{
                textAlign: 'center',
                mb: 4,
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 58,
                  height: 58,
                  borderRadius: 3,
                  bgcolor: COLORS.primary,
                  boxShadow:
                    `0 15px 35px ${COLORS.primary}30`,
                  mb: 1.5,
                }}
              >
                <CleaningServices
                  sx={{
                    color: '#fff',
                    fontSize: 29,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  fontSize: '1.25rem',
                  fontWeight: 850,
                }}
              >
                FaithsCleanPro
              </Typography>

              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '.72rem',
                  mt: .4,
                }}
              >
                Professional Cleaning Solutions
              </Typography>
            </Box>
          )}

          {/* Mobile Home button */}
          {isMobile && (
            <Button
              type="button"
              onClick={goHome}
              startIcon={<Home />}
              sx={{
                position: 'absolute',
                top: -10,
                right: 0,
                minWidth: 'auto',
                px: 1.6,
                py: .9,
                borderRadius: 2,
                color: COLORS.primary,
                bgcolor: isDark
                  ? 'rgba(255,255,255,.06)'
                  : '#fff',
                border: `1px solid ${
                  isDark
                    ? 'rgba(255,255,255,.1)'
                    : 'rgba(5,35,97,.08)'
                }`,
                textTransform: 'none',
                fontWeight: 750,
              }}
            >
              Home
            </Button>
          )}

          {/* =====================================================
              TAB SWITCHER
          ====================================================== */}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3.5,
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                p: .6,
                borderRadius: 3,
                bgcolor: isDark
                  ? 'rgba(255,255,255,.05)'
                  : '#fff',
                border: `1px solid ${
                  isDark
                    ? 'rgba(255,255,255,.08)'
                    : 'rgba(5,35,97,.07)'
                }`,
                boxShadow: isDark
                  ? 'none'
                  : '0 10px 30px rgba(5,35,97,.05)',
              }}
            >
              <Button
                type="button"
                onClick={() => setTabValue(0)}
                sx={{
                  minWidth: {
                    xs: 105,
                    sm: 125,
                  },
                  py: 1.1,
                  px: 2,
                  borderRadius: 2.3,
                  color:
                    tabValue === 0
                      ? '#fff'
                      : theme.palette.text.secondary,
                  bgcolor:
                    tabValue === 0
                      ? COLORS.primary
                      : 'transparent',
                  fontWeight: 800,
                  textTransform: 'none',
                  boxShadow:
                    tabValue === 0
                      ? `0 8px 20px ${COLORS.primary}28`
                      : 'none',
                  '&:hover': {
                    bgcolor:
                      tabValue === 0
                        ? COLORS.primary
                        : 'rgba(5,35,97,.04)',
                  },
                }}
              >
                Sign In
              </Button>

              <Button
                type="button"
                onClick={() => setTabValue(1)}
                sx={{
                  minWidth: {
                    xs: 105,
                    sm: 125,
                  },
                  py: 1.1,
                  px: 2,
                  borderRadius: 2.3,
                  color:
                    tabValue === 1
                      ? '#fff'
                      : theme.palette.text.secondary,
                  bgcolor:
                    tabValue === 1
                      ? COLORS.primary
                      : 'transparent',
                  fontWeight: 800,
                  textTransform: 'none',
                  boxShadow:
                    tabValue === 1
                      ? `0 8px 20px ${COLORS.primary}28`
                      : 'none',
                  '&:hover': {
                    bgcolor:
                      tabValue === 1
                        ? COLORS.primary
                        : 'rgba(5,35,97,.04)',
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>

          {/* =====================================================
              FORM CARD
          ====================================================== */}

          <AnimatePresence mode="wait">
            <motion.div
              key={tabValue}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: '100%',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  p: {
                    xs: 2.2,
                    sm: 3,
                    md: 4,
                  },
                  borderRadius: {
                    xs: 3,
                    sm: 4,
                  },
                  bgcolor: isDark
                    ? 'rgba(28,34,43,.92)'
                    : 'rgba(255,255,255,.96)',
                  backdropFilter: 'blur(18px)',
                  border: `1px solid ${
                    isDark
                      ? 'rgba(255,255,255,.08)'
                      : 'rgba(5,35,97,.07)'
                  }`,
                  boxShadow: isDark
                    ? '0 25px 70px rgba(0,0,0,.25)'
                    : '0 25px 70px rgba(5,35,97,.09)',
                }}
              >
                {/* Top gradient line */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${COLORS.primary}, #E923DA)`,
                  }}
                />

                {/* Heading */}
                <Box
                  sx={{
                    textAlign: 'center',
                    mb: 3.2,
                  }}
                >
                  <Typography
                    component="h2"
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 850,
                      fontSize: {
                        xs: '1.75rem',
                        sm: '2rem',
                      },
                      letterSpacing: '-.035em',
                      lineHeight: 1.1,
                    }}
                  >
                    {tabValue === 0
                      ? 'Welcome Back'
                      : 'Create Account'}
                  </Typography>

                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontSize: '.84rem',
                      lineHeight: 1.65,
                      mt: 1,
                    }}
                  >
                    {tabValue === 0
                      ? 'Sign in to continue to your FaithsCleanPro account.'
                      : 'Create your account and start your journey with us.'}
                  </Typography>
                </Box>

                {/* Form */}
                {tabValue === 0 ? (
                  <LoginForm onLogin={onLogin} />
                ) : (
                  <RegisterForm
                    onRegister={handleRegister}
                    onSwitchToLogin={() =>
                      setTabValue(0)
                    }
                  />
                )}
              </Paper>
            </motion.div>
          </AnimatePresence>

          {/* =====================================================
              BOTTOM TRUST MESSAGE
          ====================================================== */}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              mt: 3,
            }}
          >
            <Star
              sx={{
                color: '#E923DA',
                fontSize: 17,
              }}
            />

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '.7rem',
                fontWeight: 600,
              }}
            >
              Professional service you can trust
            </Typography>

            <Star
              sx={{
                color: '#E923DA',
                fontSize: 17,
              }}
            />
          </Box>

          {/* Desktop back home */}
          {!isMobile && (
            <Box
              sx={{
                textAlign: 'center',
                mt: 2,
              }}
            >
              <Button
                type="button"
                onClick={goHome}
                startIcon={<Home sx={{ fontSize: 16 }} />}
                sx={{
                  color: 'text.secondary',
                  fontSize: '.72rem',
                  fontWeight: 650,
                  textTransform: 'none',
                  '&:hover': {
                    color: COLORS.primary,
                    bgcolor: 'transparent',
                  },
                }}
              >
                Back to Home
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage;