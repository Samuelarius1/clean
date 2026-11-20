import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Avatar,
  useTheme,
} from '@mui/material';
import { Verified, Spa, AccessTime, ArrowForward, CheckCircle } from '@mui/icons-material';
import { COLORS } from '../../utils/constants';

const WhyChoose = () => {
  const theme = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Verified />,
      title: 'Licensed & Insured',
      desc: 'All our staff are fully vetted and insured for your peace of mind.',
    },
    {
      icon: <Spa />,
      title: 'Eco-Friendly Products',
      desc: 'We use safe, non-toxic cleaning products that are tough on dirt but safe for your family.',
    },
    {
      icon: <AccessTime />,
      title: 'Flexible Scheduling',
      desc: 'We work around your schedule to provide cleaning at your convenience.',
    },
  ];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -70px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const dark = theme.palette.mode === 'dark';
  const primary = COLORS.primary || '#052361';
  const pink = '#E923DA';

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        backgroundColor: theme.palette.background.default,
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          top: -220,
          right: -180,
          background: `radial-gradient(circle, ${pink}18 0%, transparent 68%)`,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          bottom: -190,
          left: -150,
          background: `radial-gradient(circle, ${primary}16 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 6, md: 9 }} alignItems="center">
          {/* Image panel */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'translateX(0) scale(1)'
                  : 'translateX(-90px) scale(.96)',
                filter: isVisible ? 'blur(0)' : 'blur(7px)',
                transition:
                  'opacity .9s ease, transform 1s cubic-bezier(.16,1,.3,1), filter 1s ease',
              }}
            >
              {/* Decorative frame */}
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: -12, md: -20 },
                  left: { xs: -10, md: -20 },
                  width: { xs: 70, md: 110 },
                  height: { xs: 70, md: 110 },
                  borderTop: `3px solid ${pink}`,
                  borderLeft: `3px solid ${pink}`,
                  borderRadius: '18px 0 0 0',
                  opacity: 0.8,
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  bottom: { xs: -14, md: -22 },
                  right: { xs: -12, md: -22 },
                  width: { xs: 80, md: 120 },
                  height: { xs: 80, md: 120 },
                  borderBottom: `3px solid ${primary}`,
                  borderRight: `3px solid ${primary}`,
                  borderRadius: '0 0 18px 0',
                  opacity: 0.75,
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: -8,
                  width: 16,
                  height: 110,
                  borderRadius: 8,
                  backgroundColor: pink,
                  transform: 'translateY(-50%)',
                  opacity: 0.9,
                  display: { xs: 'none', sm: 'block' },
                }}
              />

              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: { xs: 4, md: 6 },
                  border: `1px solid ${dark ? 'rgba(255,255,255,.12)' : 'rgba(5,35,97,.10)'}`,
                  boxShadow: dark
                    ? '0 28px 70px rgba(0,0,0,.38)'
                    : '0 28px 70px rgba(5,35,97,.16)',
                  backgroundColor: theme.palette.background.paper,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(120deg, rgba(255,255,255,.18), transparent 35%, transparent 70%, rgba(233,30,218,.10))',
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=85"
                  alt="Professional cleaning service"
                  sx={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: { xs: '4 / 3', md: '5 / 4' },
                    objectFit: 'cover',
                    transition: 'transform .8s ease',
                    '&:hover': { transform: 'scale(1.035)' },
                  }}
                />
              </Box>

              {/* Floating trust badge */}
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  right: { xs: 12, sm: 22, md: 30 },
                  bottom: { xs: 12, sm: 22, md: 28 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  px: 2,
                  py: 1.25,
                  borderRadius: 3,
                  backgroundColor: dark ? 'rgba(10,18,38,.88)' : 'rgba(255,255,255,.94)',
                  border: `1px solid ${pink}45`,
                  boxShadow: '0 14px 35px rgba(0,0,0,.18)',
                  backdropFilter: 'blur(12px)',
                  animation: isVisible ? 'whyFloat 4s ease-in-out infinite' : 'none',
                }}
              >
                <CheckCircle sx={{ color: pink, fontSize: 24 }} />
                <Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      fontWeight: 800,
                      fontSize: { xs: '.78rem', md: '.85rem' },
                      lineHeight: 1.1,
                    }}
                  >
                    Trusted Service
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '.68rem',
                      mt: .35,
                    }}
                  >
                    Clean. Care. Consistency.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Content panel */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(90px)',
                transition:
                  'opacity .8s ease .12s, transform 1s cubic-bezier(.16,1,.3,1) .12s',
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 3,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${pink}, ${primary})`,
                  }}
                />
                <Typography
                  variant="overline"
                  sx={{
                    color: pink,
                    letterSpacing: 2.2,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                  }}
                >
                  Why Choose Us
                </Typography>
              </Stack>

              <Typography
                variant="h3"
                component="h2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 900,
                  letterSpacing: '-.035em',
                  lineHeight: 1.05,
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.4rem' },
                  mb: 2.5,
                }}
              >
                We Are Trusted
                <Box component="span" sx={{ color: pink, display: 'block' }}>
                  Professionals.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '1rem', md: '1.08rem' },
                  lineHeight: 1.8,
                  maxWidth: 650,
                  mb: 4,
                }}
              >
                We combine dependable people, quality products, and flexible service
                to make every clean feel effortless.
              </Typography>

              <Stack spacing={2.2}>
                {features.map((feature, index) => (
                  <Box
                    key={index}
                    sx={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible
                        ? 'translateY(0) scale(1)'
                        : 'translateY(45px) scale(.97)',
                      transition: `opacity .65s ease ${.25 + index * .13}s, transform .75s cubic-bezier(.16,1,.3,1) ${.25 + index * .13}s`,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: { xs: 2, md: 2.5 },
                        p: { xs: 2, md: 2.4 },
                        borderRadius: 4,
                        backgroundColor: dark
                          ? 'rgba(255,255,255,.035)'
                          : 'rgba(5,35,97,.025)',
                        border: `1px solid ${
                          dark ? 'rgba(255,255,255,.08)' : 'rgba(5,35,97,.08)'
                        }`,
                        transition:
                          'transform .3s ease, box-shadow .3s ease, border-color .3s ease, background-color .3s ease',
                        '&:hover': {
                          transform: 'translateX(8px)',
                          borderColor: `${pink}55`,
                          backgroundColor: dark
                            ? 'rgba(233,30,218,.07)'
                            : 'rgba(233,30,218,.045)',
                          boxShadow: `0 16px 35px ${pink}18`,
                          '& .why-icon': {
                            transform: 'rotate(-7deg) scale(1.08)',
                            backgroundColor: `${pink}18`,
                          },
                          '& .why-arrow': {
                            opacity: 1,
                            transform: 'translateX(0)',
                          },
                        },
                      }}
                    >
                      <Avatar
                        className="why-icon"
                        sx={{
                          flexShrink: 0,
                          width: { xs: 50, md: 58 },
                          height: { xs: 50, md: 58 },
                          bgcolor: `${primary}12`,
                          color: pink,
                          border: `1px solid ${pink}28`,
                          transition: 'transform .3s ease, background-color .3s ease',
                        }}
                      >
                        {feature.icon}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: theme.palette.text.primary,
                            fontWeight: 800,
                            mb: .6,
                            fontSize: { xs: '1rem', md: '1.08rem' },
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            lineHeight: 1.65,
                            fontSize: { xs: '.88rem', md: '.94rem' },
                          }}
                        >
                          {feature.desc}
                        </Typography>
                      </Box>

                      <ArrowForward
                        className="why-arrow"
                        sx={{
                          display: { xs: 'none', sm: 'block' },
                          mt: .8,
                          color: pink,
                          opacity: 0,
                          transform: 'translateX(-8px)',
                          transition: 'opacity .3s ease, transform .3s ease',
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Box
                sx={{
                  mt: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(25px)',
                  transition: 'opacity .7s ease .75s, transform .7s ease .75s',
                }}
              >
                <CheckCircle sx={{ color: pink, fontSize: 19 }} />
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: '.86rem',
                    fontWeight: 700,
                  }}
                >
                  Quality service with your comfort in mind
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <style>
        {`
          @keyframes whyFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-7px); }
          }

          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default WhyChoose;
