import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  Stack,
  useTheme,
} from '@mui/material';
import {
  LocalOffer,
  ArrowForward,
  AutoAwesome,
  EventAvailable,
} from '@mui/icons-material';
import { COLORS } from '../../utils/constants';

const Events = () => {
  const theme = useTheme();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      { threshold: 0.16, rootMargin: '0px 0px -70px 0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);


  const pink = COLORS.secondary || '#E923DA';

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 7, md: 9 },
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.default,

        /* Image + brand overlay */
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(5,35,97,.96) 0%,
            rgba(5,35,97,.89) 42%,
            rgba(5,35,97,.72) 72%,
            rgba(5,35,97,.82) 100%
          ),
          url('https://images.unsplash.com/photo-1584622050111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1800&q=85')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',

        '&::before': {
          content: '""',
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          top: -180,
          right: -100,
          background: `radial-gradient(circle, ${pink}35 0%, transparent 68%)`,
          pointerEvents: 'none',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          bottom: -170,
          left: -120,
          background: `radial-gradient(circle, ${pink}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center">
          {/* Offer content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'translateX(0) translateY(0)'
                  : 'translateX(-75px) translateY(25px)',
                filter: isVisible ? 'blur(0)' : 'blur(6px)',
                transition:
                  'opacity .85s ease, transform 1s cubic-bezier(.16,1,.3,1), filter 1s ease',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                alignItems="center"
                sx={{ mb: 2.2, gap: 1 }}
              >
                <Chip
                  icon={<LocalOffer sx={{ fontSize: '17px !important' }} />}
                  label="LIMITED-TIME PROMOTION"
                  size="small"
                  sx={{
                    height: 31,
                    borderRadius: 99,
                    backgroundColor: pink,
                    color: '#fff',
                    fontWeight: 900,
                    letterSpacing: .7,
                    '& .MuiChip-icon': { color: '#fff' },
                    boxShadow: `0 8px 24px ${pink}40`,
                  }}
                />

                <Stack
                  direction="row"
                  spacing={.7}
                  alignItems="center"
                  sx={{
                    px: 1.2,
                    py: .55,
                    borderRadius: 99,
                    border: '1px solid rgba(255,255,255,.2)',
                    backgroundColor: 'rgba(255,255,255,.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <AutoAwesome sx={{ color: pink, fontSize: 16 }} />
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,.86)',
                      fontSize: '.7rem',
                      fontWeight: 800,
                      letterSpacing: .6,
                    }}
                  >
                    FRESH START OFFER
                  </Typography>
                </Stack>
              </Stack>

              <Typography
                component="h2"
                sx={{
                  color: '#fff',
                  fontWeight: 950,
                  letterSpacing: '-.045em',
                  lineHeight: 1.03,
                  fontSize: { xs: '2.2rem', sm: '2.9rem', md: '3.55rem' },
                  maxWidth: 780,
                }}
              >
                Spring Cleaning
                <Box component="span" sx={{ color: pink, ml: 1 }}>
                  Special
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  color: 'rgba(255,255,255,.88)',
                  fontSize: { xs: '.98rem', md: '1.12rem' },
                  lineHeight: 1.75,
                  maxWidth: 760,
                }}
              >
                Book a deep clean this month and get{' '}
                <Box
                  component="span"
                  sx={{
                    color: pink,
                    fontWeight: 950,
                    fontSize: { xs: '1.25rem', md: '1.45rem' },
                  }}
                >
                  20% OFF
                </Box>{' '}
                your first service.
              </Typography>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.4}
                sx={{
                  mt: 3.2,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(35px)',
                  transition:
                    'opacity .75s ease .35s, transform .75s cubic-bezier(.16,1,.3,1) .35s',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    minHeight: 52,
                    px: { xs: 3, md: 4 },
                    borderRadius: 3,
                    backgroundColor: pink,
                    color: '#fff',
                    fontWeight: 900,
                    boxShadow: `0 14px 30px ${pink}38`,
                    transition:
                      'transform .3s ease, box-shadow .3s ease, background-color .3s ease',
                    '&:hover': {
                      backgroundColor: '#d51ac9',
                      transform: 'translateY(-4px)',
                      boxShadow: `0 19px 38px ${pink}50`,
                    },
                  }}
                >
                  Claim Offer
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* Offer badge / visual */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? 'translateX(0) scale(1)'
                  : 'translateX(80px) scale(.88)',
                filter: isVisible ? 'blur(0)' : 'blur(7px)',
                transition:
                  'opacity .9s ease .18s, transform 1s cubic-bezier(.16,1,.3,1) .18s, filter 1s ease .18s',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 210, sm: 235, md: 245 },
                  height: { xs: 210, sm: 235, md: 245 },
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    `radial-gradient(circle at 35% 30%, rgba(255,255,255,.16), rgba(255,255,255,.05) 48%, rgba(255,255,255,.025) 70%)`,
                  border: `1px solid rgba(255,255,255,.18)`,
                  boxShadow:
                    '0 25px 70px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.18)',
                  backdropFilter: 'blur(12px)',
                  animation: isVisible ? 'offerFloat 4.5s ease-in-out infinite' : 'none',

                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 12,
                    borderRadius: '50%',
                    border: `2px dashed ${pink}90`,
                    animation: isVisible ? 'offerSpin 16s linear infinite' : 'none',
                  },

                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -7,
                    borderRadius: '50%',
                    border: `1px solid ${pink}45`,
                  },
                }}
              >
                <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <Typography
                    sx={{
                      color: '#fff',
                      fontSize: { xs: '.72rem', md: '.76rem' },
                      fontWeight: 900,
                      letterSpacing: 2,
                      textTransform: 'uppercase',
                    }}
                  >
                    Save
                  </Typography>

                  <Typography
                    sx={{
                      color: pink,
                      fontSize: { xs: '4.2rem', md: '4.7rem' },
                      lineHeight: .9,
                      fontWeight: 1000,
                      letterSpacing: '-.08em',
                      textShadow: `0 8px 25px ${pink}38`,
                    }}
                  >
                    20%
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      color: 'rgba(255,255,255,.88)',
                      fontSize: '.72rem',
                      fontWeight: 800,
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                    }}
                  >
                    On Your First Service
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom micro-details */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1.4, sm: 3 }}
          sx={{
            mt: { xs: 4.5, md: 5.5 },
            pt: 2.2,
            borderTop: '1px solid rgba(255,255,255,.14)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity .7s ease .65s, transform .7s ease .65s',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <EventAvailable sx={{ color: pink, fontSize: 19 }} />
            <Typography
              sx={{
                color: 'rgba(255,255,255,.76)',
                fontSize: '.78rem',
                fontWeight: 700,
              }}
            >
              Flexible scheduling
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <AutoAwesome sx={{ color: pink, fontSize: 19 }} />
            <Typography
              sx={{
                color: 'rgba(255,255,255,.76)',
                fontSize: '.78rem',
                fontWeight: 700,
              }}
            >
              Professional deep cleaning
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <LocalOffer sx={{ color: pink, fontSize: 19 }} />
            <Typography
              sx={{
                color: 'rgba(255,255,255,.76)',
                fontSize: '.78rem',
                fontWeight: 700,
              }}
            >
              New-client promotion
            </Typography>
          </Stack>
        </Stack>
      </Container>

      <style>
        {`
          @keyframes offerFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          @keyframes offerSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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

export default Events;
