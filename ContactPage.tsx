import React, { useState } from 'react';

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Stack,
  Chip,
  Avatar,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';

import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  ArrowForward,
  CheckCircle,
  CleaningServices,
  Send,
  SupportAgent,
  HomeWork,
  Business,
  Window,
  AutoAwesome,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/constants';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isDark = theme.palette.mode === 'dark';

  const primary = COLORS.primary || '#052361';
  const accent = '#E923DA';
  const secondary = COLORS.secondary || '#0B4AA2';

  const background = isDark ? '#050b16' : '#f7f9fd';
  const surface = isDark ? '#0b1424' : '#ffffff';
  const surfaceSoft = isDark ? '#0e1b2e' : '#f1f5fa';

  const primaryText = isDark ? '#ffffff' : '#101828';

  const secondaryText = isDark
    ? 'rgba(255,255,255,0.68)'
    : 'rgba(16,24,40,0.66)';

  const borderColor = isDark
    ? 'rgba(255,255,255,0.09)'
    : 'rgba(5,35,97,0.09)';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /*
   * ---------------------------------------------------------
   * FORM HANDLING
   * ---------------------------------------------------------
   */

  const handleChange =
    (field: string) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  /*
   * ---------------------------------------------------------
   * CONTACT INFORMATION
   * ---------------------------------------------------------
   */

  const contactCards = [
    {
      icon: <Phone />,
      title: 'Call Us',
      value: '+256 700 000 000',
      description: 'Speak directly with our team.',
    },
    {
      icon: <Email />,
      title: 'Email Us',
      value: 'info@faithscleanpro.com',
      description: 'Send us your cleaning request.',
    },
    {
      icon: <LocationOn />,
      title: 'Our Location',
      value: 'Uganda',
      description: 'Serving homes and businesses.',
    },
    {
      icon: <AccessTime />,
      title: 'Working Hours',
      value: 'Mon - Sat',
      description: 'Available for scheduled services.',
    },
  ];

  const services = [
    'Residential Cleaning',
    'Commercial Cleaning',
    'Window Cleaning',
    'Carpet & Upholstery Cleaning',
    'Deep Cleaning',
    'Post-Construction Cleaning',
    'Custom Cleaning Service',
  ];

  const benefits = [
    {
      icon: <CheckCircle />,
      title: 'Professional Team',
      text: 'Our cleaning approach focuses on quality, consistency and attention to detail.',
    },
    {
      icon: <CleaningServices />,
      title: 'Tailored Services',
      text: 'We adapt our cleaning solutions to the needs of your home or business.',
    },
    {
      icon: <SupportAgent />,
      title: 'Easy Communication',
      text: 'Reach our team easily and tell us exactly what you need.',
    },
  ];

  const serviceSpaces = [
    {
      icon: <HomeWork />,
      label: 'Homes',
    },
    {
      icon: <Business />,
      label: 'Offices',
    },
    {
      icon: <Window />,
      label: 'Windows',
    },
    {
      icon: <CleaningServices />,
      label: 'Deep Cleaning',
    },
  ];

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: `
          radial-gradient(
            circle at 5% 12%,
            ${alpha(accent, isDark ? 0.075 : 0.045)} 0,
            transparent 25%
          ),
          radial-gradient(
            circle at 95% 48%,
            ${alpha(primary, isDark ? 0.18 : 0.065)} 0,
            transparent 30%
          ),
          ${background}
        `,
        color: primaryText,
        overflow: 'hidden',
        fontFamily:
          '"Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',

        /*
         * =====================================================
         * ANIMATIONS
         * =====================================================
         */

        '@keyframes flyIn': {
          from: {
            opacity: 0,
            transform: 'translate3d(0, 60px, 0) scale(.96)',
            filter: 'blur(7px)',
          },
          to: {
            opacity: 1,
            transform: 'translate3d(0,0,0) scale(1)',
            filter: 'blur(0)',
          },
        },

        '@keyframes flyInLeft': {
          from: {
            opacity: 0,
            transform: 'translate3d(-70px, 20px, 0)',
            filter: 'blur(6px)',
          },
          to: {
            opacity: 1,
            transform: 'translate3d(0,0,0)',
            filter: 'blur(0)',
          },
        },

        '@keyframes flyInRight': {
          from: {
            opacity: 0,
            transform: 'translate3d(70px, 20px, 0)',
            filter: 'blur(6px)',
          },
          to: {
            opacity: 1,
            transform: 'translate3d(0,0,0)',
            filter: 'blur(0)',
          },
        },

        '@keyframes floatOne': {
          '0%, 100%': {
            transform: 'translate3d(0,0,0)',
          },
          '50%': {
            transform: 'translate3d(0,-22px,0)',
          },
        },

        '@keyframes floatTwo': {
          '0%, 100%': {
            transform: 'translate3d(0,0,0) rotate(0deg)',
          },
          '50%': {
            transform: 'translate3d(18px,20px,0) rotate(7deg)',
          },
        },

        '@keyframes floatThree': {
          '0%, 100%': {
            transform: 'translate3d(0,0,0) scale(1)',
          },
          '50%': {
            transform: 'translate3d(-12px,-18px,0) scale(1.08)',
          },
        },

        '@keyframes rotateSlow': {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(360deg)',
          },
        },

        '@keyframes pulseGlow': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: 0.35,
          },
          '50%': {
            transform: 'scale(1.15)',
            opacity: 0.7,
          },
        },

        '@keyframes gradientMove': {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },

        '@keyframes cardFloat': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-6px)',
          },
        },

        '@keyframes checkPop': {
          from: {
            opacity: 0,
            transform: 'scale(.5)',
          },
          to: {
            opacity: 1,
            transform: 'scale(1)',
          },
        },

        /*
         * =====================================================
         * REDUCED MOTION
         * =====================================================
         */

        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animationDuration: '0.001ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.001ms !important',
          },
        },
      }}
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <Box
        sx={{
          position: 'relative',
          minHeight: {
            xs: 620,
            sm: 660,
            md: 735,
          },
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          isolation: 'isolate',
          color: '#fff',

          background: `
            radial-gradient(
              circle at 88% 15%,
              ${alpha(accent, 0.27)} 0,
              transparent 25%
            ),
            radial-gradient(
              circle at 8% 92%,
              ${alpha('#4f8cff', 0.18)} 0,
              transparent 30%
            ),
            linear-gradient(
              135deg,
              ${primary} 0%,
              #071a48 48%,
              #110b2b 100%
            )
          `,

          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            opacity: 0.13,
            backgroundImage: `
              linear-gradient(
                ${alpha('#fff', 0.06)} 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                ${alpha('#fff', 0.06)} 1px,
                transparent 1px
              )
            `,
            backgroundSize: '46px 46px',
            maskImage:
              'linear-gradient(to bottom, black 0%, transparent 90%)',
            pointerEvents: 'none',
          },

          '&:after': {
            content: '""',
            position: 'absolute',
            width: 700,
            height: 700,
            borderRadius: '50%',
            right: '-380px',
            bottom: '-430px',
            border: `1px solid ${alpha('#fff', 0.07)}`,
            boxShadow: `
              0 0 0 90px ${alpha('#fff', 0.018)},
              0 0 0 180px ${alpha('#fff', 0.012)}
            `,
            pointerEvents: 'none',
            animation: 'rotateSlow 45s linear infinite',
          },
        }}
      >
        {/* FLOATING ORB */}
        <Box
          sx={{
            position: 'absolute',
            width: {
              xs: 160,
              md: 270,
            },
            height: {
              xs: 160,
              md: 270,
            },
            borderRadius: '50%',
            right: {
              xs: -80,
              md: -70,
            },
            top: {
              xs: -45,
              md: -75,
            },
            background: alpha(accent, 0.18),
            filter: 'blur(4px)',
            animation: 'floatOne 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* SECOND ORB */}
        <Box
          sx={{
            position: 'absolute',
            width: {
              xs: 110,
              md: 180,
            },
            height: {
              xs: 110,
              md: 180,
            },
            borderRadius: '50%',
            left: {
              xs: -55,
              md: -40,
            },
            bottom: {
              xs: 60,
              md: 50,
            },
            background: alpha('#4f8cff', 0.14),
            filter: 'blur(3px)',
            animation: 'floatTwo 9s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        {/* RING */}
        <Box
          sx={{
            position: 'absolute',
            width: 145,
            height: 145,
            right: '17%',
            bottom: '12%',
            borderRadius: '50%',
            border: `1px solid ${alpha('#fff', 0.14)}`,
            animation: 'rotateSlow 24s linear infinite',
            display: {
              xs: 'none',
              md: 'block',
            },
            pointerEvents: 'none',
          }}
        />

        {/* PARTICLES */}
        {[1, 2, 3, 4, 5, 6].map((particle) => (
          <Box
            key={particle}
            sx={{
              position: 'absolute',
              width: particle % 2 === 0 ? 7 : 5,
              height: particle % 2 === 0 ? 7 : 5,
              borderRadius: '50%',
              background: alpha('#fff', 0.4),
              left: `${10 + particle * 13}%`,
              top: `${15 + ((particle * 12) % 65)}%`,
              animation:
                particle % 2 === 0
                  ? 'floatOne 5s ease-in-out infinite'
                  : 'floatTwo 6s ease-in-out infinite',
              animationDelay: `${particle * 250}ms`,
              pointerEvents: 'none',
            }}
          />
        ))}

        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 3,
            py: {
              xs: 8,
              md: 12,
            },
          }}
        >
          <Box
            sx={{
              maxWidth: 830,
              animation: 'flyIn 1s cubic-bezier(.16,1,.3,1)',
            }}
          >
            {/* BADGE */}

            <Chip
              icon={
                <CleaningServices
                  sx={{
                    color: '#fff !important',
                  }}
                />
              }
              label="LET'S TALK CLEANING"
              sx={{
                mb: 2.5,
                px: 0.7,
                color: '#fff',
                background: alpha('#fff', 0.09),
                border: `1px solid ${alpha('#fff', 0.16)}`,
                backdropFilter: 'blur(14px)',
                fontWeight: 900,
                letterSpacing: 1.4,
                boxShadow: `0 12px 35px ${alpha('#000', 0.12)}`,
                animation:
                  'flyIn 0.8s .05s cubic-bezier(.16,1,.3,1) both',
              }}
            />

            {/* HEADING */}

            <Typography
              component="h1"
              sx={{
                fontWeight: 950,
                fontSize: {
                  xs: '2.8rem',
                  sm: '4rem',
                  md: '5.2rem',
                  lg: '5.8rem',
                },
                lineHeight: 0.96,
                letterSpacing: '-0.065em',
                textShadow: `0 18px 55px ${alpha('#000', 0.2)}`,
                animation:
                  'flyIn 1s .14s cubic-bezier(.16,1,.3,1) both',
              }}
            >
              Let's make your space

              <Box
                component="span"
                sx={{
                  display: 'block',
                  mt: 0.8,
                  background:
                    'linear-gradient(90deg, #ff58e9, #ff9af4, #ffffff)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation:
                    'gradientMove 6s ease infinite, flyIn 1s .22s cubic-bezier(.16,1,.3,1) both',
                }}
              >
                beautifully clean.
              </Box>
            </Typography>

            {/* DESCRIPTION */}

            <Typography
              sx={{
                maxWidth: 670,
                mt: 3,
                fontSize: {
                  xs: '1rem',
                  sm: '1.12rem',
                },
                lineHeight: 1.85,
                color: alpha('#fff', 0.74),
                animation:
                  'flyIn 1s .32s cubic-bezier(.16,1,.3,1) both',
              }}
            >
              Have a home, office or commercial space that needs attention?
              Tell us what you need and our team will help you find the right
              cleaning solution.
            </Typography>

            {/* BUTTONS */}

            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              spacing={1.5}
              sx={{
                pt: 3,
                animation:
                  'flyIn 1s .42s cubic-bezier(.16,1,.3,1) both',
              }}
            >
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={() =>
                  document
                    .getElementById('contact-form')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                }
                sx={{
                  minHeight: 55,
                  px: 3.2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 900,
                  background: accent,
                  boxShadow: `0 18px 45px ${alpha(accent, 0.28)}`,
                  transition: 'all .3s ease',

                  '&:hover': {
                    background: '#d51ac7',
                    transform: 'translateY(-4px)',
                    boxShadow: `0 24px 52px ${alpha(accent, 0.38)}`,
                  },
                }}
              >
                Send an Enquiry
              </Button>

              <Button
                variant="outlined"
                startIcon={<Phone />}
                onClick={() =>
                  document
                    .getElementById('contact-details')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                }
                sx={{
                  minHeight: 55,
                  px: 3.2,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 850,
                  color: '#fff',
                  borderColor: alpha('#fff', 0.22),
                  background: alpha('#fff', 0.025),
                  backdropFilter: 'blur(10px)',
                  transition: 'all .3s ease',

                  '&:hover': {
                    borderColor: alpha('#fff', 0.65),
                    background: alpha('#fff', 0.08),
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                Contact Our Team
              </Button>
            </Stack>

            {/* TAGLINE */}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                mt: 3,
                color: alpha('#fff', 0.6),
                animation:
                  'flyIn 1s .52s cubic-bezier(.16,1,.3,1) both',
              }}
            >
              <AutoAwesome
                sx={{
                  fontSize: 17,
                  color: '#ff75ee',
                  animation: 'floatThree 3s ease-in-out infinite',
                }}
              />

              <Typography
                sx={{
                  fontSize: '.82rem',
                  fontWeight: 700,
                }}
              >
                Professional cleaning. Simple communication. Better spaces.
              </Typography>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* =====================================================
          CONTACT CARDS
      ===================================================== */}

      <Container
        id="contact-details"
        maxWidth="lg"
        sx={{
          mt: {
            xs: 2,
            sm: 3,
            md: -6,
          },
          px: {
            xs: 1.5,
            sm: 2,
            md: 0,
          },
          position: 'relative',
          zIndex: 5,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {contactCards.map((card, index) => (
            <Paper
              key={card.title}
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  sm: 2.75,
                  md: 3,
                },
                minHeight: {
                  xs: 170,
                  md: 195,
                },
                borderRadius: {
                  xs: 4,
                  md: 4.5,
                },
                background: isDark
                  ? `linear-gradient(145deg, ${surface}, ${alpha(
                      '#14243e',
                      0.9
                    )})`
                  : 'linear-gradient(145deg, #ffffff, #f8faff)',
                border: `1px solid ${borderColor}`,
                boxShadow: isDark
                  ? '0 24px 65px rgba(0,0,0,.26)'
                  : '0 25px 65px rgba(5,35,97,.09)',
                position: 'relative',
                overflow: 'hidden',
                animation: `flyIn ${0.8 + index * 0.12}s ${
                  0.15 + index * 0.08
                }s cubic-bezier(.16,1,.3,1) both`,
                transition: 'all .4s cubic-bezier(.16,1,.3,1)',

                '&:before': {
                  content: '""',
                  position: 'absolute',
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  right: -90,
                  top: -90,
                  background: alpha(accent, 0.055),
                  transition: 'transform .5s ease',
                },

                '&:after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(
                    90deg,
                    transparent,
                    ${accent},
                    transparent
                  )`,
                  transform: 'scaleX(0)',
                  transition: 'transform .4s ease',
                },

                '&:hover': {
                  transform: 'translateY(-11px)',
                  borderColor: alpha(accent, 0.3),

                  boxShadow: isDark
                    ? `0 32px 75px rgba(0,0,0,.35)`
                    : `0 32px 75px rgba(5,35,97,.14)`,

                  '&:before': {
                    transform: 'scale(1.45)',
                  },

                  '&:after': {
                    transform: 'scaleX(1)',
                  },

                  '& .contact-avatar': {
                    transform: 'translateY(-5px) scale(1.08) rotate(-3deg)',
                  },
                },
              }}
            >
              <Avatar
                className="contact-avatar"
                sx={{
                  width: 56,
                  height: 56,
                  mb: 2.1,
                  border: `1px solid ${alpha(accent, 0.18)}`,
                  background: `linear-gradient(
                    135deg,
                    ${alpha(accent, 0.16)},
                    ${alpha(primary, 0.08)}
                  )`,
                  color: accent,
                  boxShadow: `0 10px 25px ${alpha(accent, 0.08)}`,
                  transition:
                    'transform .4s cubic-bezier(.16,1,.3,1)',
                }}
              >
                {card.icon}
              </Avatar>

              <Typography
                sx={{
                  fontWeight: 900,
                  mb: 0.55,
                  color: primaryText,
                }}
              >
                {card.title}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 850,
                  fontSize: '.92rem',
                  mb: 0.65,
                  color: primary,
                  wordBreak: 'break-word',
                }}
              >
                {card.value}
              </Typography>

              <Typography
                sx={{
                  fontSize: '.83rem',
                  lineHeight: 1.55,
                  color: secondaryText,
                }}
              >
                {card.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 8,
            md: 12,
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '0.82fr 1.18fr',
            },
            gap: {
              xs: 5,
              md: 7,
            },
            alignItems: 'start',
          }}
        >
          {/* LEFT CONTENT */}

          <Box
            sx={{
              animation:
                'flyInLeft 1s .2s cubic-bezier(.16,1,.3,1) both',
            }}
          >
            <Typography
              sx={{
                color: accent,
                fontWeight: 950,
                fontSize: '.78rem',
                letterSpacing: 2,
                mb: 1.6,
              }}
            >
              WHY CHOOSE US
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontWeight: 950,
                fontSize: {
                  xs: '2.15rem',
                  sm: '2.45rem',
                  md: '2.9rem',
                },
                lineHeight: 1.08,
                letterSpacing: '-.045em',
                mb: 2,
                color: primaryText,
              }}
            >
              A cleaner space starts with a simple conversation.
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                lineHeight: 1.85,
                mb: 4,
                fontSize: '.98rem',
              }}
            >
              Whether you need regular home cleaning, a deep clean, office
              cleaning or a specialised service, we are ready to understand
              your needs.
            </Typography>

            <Stack spacing={2}>
              {benefits.map((benefit, index) => (
                <Paper
                  key={benefit.title}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: {
                      xs: 1.8,
                      sm: 2,
                    },
                    borderRadius: 3.5,
                    background: surfaceSoft,
                    border: `1px solid ${borderColor}`,
                    animation: `flyInLeft .8s ${
                      0.25 + index * 0.12
                    }s cubic-bezier(.16,1,.3,1) both`,
                    transition: 'all .35s ease',

                    '&:hover': {
                      transform: 'translateX(8px)',
                      borderColor: alpha(accent, 0.28),
                      boxShadow: `0 16px 35px ${alpha(
                        primary,
                        isDark ? 0.14 : 0.07
                      )}`,

                      '& .benefit-icon': {
                        transform: 'scale(1.08) rotate(-4deg)',
                      },
                    },
                  }}
                >
                  <Avatar
                    className="benefit-icon"
                    sx={{
                      flexShrink: 0,
                      width: 48,
                      height: 48,
                      background: alpha(accent, 0.1),
                      color: accent,
                      transition:
                        'transform .35s cubic-bezier(.16,1,.3,1)',
                    }}
                  >
                    {benefit.icon}
                  </Avatar>

                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: primaryText,
                        mb: 0.55,
                      }}
                    >
                      {benefit.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '.86rem',
                        lineHeight: 1.65,
                        color: secondaryText,
                      }}
                    >
                      {benefit.text}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>

            {/* QUICK ANSWER */}

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2.7,
                borderRadius: 4,
                color: '#fff',
                background: `
                  radial-gradient(
                    circle at 90% 10%,
                    ${alpha(accent, 0.2)} 0,
                    transparent 30%
                  ),
                  linear-gradient(135deg, ${primary}, #101c43)
                `,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: `0 25px 55px ${alpha(primary, 0.14)}`,
                animation:
                  'flyInLeft .9s .55s cubic-bezier(.16,1,.3,1) both',
                transition: 'transform .35s ease',

                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 130,
                  height: 130,
                  borderRadius: '50%',
                  right: -50,
                  top: -60,
                  border: `1px solid ${alpha('#fff', 0.12)}`,
                  animation: 'pulseGlow 5s ease-in-out infinite',
                }}
              />

              <AutoAwesome
                sx={{
                  position: 'relative',
                  color: '#ff78ee',
                  fontSize: 25,
                  mb: 1,
                  animation: 'floatThree 3s ease-in-out infinite',
                }}
              />

              <Typography
                sx={{
                  position: 'relative',
                  fontWeight: 900,
                  fontSize: '1.08rem',
                  mb: 0.7,
                }}
              >
                Need a quick answer?
              </Typography>

              <Typography
                sx={{
                  position: 'relative',
                  fontSize: '.87rem',
                  color: alpha('#fff', 0.7),
                  lineHeight: 1.65,
                  mb: 2,
                }}
              >
                Our team is ready to help you choose the right service for
                your space.
              </Typography>

              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/services')}
                sx={{
                  position: 'relative',
                  color: '#fff',
                  borderColor: alpha('#fff', 0.24),
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 850,
                  transition: 'all .3s ease',

                  '&:hover': {
                    borderColor: '#fff',
                    background: alpha('#fff', 0.08),
                    transform: 'translateX(3px)',
                  },
                }}
              >
                Explore Services
              </Button>
            </Paper>
          </Box>

          {/* ===================================================
              CONTACT FORM
          =================================================== */}

          <Paper
            id="contact-form"
            elevation={0}
            sx={{
              p: {
                xs: 2.1,
                sm: 4,
                md: 5,
              },
              position: {
                md: 'sticky',
              },
              top: {
                md: 28,
              },
              borderRadius: {
                xs: 4,
                md: 5,
              },
              background: surface,
              border: `1px solid ${borderColor}`,
              boxShadow: isDark
                ? '0 30px 90px rgba(0,0,0,.3)'
                : '0 30px 90px rgba(5,35,97,.1)',
              overflow: 'hidden',
              animation:
                'flyInRight 1s .2s cubic-bezier(.16,1,.3,1) both',

              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: 3,
                borderRadius: '0 0 20px 20px',
                background: `linear-gradient(
                  90deg,
                  transparent,
                  ${accent},
                  transparent
                )`,
              },

              '& .MuiTextField-root': {
                '& .MuiInputLabel-root': {
                  fontWeight: 600,
                },

                '& .MuiOutlinedInput-root': {
                  borderRadius: 2.7,
                  background: isDark
                    ? alpha('#fff', 0.025)
                    : alpha(primary, 0.018),
                  transition: 'all .25s ease',

                  '&:hover': {
                    background: isDark
                      ? alpha('#fff', 0.045)
                      : alpha(primary, 0.028),
                  },

                  '&.Mui-focused': {
                    boxShadow: `0 0 0 4px ${alpha(accent, 0.1)}`,
                    transform: 'translateY(-1px)',
                  },
                },
              },
            }}
          >
            {!submitted ? (
              <>
                {/* FORM HEADER */}

                <Box sx={{ mb: 4 }}>
                  <Chip
                    icon={
                      <AutoAwesome
                        sx={{
                          fontSize: '17px !important',
                        }}
                      />
                    }
                    label="CONTACT FORM"
                    size="small"
                    sx={{
                      mb: 1.5,
                      color: accent,
                      background: alpha(accent, 0.09),
                      fontWeight: 950,
                      letterSpacing: 0.7,
                    }}
                  />

                  <Typography
                    component="h2"
                    sx={{
                      fontWeight: 950,
                      fontSize: {
                        xs: '1.85rem',
                        md: '2.3rem',
                      },
                      lineHeight: 1.1,
                      letterSpacing: '-.04em',
                      color: primaryText,
                      mb: 1,
                    }}
                  >
                    Tell us what you need
                  </Typography>

                  <Typography
                    sx={{
                      color: secondaryText,
                      lineHeight: 1.75,
                      fontSize: '.93rem',
                    }}
                  >
                    Fill in the form and our team can get back to you with
                    more information about your cleaning request.
                  </Typography>
                </Box>

                {/* FORM */}

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    value={form.name}
                    onChange={handleChange('name')}
                  />

                  <TextField
                    required
                    fullWidth
                    type="email"
                    label="Email Address"
                    value={form.email}
                    onChange={handleChange('email')}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={form.phone}
                    onChange={handleChange('phone')}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Service Needed"
                    value={form.service}
                    onChange={handleChange('service')}
                  >
                    <MenuItem value="">
                      Select a service
                    </MenuItem>

                    {services.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    label="Subject"
                    value={form.subject}
                    onChange={handleChange('subject')}
                    sx={{
                      gridColumn: {
                        xs: 'auto',
                        sm: '1 / -1',
                      },
                    }}
                  />

                  <TextField
                    required
                    fullWidth
                    multiline
                    minRows={5}
                    label="How can we help?"
                    placeholder="Tell us about the space or cleaning service you need..."
                    value={form.message}
                    onChange={handleChange('message')}
                    sx={{
                      gridColumn: {
                        xs: 'auto',
                        sm: '1 / -1',
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? undefined : <Send />}
                    sx={{
                      gridColumn: {
                        xs: 'auto',
                        sm: '1 / -1',
                      },
                      minHeight: 56,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 950,
                      fontSize: '1rem',
                      background: accent,
                      boxShadow: `0 16px 35px ${alpha(accent, 0.22)}`,
                      transition: 'all .3s ease',

                      '&:hover': {
                        background: '#d51ac7',
                        transform: 'translateY(-3px)',
                        boxShadow: `0 22px 45px ${alpha(accent, 0.3)}`,
                      },
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Cleaning Enquiry'}
                  </Button>
                </Box>
              </>
            ) : (
              /* SUCCESS STATE */

              <Box
                sx={{
                  minHeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  animation:
                    'flyIn .8s cubic-bezier(.16,1,.3,1)',
                }}
              >
                <Stack
                  alignItems="center"
                  spacing={2}
                  sx={{
                    maxWidth: 500,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 88,
                      height: 88,
                      background: alpha('#20b26b', 0.11),
                      color: '#20b26b',
                      boxShadow: `0 0 0 12px ${alpha(
                        '#20b26b',
                        0.045
                      )}`,
                      animation:
                        'pulseGlow 3s ease-in-out infinite',
                    }}
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 50,
                        animation:
                          'checkPop .6s cubic-bezier(.16,1,.3,1)',
                      }}
                    />
                  </Avatar>

                  <Typography
                    sx={{
                      fontSize: {
                        xs: '1.8rem',
                        md: '2.1rem',
                      },
                      fontWeight: 950,
                      letterSpacing: '-.035em',
                      color: primaryText,
                    }}
                  >
                    Enquiry received!
                  </Typography>

                  <Typography
                    sx={{
                      color: secondaryText,
                      lineHeight: 1.8,
                    }}
                  >
                    Thank you for contacting Faiths CleanPro. Your request has
                    been received successfully.
                  </Typography>

                  <Button
                    variant="contained"
                    onClick={() => {
                      setSubmitted(false);

                      setForm({
                        name: '',
                        email: '',
                        phone: '',
                        service: '',
                        subject: '',
                        message: '',
                      });
                    }}
                    sx={{
                      mt: 1,
                      minHeight: 52,
                      px: 3,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 850,
                      background: primary,
                      transition: 'all .3s ease',

                      '&:hover': {
                        background: secondary,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 15px 30px ${alpha(
                          primary,
                          0.22
                        )}`,
                      },
                    }}
                  >
                    Send Another Enquiry
                  </Button>
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>

      {/* =====================================================
          SERVICE STRIP
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 7,
            md: 9,
          },
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          background: surface,
          position: 'relative',
          overflow: 'hidden',
          animation:
            'flyIn .9s .3s cubic-bezier(.16,1,.3,1) both',

          '&:before': {
            content: '""',
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            left: '-250px',
            top: '-180px',
            background: alpha(
              accent,
              isDark ? 0.045 : 0.025
            ),
            pointerEvents: 'none',
            animation:
              'floatTwo 9s ease-in-out infinite',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: 700,
              mx: 'auto',
              mb: 4,
            }}
          >
            <Typography
              sx={{
                color: accent,
                fontWeight: 950,
                letterSpacing: 1.5,
                fontSize: '.76rem',
                mb: 1,
              }}
            >
              WHAT WE CLEAN
            </Typography>

            <Typography
              component="h2"
              sx={{
                fontWeight: 900,
                fontSize: {
                  xs: '1.65rem',
                  md: '2.15rem',
                },
                color: primaryText,
                letterSpacing: '-.035em',
                mb: 1,
              }}
            >
              Cleaning solutions for different spaces
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                lineHeight: 1.7,
                fontSize: '.9rem',
              }}
            >
              From everyday spaces to detailed deep cleans, we have a solution
              designed around your needs.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {serviceSpaces.map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  display: 'flex',
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: {
                    xs: 1,
                    sm: 1.2,
                  },
                  minHeight: {
                    xs: 105,
                    sm: 70,
                  },
                  borderRadius: 3.5,
                  background: surfaceSoft,
                  border: `1px solid ${borderColor}`,
                  color: primaryText,
                  fontWeight: 850,
                  animation: `flyIn ${
                    0.7 + index * 0.1
                  }s ${
                    0.1 + index * 0.08
                  }s cubic-bezier(.16,1,.3,1) both`,
                  transition: 'all .35s ease',

                  '&:hover': {
                    transform: 'translateY(-7px)',
                    borderColor: alpha(accent, 0.25),
                    boxShadow: `0 18px 35px ${alpha(
                      primary,
                      isDark ? 0.13 : 0.07
                    )}`,

                    '& .service-icon': {
                      transform:
                        'scale(1.1) translateY(-2px)',
                    },
                  },
                }}
              >
                <Box
                  className="service-icon"
                  sx={{
                    color: accent,
                    display: 'flex',
                    transition:
                      'transform .35s cubic-bezier(.16,1,.3,1)',
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  sx={{
                    fontWeight: 850,
                    fontSize: {
                      xs: '.8rem',
                      sm: '.9rem',
                    },
                    textAlign: {
                      xs: 'center',
                      sm: 'left',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <Container
        maxWidth="lg"
        sx={{
          py: {
            xs: 7,
            md: 11,
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            p: {
              xs: 3.2,
              sm: 5,
              md: 7,
            },
            borderRadius: {
              xs: 4.5,
              md: 6,
            },
            background: `
              radial-gradient(
                circle at 88% 12%,
                ${alpha(accent, 0.23)} 0,
                transparent 25%
              ),
              radial-gradient(
                circle at 8% 95%,
                ${alpha('#4f8cff', 0.12)} 0,
                transparent 28%
              ),
              linear-gradient(
                135deg,
                ${primary},
                #101c43
              )
            `,
            color: '#fff',
            boxShadow: isDark
              ? '0 32px 100px rgba(0,0,0,.32)'
              : '0 32px 100px rgba(5,35,97,.14)',
            animation:
              'flyIn 1s .2s cubic-bezier(.16,1,.3,1) both',

            '&:before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(
                  ${alpha('#fff', 0.04)} 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  ${alpha('#fff', 0.04)} 1px,
                  transparent 1px
                )
              `,
              backgroundSize: '38px 38px',
              maskImage:
                'linear-gradient(to bottom right, black, transparent 70%)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 300,
              height: 300,
              borderRadius: '50%',
              right: -100,
              top: -140,
              border: `1px solid ${alpha('#fff', 0.08)}`,
              animation:
                'floatOne 8s ease-in-out infinite',
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              width: 80,
              height: 80,
              borderRadius: '50%',
              right: '26%',
              bottom: '12%',
              background: alpha(accent, 0.12),
              filter: 'blur(2px)',
              animation:
                'pulseGlow 4s ease-in-out infinite',
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              maxWidth: 750,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                mb: 1.5,
              }}
            >
              <AutoAwesome
                sx={{
                  color: '#ff70ec',
                  fontSize: 19,
                }}
              />

              <Typography
                sx={{
                  color: '#ff70ec',
                  fontWeight: 950,
                  letterSpacing: 1.7,
                  fontSize: '.76rem',
                }}
              >
                FAITHS CLEANPRO
              </Typography>
            </Stack>

            <Typography
              component="h2"
              sx={{
                fontWeight: 950,
                fontSize: {
                  xs: '2rem',
                  sm: '2.5rem',
                  md: '3.25rem',
                },
                lineHeight: 1.04,
                letterSpacing: '-.045em',
                mb: 2,
              }}
            >
              Ready for a cleaner tomorrow?
            </Typography>

            <Typography
              sx={{
                color: alpha('#fff', 0.7),
                lineHeight: 1.8,
                maxWidth: 630,
                mb: 3.2,
              }}
            >
              Explore our cleaning services and find the right solution for
              your home, office or commercial space.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/services')}
              sx={{
                minHeight: 54,
                px: 3.2,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 950,
                background: accent,
                boxShadow: `0 18px 40px ${alpha(accent, 0.24)}`,
                transition: 'all .3s ease',

                '&:hover': {
                  background: '#d51ac7',
                  transform: 'translateY(-4px)',
                  boxShadow: `0 24px 50px ${alpha(accent, 0.34)}`,
                },
              }}
            >
              View Our Services
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Divider
        sx={{
          borderColor,
        }}
      />

      <Box
        sx={{
          py: 3.5,
          px: 2,
          textAlign: 'center',
          color: secondaryText,
        }}
      >
        <Typography
          sx={{
            fontSize: '.78rem',
            color: secondaryText,
          }}
        >
          Faiths CleanPro • Professional Cleaning Solutions
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactPage;