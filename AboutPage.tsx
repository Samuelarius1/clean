import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  Paper,
  Stack,
  Divider,
  Avatar,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  ArrowForward,
  Groups,
  WorkspacePremium,
  Favorite,
  Handshake,
  Verified,
  AutoAwesome,
  Home,
  Business,
  LocalLaundryService,
  Window,
  FormatQuote,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NAVY = '#052361';
const MAGENTA = '#E923DA';

/* =========================================================
   SCROLL REVEAL
========================================================= */

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  const hiddenTransforms = {
    up: 'translate3d(0, 55px, 0) scale(.985)',
    left: 'translate3d(-65px, 0, 0) scale(.985)',
    right: 'translate3d(65px, 0, 0) scale(.985)',
    scale: 'scale(.92)',
  };

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translate3d(0,0,0) scale(1)'
          : hiddenTransforms[direction],
        filter: visible ? 'blur(0)' : 'blur(5px)',
        transition: `
          opacity 760ms ease ${delay}ms,
          transform 900ms cubic-bezier(.16,1,.3,1) ${delay}ms,
          filter 760ms ease ${delay}ms
        `,
        willChange: 'opacity, transform, filter',

        '@media (prefers-reduced-motion: reduce)': {
          opacity: 1,
          transform: 'none',
          filter: 'none',
          transition: 'none',
        },
      }}
    >
      {children}
    </Box>
  );
};

/* =========================================================
   ABOUT PAGE
========================================================= */

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isDark = theme.palette.mode === 'dark';

  /* =========================================================
     THEME COLORS
  ========================================================= */

  const cardBackground = isDark
    ? alpha('#ffffff', 0.045)
    : '#ffffff';

  const softBackground = isDark
    ? alpha(NAVY, 0.35)
    : '#f7f9ff';

  const primaryText = isDark
    ? theme.palette.text.primary
    : '#111827';

  const secondaryText = isDark
    ? theme.palette.text.secondary
    : '#5b6474';

  const borderColor = isDark
    ? alpha('#ffffff', 0.1)
    : alpha(NAVY, 0.09);

  /* =========================================================
     DATA
  ========================================================= */

  const founders = [
    {
      name: 'Faiths CleanPro Founder',
      role: 'Founder & Visionary',
      image: '/founder-1.jpg',
      initials: 'FC',
    },
    {
      name: 'Operations Leadership',
      role: 'Operations Director',
      image: '/founder-2.jpg',
      initials: 'OL',
    },
    {
      name: 'Service Leadership',
      role: 'Service Excellence Lead',
      image: '/founder-3.jpg',
      initials: 'SL',
    },
  ];

  const values = [
    {
      icon: <Verified />,
      title: 'Professional Standards',
      text: 'Every service is approached with discipline, consistency and attention to detail.',
    },
    {
      icon: <Favorite />,
      title: 'Care First',
      text: 'We treat every home, office and space with the same care we would give our own.',
    },
    {
      icon: <WorkspacePremium />,
      title: 'Quality Driven',
      text: 'We continuously improve our methods so every cleaning experience feels exceptional.',
    },
    {
      icon: <Handshake />,
      title: 'Trusted Service',
      text: 'We believe great cleaning is built on reliability, communication and trust.',
    },
  ];

  const services = [
    {
      icon: <Home />,
      title: 'Home Cleaning',
      text: 'Fresh, comfortable and beautifully maintained living spaces.',
    },
    {
      icon: <Business />,
      title: 'Office Cleaning',
      text: 'Professional environments designed to keep teams productive.',
    },
    {
      icon: <LocalLaundryService />,
      title: 'Deep Cleaning',
      text: 'Detailed cleaning for spaces that need an extra level of care.',
    },
    {
      icon: <Window />,
      title: 'Window Cleaning',
      text: 'Crystal-clear windows that bring brightness back into your space.',
    },
  ];

  const journey = [
    {
      year: '2013',
      title: 'Where it began',
      text: 'Faiths CleanPro started with a simple idea: provide dependable cleaning with genuine care.',
    },
    {
      year: 'Growth',
      title: 'Building trust',
      text: 'As more homes and businesses experienced our service, our team continued to grow and improve.',
    },
    {
      year: 'Today',
      title: 'A trusted partner',
      text: 'Today, our focus remains the same — helping clients enjoy cleaner, healthier and more welcoming spaces.',
    },
  ];

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark
          ? theme.palette.background.default
          : '#ffffff',
        color: primaryText,
        overflow: 'hidden',
      }}
    >

      {/* =====================================================
          HERO
      ===================================================== */}

      <Box
        sx={{
          position: 'relative',
          minHeight: {
            xs: 'auto',
            md: 680,
          },
          display: 'flex',
          alignItems: 'center',
          py: {
            xs: 8,
            sm: 10,
            md: 13,
          },
          background: isDark
            ? `linear-gradient(
                135deg,
                ${NAVY} 0%,
                #07163c 48%,
                #170a31 100%
              )`
            : `linear-gradient(
                135deg,
                #f7f9ff 0%,
                #ffffff 55%,
                #fff7ff 100%
              )`,
        }}
      >

        {/* Decorative glow */}

        <Box
          sx={{
            position: 'absolute',
            width: {
              xs: 240,
              md: 460,
            },
            height: {
              xs: 240,
              md: 460,
            },
            borderRadius: '50%',
            right: {
              xs: -130,
              md: -120,
            },
            top: {
              xs: -100,
              md: -160,
            },
            background: alpha(
              MAGENTA,
              isDark ? 0.16 : 0.1
            ),
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            width: {
              xs: 180,
              md: 320,
            },
            height: {
              xs: 180,
              md: 320,
            },
            borderRadius: '50%',
            left: -130,
            bottom: -130,
            background: alpha(
              NAVY,
              isDark ? 0.35 : 0.06
            ),
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="xl">
          <Grid
            container
            spacing={{
              xs: 5,
              md: 8,
            }}
            alignItems="center"
          >

            {/* Hero text */}

            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  maxWidth: 760,
                  animation:
                    'aboutHeroIn 900ms cubic-bezier(.16,1,.3,1) both',

                  '@keyframes aboutHeroIn': {
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

                <Chip
                  icon={
                    <AutoAwesome
                      sx={{ fontSize: 17 }}
                    />
                  }
                  label="THE FAITHS CLEANPRO STORY"
                  sx={{
                    mb: 3,
                    height: 34,
                    px: 1,
                    borderRadius: 999,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    fontSize: '0.72rem',
                    color: isDark
                      ? '#ffffff'
                      : NAVY,
                    background: isDark
                      ? alpha('#ffffff', 0.09)
                      : alpha(NAVY, 0.06),
                    border: `1px solid ${
                      isDark
                        ? alpha('#ffffff', 0.12)
                        : alpha(NAVY, 0.1)
                    }`,
                  }}
                />

                <Typography
                  component="h1"
                  sx={{
                    fontSize: {
                      xs: '2.55rem',
                      sm: '3.5rem',
                      md: '4.8rem',
                    },
                    lineHeight: {
                      xs: 1.06,
                      md: 1.02,
                    },
                    fontWeight: 900,
                    letterSpacing: '-0.045em',
                    mb: 3,
                  }}
                >
                  More than cleaning.

                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: `linear-gradient(
                        90deg,
                        ${MAGENTA},
                        #a72cf0
                      )`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    We create spaces
                  </Box>

                  <Box component="span">
                    people love.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 650,
                    fontSize: {
                      xs: '1rem',
                      md: '1.18rem',
                    },
                    lineHeight: 1.8,
                    color: isDark
                      ? alpha('#ffffff', 0.72)
                      : secondaryText,
                    mb: 4,
                  }}
                >
                  Founded in 2013, Faiths CleanPro has
                  grown from a passionate cleaning team
                  into a trusted cleaning company committed
                  to quality, reliability and exceptional
                  service.
                </Typography>

                <Stack
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  spacing={2}
                >

                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/contact')}
                    sx={{
                      minHeight: 54,
                      px: 3.2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 800,
                      background: `linear-gradient(
                        135deg,
                        ${NAVY},
                        #0b3c9d
                      )`,
                      boxShadow: `0 14px 35px ${alpha(
                        NAVY,
                        0.24
                      )}`,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: `0 18px 40px ${alpha(
                          NAVY,
                          0.34
                        )}`,
                      },
                      transition: 'all 250ms ease',
                    }}
                  >
                    Work With Us
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => navigate('/services')}
                    sx={{
                      minHeight: 54,
                      px: 3.2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 800,
                      color: isDark
                        ? '#ffffff'
                        : NAVY,
                      borderColor: isDark
                        ? alpha('#ffffff', 0.2)
                        : alpha(NAVY, 0.18),

                      '&:hover': {
                        borderColor: MAGENTA,
                        color: MAGENTA,
                        background: alpha(
                          MAGENTA,
                          0.05
                        ),
                      },
                    }}
                  >
                    Explore Our Services
                  </Button>

                </Stack>
              </Box>
            </Grid>

            {/* Hero card */}

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: 470,
                  mx: 'auto',
                  width: '100%',
                  animation:
                    'heroCardIn 1050ms 180ms cubic-bezier(.16,1,.3,1) both',

                  '@keyframes heroCardIn': {
                    from: {
                      opacity: 0,
                      transform:
                        'translateY(50px) scale(.96)',
                    },
                    to: {
                      opacity: 1,
                      transform:
                        'translateY(0) scale(1)',
                    },
                  },
                }}
              >

                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    p: {
                      xs: 2,
                      sm: 3,
                    },
                    borderRadius: {
                      xs: 5,
                      md: 7,
                    },
                    overflow: 'hidden',
                    background: isDark
                      ? alpha('#ffffff', 0.07)
                      : '#ffffff',
                    border: `1px solid ${
                      isDark
                        ? alpha('#ffffff', 0.13)
                        : alpha(NAVY, 0.08)
                    }`,
                    boxShadow: isDark
                      ? '0 30px 80px rgba(0,0,0,.30)'
                      : '0 30px 80px rgba(5,35,97,.12)',
                    backdropFilter: 'blur(20px)',
                    animation:
                      'heroFloat 6s ease-in-out infinite',

                    '@keyframes heroFloat': {
                      '0%, 100%': {
                        transform: 'translateY(0)',
                      },
                      '50%': {
                        transform:
                          'translateY(-6px)',
                      },
                    },
                  }}
                >

                  <Box
                    sx={{
                      height: {
                        xs: 270,
                        sm: 330,
                      },
                      borderRadius: {
                        xs: 4,
                        md: 5,
                      },
                      background:
                        'linear-gradient(135deg, #052361 0%, #153d8f 50%, #E923DA 140%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >

                    <Box
                      sx={{
                        position: 'absolute',
                        width: 240,
                        height: 240,
                        borderRadius: '50%',
                        border: `1px solid ${alpha(
                          '#ffffff',
                          0.16
                        )}`,
                      }}
                    />

                    <Box
                      sx={{
                        position: 'absolute',
                        width: 160,
                        height: 160,
                        borderRadius: '50%',
                        border: `1px solid ${alpha(
                          '#ffffff',
                          0.16
                        )}`,
                      }}
                    />

                    <Box
                      component="img"
                      src="/logo.png"
                      alt="Faiths CleanPro"
                      sx={{
                        width: {
                          xs: 150,
                          sm: 190,
                        },
                        height: 'auto',
                        objectFit: 'contain',
                        filter:
                          'drop-shadow(0 15px 25px rgba(0,0,0,.25))',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    />

                  </Box>

                  <Box
                    sx={{
                      p: {
                        xs: 2,
                        sm: 2.5,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        mb: 0.6,
                      }}
                    >
                      A decade of clean spaces
                    </Typography>

                    <Typography
                      sx={{
                        color: secondaryText,
                        lineHeight: 1.65,
                        fontSize: '.9rem',
                      }}
                    >
                      Built on passion, professionalism
                      and the belief that every space
                      deserves exceptional care.
                    </Typography>
                  </Box>

                </Paper>

                {/* Floating promise card */}

                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    left: {
                      xs: -8,
                      sm: -35,
                    },
                    bottom: {
                      xs: 30,
                      sm: 65,
                    },
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    background: isDark
                      ? '#101b38'
                      : '#ffffff',
                    border: `1px solid ${borderColor}`,
                    boxShadow:
                      '0 15px 35px rgba(0,0,0,.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                  }}
                >

                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      background: alpha(
                        MAGENTA,
                        0.12
                      ),
                      color: MAGENTA,
                    }}
                  >
                    <Star fontSize="small" />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: '.75rem',
                        color: secondaryText,
                      }}
                    >
                      Our promise
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: '.9rem',
                      }}
                    >
                      Quality. Always.
                    </Typography>
                  </Box>

                </Paper>

              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          STATS
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 5,
            md: 7,
          },
          background: isDark
            ? '#07132d'
            : '#ffffff',
        }}
      >
        <ScrollReveal>
          <Container maxWidth="lg">

            <Grid container spacing={2}>

              {[
                ['2013', 'Founded'],
                ['10+', 'Years of Experience'],
                ['100%', 'Commitment'],
                ['∞', 'Care & Attention'],
              ].map(([number, label]) => (

                <Grid
                  size={{
                    xs: 6,
                    sm: 3,
                  }}
                  key={label}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: {
                        xs: 2,
                        md: 3,
                      },
                      px: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: {
                          xs: '1.8rem',
                          md: '2.4rem',
                        },
                        fontWeight: 900,
                        letterSpacing: '-.04em',
                        background: `linear-gradient(
                          90deg,
                          ${NAVY},
                          ${MAGENTA}
                        )`,
                        WebkitBackgroundClip:
                          'text',
                        WebkitTextFillColor:
                          'transparent',
                      }}
                    >
                      {number}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '.78rem',
                        fontWeight: 700,
                        color: secondaryText,
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                </Grid>

              ))}

            </Grid>

          </Container>
        </ScrollReveal>
      </Box>

      {/* =====================================================
          STORY
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
          background: softBackground,
        }}
      >
        <ScrollReveal direction="left">

          <Container maxWidth="lg">

            <Grid
              container
              spacing={{
                xs: 5,
                md: 9,
              }}
              alignItems="center"
            >

              <Grid size={{ xs: 12, md: 5 }}>

                <Chip
                  label="OUR JOURNEY"
                  sx={{
                    mb: 2,
                    fontWeight: 900,
                    fontSize: '.7rem',
                    color: MAGENTA,
                    background:
                      alpha(MAGENTA, 0.09),
                  }}
                />

                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: '2.1rem',
                      md: '3.2rem',
                    },
                    lineHeight: 1.1,
                    letterSpacing: '-.04em',
                    mb: 2.5,
                  }}
                >
                  A story built on

                  <Box
                    component="span"
                    sx={{
                      color: MAGENTA,
                      display: 'block',
                    }}
                  >
                    purpose.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: secondaryText,
                    lineHeight: 1.85,
                    fontSize: '1rem',
                  }}
                >
                  What began in 2013 as a small team of
                  passionate cleaners grew through
                  dedication, consistency and the trust
                  of our clients.
                </Typography>

              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>

                <Stack spacing={2.2}>

                  {journey.map((item, index) => (

                    <Box
                      key={item.year}
                      sx={{
                        display: 'flex',
                        gap: {
                          xs: 2,
                          sm: 3,
                        },
                        alignItems: 'flex-start',
                      }}
                    >

                      <Box
                        sx={{
                          flexShrink: 0,
                          width: {
                            xs: 48,
                            sm: 62,
                          },
                          height: {
                            xs: 48,
                            sm: 62,
                          },
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',

                          background:
                            index === 2
                              ? MAGENTA
                              : alpha(
                                  NAVY,
                                  isDark
                                    ? 0.35
                                    : 0.08
                                ),

                          color:
                            index === 2
                              ? '#ffffff'
                              : isDark
                                ? '#ffffff'
                                : NAVY,

                          fontWeight: 900,
                          fontSize: '.68rem',
                        }}
                      >
                        {item.year}
                      </Box>

                      <Box
                        sx={{
                          flex: 1,
                          pb: 2,
                          borderBottom:
                            index !== 2
                              ? `1px solid ${borderColor}`
                              : 'none',
                        }}
                      >

                        <Typography
                          sx={{
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            mb: 0.5,
                          }}
                        >
                          {item.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: secondaryText,
                            lineHeight: 1.7,
                            fontSize: '.92rem',
                          }}
                        >
                          {item.text}
                        </Typography>

                      </Box>

                    </Box>

                  ))}

                </Stack>

              </Grid>

            </Grid>

          </Container>

        </ScrollReveal>
      </Box>

      {/* =====================================================
          VALUES
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
        }}
      >
        <ScrollReveal delay={70}>

          <Container maxWidth="lg">

            <Box
              sx={{
                textAlign: 'center',
                maxWidth: 700,
                mx: 'auto',
                mb: {
                  xs: 5,
                  md: 7,
                },
              }}
            >

              <Chip
                label="WHAT DRIVES US"
                sx={{
                  mb: 2,
                  fontWeight: 900,
                  fontSize: '.7rem',
                  color: MAGENTA,
                  background:
                    alpha(MAGENTA, 0.09),
                }}
              />

              <Typography
                component="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: '2.15rem',
                    md: '3.2rem',
                  },
                  letterSpacing: '-.04em',
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                The values behind

                <Box
                  component="span"
                  sx={{
                    color: MAGENTA,
                    ml: 0.8,
                  }}
                >
                  every clean.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: secondaryText,
                  lineHeight: 1.8,
                }}
              >
                We don't just measure our work by how
                clean a space looks. We measure it by
                how confidently our clients can rely
                on us.
              </Typography>

            </Box>

            <Grid container spacing={2.5}>

              {values.map((item) => (

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 3,
                  }}
                  key={item.title}
                >

                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      p: {
                        xs: 3,
                        md: 3.2,
                      },
                      borderRadius: 4,
                      background: cardBackground,
                      border: `1px solid ${borderColor}`,
                      transition:
                        'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',

                      '&:hover': {
                        transform:
                          'translateY(-8px)',
                        borderColor:
                          alpha(MAGENTA, 0.3),
                        boxShadow: isDark
                          ? '0 22px 50px rgba(0,0,0,.20)'
                          : '0 22px 50px rgba(5,35,97,.10)',
                      },
                    }}
                  >

                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        color: MAGENTA,
                        background:
                          alpha(MAGENTA, 0.1),
                        mb: 2.5,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: '1.05rem',
                        mb: 1,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: secondaryText,
                        lineHeight: 1.7,
                        fontSize: '.9rem',
                      }}
                    >
                      {item.text}
                    </Typography>

                  </Paper>

                </Grid>

              ))}

            </Grid>

          </Container>

        </ScrollReveal>
      </Box>

      {/* =====================================================
          LEADERSHIP
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
          background: softBackground,
        }}
      >
        <ScrollReveal direction="right" delay={70}>

          <Container maxWidth="lg">

            <Box
              sx={{
                textAlign: 'center',
                mb: {
                  xs: 5,
                  md: 7,
                },
              }}
            >

              <Chip
                icon={<Groups />}
                label="THE PEOPLE BEHIND THE SERVICE"
                sx={{
                  mb: 2,
                  fontWeight: 900,
                  fontSize: '.7rem',
                  color: MAGENTA,
                  background:
                    alpha(MAGENTA, 0.09),
                }}
              />

              <Typography
                component="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: '2.1rem',
                    md: '3.1rem',
                  },
                  letterSpacing: '-.04em',
                  lineHeight: 1.1,
                  mb: 2,
                }}
              >
                Leadership with

                <Box
                  component="span"
                  sx={{
                    color: MAGENTA,
                    ml: 0.8,
                  }}
                >
                  purpose.
                </Box>
              </Typography>

              <Typography
                sx={{
                  maxWidth: 650,
                  mx: 'auto',
                  color: secondaryText,
                  lineHeight: 1.8,
                }}
              >
                Behind every great service is a team
                committed to doing things properly.
              </Typography>

            </Box>

            <Grid container spacing={3}>

              {founders.map((founder, index) => (

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                  key={founder.name}
                >

                  <Paper
                    elevation={0}
                    sx={{
                      overflow: 'hidden',
                      borderRadius: 5,
                      background: cardBackground,
                      border: `1px solid ${borderColor}`,
                      transition:
                        'transform 300ms ease, box-shadow 300ms ease',

                      '&:hover': {
                        transform:
                          'translateY(-8px)',
                        boxShadow: isDark
                          ? '0 25px 55px rgba(0,0,0,.25)'
                          : '0 25px 55px rgba(5,35,97,.12)',
                      },
                    }}
                  >

                    <Box
                      sx={{
                        height: {
                          xs: 300,
                          sm: 330,
                        },
                        position: 'relative',
                        background:
                          'linear-gradient(145deg, #052361, #183e8b, #E923DA)',
                        overflow: 'hidden',
                      }}
                    >

                      <Avatar
                        src={founder.image}
                        alt={founder.name}
                        sx={{
                          position: 'absolute',
                          width: {
                            xs: 180,
                            sm: 205,
                          },
                          height: {
                            xs: 180,
                            sm: 205,
                          },
                          left: '50%',
                          top: '50%',
                          transform:
                            'translate(-50%, -50%)',
                          border: `6px solid ${alpha(
                            '#ffffff',
                            0.92
                          )}`,
                          boxShadow:
                            '0 25px 45px rgba(0,0,0,.25)',
                          fontSize: '3rem',
                          fontWeight: 900,
                          background: NAVY,
                        }}
                      >
                        {founder.initials}
                      </Avatar>

                      <Box
                        sx={{
                          position: 'absolute',
                          left: 18,
                          top: 18,
                          px: 1.5,
                          py: 0.7,
                          borderRadius: 999,
                          background:
                            alpha('#ffffff', 0.12),
                          backdropFilter:
                            'blur(10px)',
                          color: '#ffffff',
                          fontSize: '.68rem',
                          fontWeight: 800,
                          letterSpacing: '.06em',
                        }}
                      >
                        {String(index + 1).padStart(
                          2,
                          '0'
                        )}
                      </Box>

                    </Box>

                    <Box sx={{ p: 3 }}>

                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: '1.1rem',
                        }}
                      >
                        {founder.name}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          color: MAGENTA,
                          fontWeight: 800,
                          fontSize: '.8rem',
                        }}
                      >
                        {founder.role}
                      </Typography>

                    </Box>

                  </Paper>

                </Grid>

              ))}

            </Grid>

          </Container>

        </ScrollReveal>
      </Box>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
        }}
      >
        <ScrollReveal direction="left" delay={70}>

          <Container maxWidth="lg">

            <Grid
              container
              spacing={{
                xs: 5,
                md: 8,
              }}
              alignItems="center"
            >

              <Grid size={{ xs: 12, md: 4 }}>

                <Chip
                  label="WHAT WE DO"
                  sx={{
                    mb: 2,
                    fontWeight: 900,
                    fontSize: '.7rem',
                    color: MAGENTA,
                    background:
                      alpha(MAGENTA, 0.09),
                  }}
                />

                <Typography
                  component="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: '2.1rem',
                      md: '3rem',
                    },
                    lineHeight: 1.1,
                    letterSpacing: '-.04em',
                    mb: 2,
                  }}
                >
                  Cleaning made

                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      color: MAGENTA,
                    }}
                  >
                    simple.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    color: secondaryText,
                    lineHeight: 1.8,
                    mb: 3,
                  }}
                >
                  From everyday cleaning to detailed deep
                  cleans, our services are designed around
                  what your space actually needs.
                </Typography>

                <Button
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/services')}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 900,
                    px: 0,
                    color: MAGENTA,

                    '&:hover': {
                      background: 'transparent',
                      color: NAVY,
                    },
                  }}
                >
                  View all services
                </Button>

              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>

                <Grid container spacing={2}>

                  {services.map((service) => (

                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                      key={service.title}
                    >

                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          height: '100%',
                          borderRadius: 4,
                          background: cardBackground,
                          border: `1px solid ${borderColor}`,
                          transition:
                            'all 280ms ease',

                          '&:hover': {
                            transform:
                              'translateY(-5px)',
                            borderColor:
                              alpha(
                                MAGENTA,
                                0.3
                              ),
                          },
                        }}
                      >

                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2.5,
                            display: 'grid',
                            placeItems: 'center',
                            color: NAVY,
                            background: isDark
                              ? alpha(
                                  '#ffffff',
                                  0.08
                                )
                              : alpha(
                                  NAVY,
                                  0.07
                                ),
                            mb: 2,
                          }}
                        >
                          {service.icon}
                        </Box>

                        <Typography
                          sx={{
                            fontWeight: 900,
                            mb: 0.8,
                          }}
                        >
                          {service.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: secondaryText,
                            lineHeight: 1.65,
                            fontSize: '.9rem',
                          }}
                        >
                          {service.text}
                        </Typography>

                      </Paper>

                    </Grid>

                  ))}

                </Grid>

              </Grid>

            </Grid>

          </Container>

        </ScrollReveal>
      </Box>

      {/* =====================================================
          PROMISE
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 9,
            md: 12,
          },
        }}
      >
        <ScrollReveal direction="scale" delay={90}>

          <Container maxWidth="md">

            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: {
                  xs: 5,
                  md: 7,
                },
                p: {
                  xs: 4,
                  sm: 6,
                  md: 8,
                },
                textAlign: 'center',
                color: '#ffffff',
                background:
                  'linear-gradient(135deg, #052361 0%, #123b88 55%, #8e18a8 140%)',
                boxShadow:
                  '0 30px 70px rgba(5,35,97,.22)',
              }}
            >

              <FormatQuote
                sx={{
                  fontSize: 65,
                  opacity: 0.14,
                  position: 'absolute',
                  top: 15,
                  left: 18,
                }}
              />

              <Typography
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  fontSize: {
                    xs: '1.55rem',
                    sm: '2rem',
                    md: '2.45rem',
                  },
                  lineHeight: 1.25,
                  fontWeight: 900,
                  letterSpacing: '-.025em',
                  mb: 2,
                }}
              >
                “A clean space isn't just about appearance.
                It's about how that space makes you feel.”
              </Typography>

              <Divider
                sx={{
                  width: 70,
                  mx: 'auto',
                  my: 3,
                  borderColor:
                    alpha('#ffffff', 0.3),
                }}
              />

              <Typography
                sx={{
                  color:
                    alpha('#ffffff', 0.72),
                  fontSize: '.9rem',
                }}
              >
                The Faiths CleanPro commitment
              </Typography>

            </Paper>

          </Container>

        </ScrollReveal>
      </Box>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <Box
        sx={{
          py: {
            xs: 8,
            md: 10,
          },
          background: isDark
            ? '#061126'
            : '#f7f9ff',
        }}
      >
        <ScrollReveal delay={90}>

          <Container maxWidth="lg">

            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
                alignItems: {
                  xs: 'flex-start',
                  md: 'center',
                },
                justifyContent:
                  'space-between',
                gap: 4,
              }}
            >

              <Box>

                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: '1.65rem',
                      md: '2.3rem',
                    },
                    letterSpacing: '-.035em',
                    mb: 1,
                  }}
                >
                  Ready for a cleaner space?
                </Typography>

                <Typography
                  sx={{
                    color: secondaryText,
                    lineHeight: 1.7,
                  }}
                >
                  Let Faiths CleanPro take care of the
                  cleaning.
                </Typography>

              </Box>

              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/contact')}
                sx={{
                  minHeight: 54,
                  px: 3.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 900,
                  flexShrink: 0,
                  background: `linear-gradient(
                    135deg,
                    ${MAGENTA},
                    #b51ce6
                  )`,
                  boxShadow: `0 15px 35px ${alpha(
                    MAGENTA,
                    0.24
                  )}`,

                  '&:hover': {
                    transform:
                      'translateY(-3px)',
                    boxShadow: `0 20px 40px ${alpha(
                      MAGENTA,
                      0.34
                    )}`,
                  },

                  transition: 'all 250ms ease',
                }}
              >
                Get a Quote
              </Button>

            </Box>

          </Container>

        </ScrollReveal>
      </Box>

    </Box>
  );
};

export default AboutPage;