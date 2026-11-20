import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme
} from '@mui/material';
import {
  Home,
  Business,
  Window,
  DryCleaning,
  CleaningServices,
  Construction,
  ArrowForward,
  CheckCircle
} from '@mui/icons-material';
import { COLORS, SERVICES, type ServiceIcon } from '../../utils/constants';

const iconMap: Record<ServiceIcon, React.ReactNode> = {
  home: <Home />,
  business: <Business />,
  window: <Window />,
  carpet: <DryCleaning />,
  cleaning_services: <CleaningServices />,
  construction: <Construction />
};

const Services = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={sectionRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 7, sm: 9, md: 12 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,

        '@keyframes sectionFlyUp': {
          from: { opacity: 0, transform: 'translateY(55px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        '@keyframes headingFly': {
          from: { opacity: 0, transform: 'translateY(35px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        '@keyframes cardFlyLeft': {
          from: { opacity: 0, transform: 'translateY(65px) translateX(-18px) scale(.96)' },
          to: { opacity: 1, transform: 'translateY(0) translateX(0) scale(1)' }
        },
        '@keyframes cardFlyRight': {
          from: { opacity: 0, transform: 'translateY(65px) translateX(18px) scale(.96)' },
          to: { opacity: 1, transform: 'translateY(0) translateX(0) scale(1)' }
        },
        '@keyframes iconPop': {
          from: { opacity: 0, transform: 'scale(.65) rotate(-8deg)' },
          to: { opacity: 1, transform: 'scale(1) rotate(0)' }
        },
        '@keyframes lineGrow': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' }
        },
        '@media (prefers-reduced-motion: reduce)': {
          '& *': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important'
          }
        }
      }}
    >
      {/* Subtle brand geometry */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 170, md: 300 },
          height: { xs: 170, md: 300 },
          border: `1px solid ${isDark ? 'rgba(233,35,218,.12)' : 'rgba(233,35,218,.10)'}`,
          borderRadius: '50%',
          right: { xs: -90, md: -110 },
          top: { xs: 60, md: 40 },
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: COLORS.primary || '#E923DA',
          left: { xs: 24, md: 75 },
          top: { xs: 110, md: 145 },
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section heading */}
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 820,
            mx: 'auto',
            mb: { xs: 5, md: 8 },
            opacity: visible ? 1 : 0,
            animation: visible ? 'headingFly .8s cubic-bezier(.2,.8,.2,1) both' : 'none'
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              mb: 1.5
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 3,
                borderRadius: 99,
                backgroundColor: '#E923DA',
                transformOrigin: 'center',
                animation: visible ? 'lineGrow .7s ease-out .15s both' : 'none'
              }}
            />
            <Typography
              sx={{
                color: '#E923DA',
                fontSize: { xs: '.72rem', md: '.78rem' },
                fontWeight: 900,
                letterSpacing: '.18em',
                textTransform: 'uppercase'
              }}
            >
              What We Do
            </Typography>
            <Box
              sx={{
                width: 34,
                height: 3,
                borderRadius: 99,
                backgroundColor: '#E923DA',
                transformOrigin: 'center',
                animation: visible ? 'lineGrow .7s ease-out .15s both' : 'none'
              }}
            />
          </Box>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
              lineHeight: 1.05,
              letterSpacing: '-.045em',
              fontWeight: 900,
              color: theme.palette.text.primary
            }}
          >
            Cleaning solutions built
            <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
              {' '}around your space.
            </Box>
          </Typography>

          <Typography
            component="p"
            sx={{
              maxWidth: 690,
              mx: 'auto',
              mt: 2,
              fontSize: { xs: '.98rem', md: '1.08rem' },
              lineHeight: 1.75,
              color: theme.palette.text.secondary
            }}
          >
            From everyday home care to demanding commercial spaces, our professional team
            delivers reliable cleaning with a sharp eye for detail.
          </Typography>
        </Box>

        {/* Service cards */}
        <Grid container spacing={{ xs: 2.5, md: 3 }}>
          {SERVICES.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
              <Card
                sx={{
                  height: '100%',
                  minHeight: { md: 390 },
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: { xs: 3.5, md: 4.5 },
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${
                    isDark ? 'rgba(255,255,255,.09)' : 'rgba(5,35,97,.09)'
                  }`,
                  boxShadow: isDark
                    ? '0 18px 45px rgba(0,0,0,.18)'
                    : '0 18px 45px rgba(5,35,97,.08)',
                  opacity: visible ? 1 : 0,
                  animation: visible
                    ? `${index % 2 === 0 ? 'cardFlyLeft' : 'cardFlyRight'} .8s cubic-bezier(.2,.8,.2,1) ${0.12 + index * 0.1}s both`
                    : 'none',
                  transition:
                    'transform .35s ease, box-shadow .35s ease, border-color .35s ease',
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    borderColor: 'rgba(233,35,218,.45)',
                    boxShadow: isDark
                      ? '0 28px 65px rgba(0,0,0,.34)'
                      : '0 28px 65px rgba(5,35,97,.14)',
                    '& .service-icon': {
                      transform: 'translateY(-5px) rotate(-3deg)',
                      backgroundColor: '#E923DA',
                      color: '#FFFFFF'
                    },
                    '& .service-arrow': {
                      transform: 'translateX(5px)'
                    },
                    '& .service-accent': {
                      width: '100%'
                    }
                  }
                }}
              >
                {/* Animated top accent */}
                <Box
                  className="service-accent"
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '42%',
                    height: 4,
                    backgroundColor: '#E923DA',
                    transition: 'width .4s ease'
                  }}
                />

                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: { xs: 3, md: 3.5 },
                    pt: { xs: 3.5, md: 4 }
                  }}
                >
                  <Box
                    className="service-icon"
                    sx={{
                      width: { xs: 62, md: 70 },
                      height: { xs: 62, md: 70 },
                      borderRadius: 3,
                      display: 'grid',
                      placeItems: 'center',
                      mb: 3,
                      backgroundColor: isDark
                        ? 'rgba(233,35,218,.12)'
                        : 'rgba(233,35,218,.08)',
                      color: '#E923DA',
                      transition: 'transform .35s ease, background-color .35s ease, color .35s ease',
                      animation: visible
                        ? `iconPop .65s cubic-bezier(.2,.8,.2,1) ${0.25 + index * 0.1}s both`
                        : 'none',
                      '& svg': {
                        fontSize: { xs: 30, md: 34 }
                      }
                    }}
                  >
                    {iconMap[service.icon]}
                  </Box>

                  <Typography
                    component="h3"
                    sx={{
                      fontSize: { xs: '1.3rem', md: '1.45rem' },
                      fontWeight: 850,
                      letterSpacing: '-.025em',
                      color: theme.palette.text.primary,
                      mb: 1.2
                    }}
                  >
                    {service.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '.9rem',
                      lineHeight: 1.7,
                      color: theme.palette.text.secondary,
                      mb: 2.5
                    }}
                  >
                    {service.description}
                  </Typography>

                  <Box sx={{ display: 'grid', gap: 1 }}>
                    {service.features.map((feature, featureIndex) => (
                      <Box
                        key={featureIndex}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          color: theme.palette.text.secondary
                        }}
                      >
                        <CheckCircle
                          sx={{
                            mt: '.15rem',
                            fontSize: 16,
                            color: '#E923DA',
                            flexShrink: 0
                          }}
                        />
                        <Typography sx={{ fontSize: '.8rem', lineHeight: 1.45 }}>
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>

                <CardActions sx={{ p: { xs: 3, md: 3.5 }, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={
                      <ArrowForward
                        className="service-arrow"
                        sx={{ transition: 'transform .25s ease' }}
                      />
                    }
                    sx={{
                      minHeight: 48,
                      borderRadius: 2.5,
                      borderColor: isDark
                        ? 'rgba(255,255,255,.16)'
                        : 'rgba(5,35,97,.14)',
                      color: theme.palette.text.primary,
                      fontWeight: 850,
                      textTransform: 'none',
                      transition: 'border-color .25s ease, background-color .25s ease',
                      '&:hover': {
                        borderColor: '#E923DA',
                        backgroundColor: isDark
                          ? 'rgba(233,35,218,.08)'
                          : 'rgba(233,35,218,.05)'
                      }
                    }}
                  >
                    Explore Service
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Bottom trust line */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            textAlign: 'center',
            opacity: visible ? 1 : 0,
            animation: visible ? 'sectionFlyUp .8s ease-out 1s both' : 'none'
          }}
        >
          <Typography
            sx={{
              fontSize: '.78rem',
              fontWeight: 750,
              color: theme.palette.text.secondary
            }}
          >
            Professional care • Reliable results • Attention to detail
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Services;
