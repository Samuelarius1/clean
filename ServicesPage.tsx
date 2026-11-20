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
  Avatar,
  Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Home,
  Business,
  Window,
  DryCleaning,
  CleaningServices,
  Construction,
  ArrowForward,
  CheckCircle,
  Star,
  AutoAwesome,
  Verified,
  AccessTime,
  Groups,
  LocalOffer,
} from '@mui/icons-material';
import { SERVICES } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

const NAVY = '#052361';
const MAGENTA = '#E923DA';

const iconMap: Record<string, React.ReactNode> = {
  home: <Home />,
  business: <Business />,
  window: <Window />,
  carpet: <DryCleaning />,
  cleaning_services: <CleaningServices />,
  construction: <Construction />,
};

const imageMap: Record<string, string> = {
  home:
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=85',

  business:
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85',

  window:
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=85',

  carpet:
    'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1200&q=85',

  cleaning_services:
    'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=1200&q=85',

  construction:
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=85',
};

const ServicesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isDark = theme.palette.mode === 'dark';

  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    Object.entries(refs.current).forEach(([key, element]) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((previous) => ({
              ...previous,
              [key]: true,
            }));

            observer.unobserve(element);
          }
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -60px 0px',
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const reveal = (key: string, delay = 0) => ({
    opacity: visible[key] ? 1 : 0,
    transform: visible[key]
      ? 'translateY(0)'
      : 'translateY(55px)',
    transition: `opacity 750ms ${delay}ms ease, transform 750ms ${delay}ms cubic-bezier(.22,1,.36,1)`,
  });

  const primaryText = isDark ? '#ffffff' : '#111827';

  const secondaryText = isDark
    ? theme.palette.text.secondary
    : '#5d6676';

  const cardBackground = isDark
    ? alpha('#ffffff', 0.045)
    : '#ffffff';

  const borderColor = isDark
    ? alpha('#ffffff', 0.10)
    : alpha(NAVY, 0.09);

  const sectionBackground = isDark
    ? '#07132d'
    : '#f7f9ff';

  const serviceCount = SERVICES.length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        background: isDark
          ? theme.palette.background.default
          : '#ffffff',
        color: primaryText,
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
            md: 650,
          },
          display: 'flex',
          alignItems: 'center',
          py: {
            xs: 8,
            sm: 10,
            md: 12,
          },
          background: isDark
            ? 'linear-gradient(135deg, #052361 0%, #071735 58%, #1b0a31 100%)'
            : 'linear-gradient(135deg, #f6f8ff 0%, #ffffff 58%, #fff5ff 100%)',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: {
              xs: 260,
              md: 500,
            },
            height: {
              xs: 260,
              md: 500,
            },
            borderRadius: '50%',
            right: {
              xs: -160,
              md: -170,
            },
            top: {
              xs: -130,
              md: -220,
            },
            background: alpha(
              MAGENTA,
              isDark ? 0.15 : 0.08
            ),
            filter: 'blur(15px)',
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
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  maxWidth: 700,
                  animation:
                    'servicesHeroIn 900ms cubic-bezier(.22,1,.36,1) both',

                  '@keyframes servicesHeroIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(40px)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                <Chip
                  icon={<AutoAwesome sx={{ fontSize: 17 }} />}
                  label="PROFESSIONAL CLEANING SERVICES"
                  sx={{
                    mb: 3,
                    height: 34,
                    borderRadius: 999,
                    fontWeight: 900,
                    letterSpacing: '.07em',
                    fontSize: '.69rem',
                    color: isDark ? '#ffffff' : NAVY,
                    background: isDark
                      ? alpha('#ffffff', .08)
                      : alpha(NAVY, .06),
                    border: `1px solid ${
                      isDark
                        ? alpha('#ffffff', .12)
                        : alpha(NAVY, .10)
                    }`,
                  }}
                />

                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: {
                      xs: '2.65rem',
                      sm: '3.7rem',
                      md: '4.7rem',
                    },
                    lineHeight: 1.02,
                    letterSpacing: '-.05em',
                    mb: 3,
                  }}
                >
                  A cleaner space.
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background:
                        'linear-gradient(90deg, #E923DA, #a82cf0)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    A better feeling.
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    maxWidth: 630,
                    color: isDark
                      ? alpha('#ffffff', .72)
                      : secondaryText,
                    fontSize: {
                      xs: '1rem',
                      md: '1.15rem',
                    },
                    lineHeight: 1.8,
                    mb: 4,
                  }}
                >
                  From everyday home cleaning to demanding
                  commercial projects, Faiths CleanPro delivers
                  professional cleaning solutions designed around
                  your space.
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
                      px: 3.3,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 900,
                      background:
                        'linear-gradient(135deg, #052361, #0b3c9d)',
                      boxShadow:
                        '0 15px 35px rgba(5,35,97,.25)',
                      transition: 'all 250ms ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow:
                          '0 20px 40px rgba(5,35,97,.35)',
                      },
                    }}
                  >
                    Request a Quote
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => {
                      document
                        .getElementById('services-grid')
                        ?.scrollIntoView({
                          behavior: 'smooth',
                        });
                    }}
                    sx={{
                      minHeight: 54,
                      px: 3.3,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 900,
                      color: isDark ? '#ffffff' : NAVY,
                      borderColor: isDark
                        ? alpha('#ffffff', .2)
                        : alpha(NAVY, .18),
                      '&:hover': {
                        color: MAGENTA,
                        borderColor: MAGENTA,
                        background: alpha(MAGENTA, .04),
                      },
                    }}
                  >
                    Explore Services
                  </Button>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  maxWidth: 570,
                  mx: 'auto',
                  width: '100%',
                  animation:
                    'servicesImageIn 1000ms 150ms cubic-bezier(.22,1,.36,1) both',

                  '@keyframes servicesImageIn': {
                    from: {
                      opacity: 0,
                      transform: 'translateY(45px) scale(.96)',
                    },
                    to: {
                      opacity: 1,
                      transform: 'translateY(0) scale(1)',
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: {
                      xs: 8,
                      sm: -12,
                    },
                    borderRadius: {
                      xs: 5,
                      md: 7,
                    },
                    background: `linear-gradient(135deg, ${MAGENTA}, ${NAVY})`,
                    transform: 'rotate(3deg)',
                    opacity: .15,
                  }}
                />

                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1400&q=90"
                  alt="Professional cleaning service"
                  sx={{
                    position: 'relative',
                    display: 'block',
                    width: '100%',
                    height: {
                      xs: 310,
                      sm: 400,
                      md: 480,
                    },
                    objectFit: 'cover',
                    borderRadius: {
                      xs: 5,
                      md: 7,
                    },
                    boxShadow: isDark
                      ? '0 35px 80px rgba(0,0,0,.35)'
                      : '0 35px 80px rgba(5,35,97,.16)',
                  }}
                />

                <Paper
                  elevation={0}
                  sx={{
                    position: 'absolute',
                    left: {
                      xs: -5,
                      sm: -25,
                    },
                    bottom: {
                      xs: 20,
                      sm: 35,
                    },
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    background: isDark
                      ? '#111c3b'
                      : '#ffffff',
                    border: `1px solid ${borderColor}`,
                    boxShadow:
                      '0 18px 40px rgba(0,0,0,.16)',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      background: alpha(MAGENTA, .12),
                      color: MAGENTA,
                    }}
                  >
                    <Verified />
                  </Avatar>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: '.72rem',
                        color: secondaryText,
                      }}
                    >
                      Faiths CleanPro
                    </Typography>

                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: '.9rem',
                      }}
                    >
                      Quality you can trust
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          QUICK STATS
      ===================================================== */}
      <Box
        ref={(element: HTMLDivElement | null) => {
          refs.current.stats = element;
        }}
        sx={{
          py: {
            xs: 4,
            md: 6,
          },
          background: isDark
            ? '#061126'
            : '#ffffff',
          ...reveal('stats'),
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            {[
              {
                icon: <CleaningServices />,
                number: `${serviceCount}+`,
                label: 'Cleaning Solutions',
              },
              {
                icon: <Groups />,
                number: '10+',
                label: 'Years of Experience',
              },
              {
                icon: <Star />,
                number: '100%',
                label: 'Commitment to Quality',
              },
              {
                icon: <AccessTime />,
                number: '24/7',
                label: 'Flexible Service',
              },
            ].map((item) => (
              <Grid
                size={{
                  xs: 6,
                  md: 3,
                }}
                key={item.label}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      mx: 'auto',
                      mb: 1,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 2,
                      color: MAGENTA,
                      background: alpha(MAGENTA, .09),
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: {
                        xs: '1.4rem',
                        md: '1.8rem',
                      },
                    }}
                  >
                    {item.number}
                  </Typography>

                  <Typography
                    sx={{
                      color: secondaryText,
                      fontSize: '.74rem',
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          SERVICES INTRO
      ===================================================== */}
      <Box
        id="services-grid"
        ref={(element: HTMLDivElement | null) => {
          refs.current.services = element;
        }}
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
          background: sectionBackground,
          ...reveal('services'),
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              maxWidth: 760,
              mx: 'auto',
              textAlign: 'center',
              mb: {
                xs: 5,
                md: 7,
              },
            }}
          >
            <Chip
              label="OUR SERVICES"
              sx={{
                mb: 2,
                fontWeight: 900,
                fontSize: '.7rem',
                color: MAGENTA,
                background: alpha(MAGENTA, .09),
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
                lineHeight: 1.08,
                letterSpacing: '-.045em',
                mb: 2,
              }}
            >
              Cleaning solutions for
              <Box
                component="span"
                sx={{
                  color: MAGENTA,
                  ml: .7,
                }}
              >
                every space.
              </Box>
            </Typography>

            <Typography
              sx={{
                color: secondaryText,
                lineHeight: 1.8,
                fontSize: {
                  xs: '.95rem',
                  md: '1rem',
                },
              }}
            >
              Choose the service that fits your needs, or speak
              with our team about creating a cleaning plan
              specifically for your property.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {SERVICES.map((service, index) => {
              const image =
                imageMap[service.icon] ||
                imageMap.cleaning_services;

              return (
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4,
                  }}
                  key={service.id}
                  sx={{
                    opacity: visible.services ? 1 : 0,
                    transform: visible.services
                      ? 'translateY(0)'
                      : 'translateY(45px)',
                    transition: `opacity 650ms ${
                      index * 100
                    }ms ease, transform 650ms ${
                      index * 100
                    }ms cubic-bezier(.22,1,.36,1)`,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: 5,
                      background: cardBackground,
                      border: `1px solid ${borderColor}`,
                      transition:
                        'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
                      '&:hover': {
                        transform: 'translateY(-9px)',
                        borderColor: alpha(MAGENTA, .28),
                        boxShadow: isDark
                          ? '0 28px 60px rgba(0,0,0,.28)'
                          : '0 28px 60px rgba(5,35,97,.12)',
                      },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        height: {
                          xs: 230,
                          sm: 250,
                        },
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        component="img"
                        src={image}
                        alt={service.title}
                        loading="lazy"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          transition:
                            'transform 600ms cubic-bezier(.22,1,.36,1)',
                          '.MuiPaper-root:hover &': {
                            transform: 'scale(1.06)',
                          },
                        }}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(to top, rgba(5,35,97,.80), transparent 65%)',
                        }}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          left: 20,
                          bottom: 18,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: '#ffffff',
                            color: NAVY,
                            boxShadow:
                              '0 8px 20px rgba(0,0,0,.18)',
                          }}
                        >
                          {iconMap[service.icon]}
                        </Avatar>

                        <Typography
                          sx={{
                            color: '#ffffff',
                            fontWeight: 900,
                            fontSize: '1.05rem',
                          }}
                        >
                          {service.title}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          position: 'absolute',
                          top: 15,
                          right: 15,
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          color: '#ffffff',
                          background: alpha(NAVY, .75),
                          backdropFilter: 'blur(10px)',
                          fontWeight: 900,
                          fontSize: '.72rem',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </Box>
                    </Box>

                    {/* Content */}
                    <Box
                      sx={{
                        p: {
                          xs: 2.7,
                          sm: 3,
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          color: secondaryText,
                          fontSize: '.9rem',
                          lineHeight: 1.7,
                          minHeight: {
                            sm: 68,
                          },
                          mb: 2.2,
                        }}
                      >
                        {service.description}
                      </Typography>

                      <Stack spacing={1.1}>
                        {service.features.map(
                          (feature, featureIndex) => (
                            <Box
                              key={featureIndex}
                              sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'flex-start',
                              }}
                            >
                              <CheckCircle
                                sx={{
                                  flexShrink: 0,
                                  mt: .15,
                                  fontSize: 17,
                                  color: MAGENTA,
                                }}
                              />

                              <Typography
                                sx={{
                                  fontSize: '.83rem',
                                  lineHeight: 1.5,
                                  color: primaryText,
                                }}
                              >
                                {feature}
                              </Typography>
                            </Box>
                          )
                        )}
                      </Stack>

                      <Divider
                        sx={{
                          my: 2.5,
                          borderColor: borderColor,
                        }}
                      />

                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/contact')}
                        sx={{
                          minHeight: 46,
                          borderRadius: 2.5,
                          textTransform: 'none',
                          fontWeight: 900,
                          color: isDark ? '#ffffff' : NAVY,
                          borderColor: isDark
                            ? alpha('#ffffff', .15)
                            : alpha(NAVY, .13),
                          '&:hover': {
                            color: '#ffffff',
                            borderColor: MAGENTA,
                            background: MAGENTA,
                          },
                        }}
                      >
                        Get a Quote
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}
      <Box
        ref={(element: HTMLDivElement | null) => {
          refs.current.why = element;
        }}
        sx={{
          py: {
            xs: 9,
            md: 13,
          },
          ...reveal('why'),
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={{
              xs: 5,
              md: 8,
            }}
            alignItems="center"
          >
            <Grid size={{ xs: 12, md: 5 }}>
              <Chip
                label="WHY FAITHS CLEANPRO"
                sx={{
                  mb: 2,
                  fontWeight: 900,
                  fontSize: '.7rem',
                  color: MAGENTA,
                  background: alpha(MAGENTA, .09),
                }}
              />

              <Typography
                component="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: '2.15rem',
                    md: '3.1rem',
                  },
                  lineHeight: 1.08,
                  letterSpacing: '-.045em',
                  mb: 2.5,
                }}
              >
                The difference is
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    color: MAGENTA,
                  }}
                >
                  in the details.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: secondaryText,
                  lineHeight: 1.8,
                }}
              >
                We believe professional cleaning should be
                reliable, detailed and easy to work with. That's
                why every service is built around quality and
                client satisfaction.
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={2}>
                {[
                  {
                    icon: <Verified />,
                    title: 'Professional Quality',
                    text: 'Attention to detail from start to finish.',
                  },
                  {
                    icon: <Groups />,
                    title: 'Trained Team',
                    text: 'People who understand professional service.',
                  },
                  {
                    icon: <AccessTime />,
                    title: 'Reliable Service',
                    text: 'We respect your time and your schedule.',
                  },
                  {
                    icon: <Star />,
                    title: 'Client Focused',
                    text: 'Your satisfaction remains at the centre.',
                  },
                ].map((item) => (
                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                    }}
                    key={item.title}
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
                          'transform 250ms ease, border-color 250ms ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          borderColor: alpha(MAGENTA, .25),
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
                          color: MAGENTA,
                          background: alpha(MAGENTA, .10),
                          mb: 2,
                        }}
                      >
                        {item.icon}
                      </Box>

                      <Typography
                        sx={{
                          fontWeight: 900,
                          mb: .7,
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: secondaryText,
                          fontSize: '.88rem',
                          lineHeight: 1.65,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          PROCESS
      ===================================================== */}
      <Box
        ref={(element: HTMLDivElement | null) => {
          refs.current.process = element;
        }}
        sx={{
          py: {
            xs: 9,
            md: 12,
          },
          background: sectionBackground,
          ...reveal('process'),
        }}
      >
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
              label="HOW IT WORKS"
              sx={{
                mb: 2,
                fontWeight: 900,
                fontSize: '.7rem',
                color: MAGENTA,
                background: alpha(MAGENTA, .09),
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
                letterSpacing: '-.04em',
                mb: 2,
              }}
            >
              Simple from
              <Box
                component="span"
                sx={{
                  color: MAGENTA,
                  ml: .7,
                }}
              >
                start to finish.
              </Box>
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                number: '01',
                title: 'Tell us what you need',
                text: 'Share your space, cleaning requirements and preferred schedule.',
              },
              {
                number: '02',
                title: 'Get your quote',
                text: 'Our team works with you to understand the right cleaning solution.',
              },
              {
                number: '03',
                title: 'Enjoy the clean',
                text: 'Our professionals get to work and leave your space looking its best.',
              },
            ].map((step, index) => (
              <Grid
                size={{
                  xs: 12,
                  md: 4,
                }}
                key={step.number}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: {
                      xs: 3,
                      md: 4,
                    },
                    borderRadius: 5,
                    background: cardBackground,
                    border: `1px solid ${borderColor}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '4rem',
                      lineHeight: 1,
                      fontWeight: 900,
                      color: alpha(MAGENTA, .10),
                      position: 'absolute',
                      right: 20,
                      top: 15,
                    }}
                  >
                    {step.number}
                  </Typography>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      display: 'grid',
                      placeItems: 'center',
                      background:
                        index === 2
                          ? MAGENTA
                          : alpha(NAVY, isDark ? .35 : .08),
                      color:
                        index === 2
                          ? '#ffffff'
                          : isDark
                            ? '#ffffff'
                            : NAVY,
                      fontWeight: 900,
                      mb: 3,
                    }}
                  >
                    {step.number}
                  </Box>

                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      mb: 1,
                    }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: secondaryText,
                      fontSize: '.9rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {step.text}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* =====================================================
          CUSTOM SERVICE CTA
      ===================================================== */}
      <Box
        ref={(element: HTMLDivElement | null) => {
          refs.current.cta = element;
        }}
        sx={{
          py: {
            xs: 9,
            md: 12,
          },
          ...reveal('cta'),
        }}
      >
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
                'linear-gradient(135deg, #052361 0%, #123b88 55%, #9419a9 145%)',
              boxShadow:
                '0 30px 75px rgba(5,35,97,.22)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 260,
                height: 260,
                borderRadius: '50%',
                right: -120,
                top: -130,
                background: alpha(MAGENTA, .18),
              }}
            />

            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 58,
                  height: 58,
                  mx: 'auto',
                  mb: 2.5,
                  background: alpha('#ffffff', .12),
                  color: '#ffffff',
                }}
              >
                <LocalOffer />
              </Avatar>

              <Typography
                component="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: {
                    xs: '1.8rem',
                    md: '2.5rem',
                  },
                  letterSpacing: '-.035em',
                  mb: 2,
                }}
              >
                Need something more specific?
              </Typography>

              <Typography
                sx={{
                  maxWidth: 620,
                  mx: 'auto',
                  color: alpha('#ffffff', .74),
                  lineHeight: 1.8,
                  mb: 4,
                  fontSize: '.95rem',
                }}
              >
                Every space is different. Tell us what you need
                and we'll help create a cleaning solution around
                your property, schedule and priorities.
              </Typography>

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
                  color: NAVY,
                  background: '#ffffff',
                  '&:hover': {
                    background: '#ffffff',
                    color: MAGENTA,
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 250ms ease',
                }}
              >
                Contact Us for a Custom Service
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;