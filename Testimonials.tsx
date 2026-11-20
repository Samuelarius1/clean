import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
  Stack,
} from '@mui/material';
import { FormatQuote, Verified, ArrowForward } from '@mui/icons-material';
import { COLORS, TESTIMONIALS } from '../../utils/constants';

const Testimonials = () => {
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
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const dark = theme.palette.mode === 'dark';
  const primary = COLORS.primary || '#052361';
  const pink = COLORS.secondary || '#E923DA';

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
          width: 440,
          height: 440,
          borderRadius: '50%',
          top: -250,
          left: -220,
          background: `radial-gradient(circle, ${pink}18 0%, transparent 68%)`,
          pointerEvents: 'none',
        },

        '&::after': {
          content: '""',
          position: 'absolute',
          width: 360,
          height: 360,
          borderRadius: '50%',
          right: -180,
          bottom: -220,
          background: `radial-gradient(circle, ${primary}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Section heading */}
        <Box
          sx={{
            textAlign: 'center',
            mb: { xs: 5, md: 8 },
            maxWidth: 760,
            mx: 'auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(55px)',
            filter: isVisible ? 'blur(0)' : 'blur(6px)',
            transition:
              'opacity .8s ease, transform .9s cubic-bezier(.16,1,.3,1), filter .9s ease',
          }}
        >
          <Stack
            direction="row"
            spacing={1.2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 1.5 }}
          >
            <Box
              sx={{
                width: 34,
                height: 3,
                borderRadius: 3,
                background: `linear-gradient(90deg, transparent, ${pink})`,
              }}
            />
            <Typography
              variant="overline"
              sx={{
                color: pink,
                letterSpacing: 2.4,
                fontWeight: 900,
                textTransform: 'uppercase',
              }}
            >
              Testimonials
            </Typography>
            <Box
              sx={{
                width: 34,
                height: 3,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${pink}, transparent)`,
              }}
            />
          </Stack>

          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 900,
              letterSpacing: '-.04em',
              lineHeight: 1.05,
              fontSize: { xs: '2.25rem', sm: '2.8rem', md: '3.5rem' },
            }}
          >
            What Our Clients
            <Box component="span" sx={{ color: pink, ml: 1 }}>
              Say
            </Box>
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: theme.palette.text.secondary,
              fontSize: { xs: '.95rem', md: '1.05rem' },
              lineHeight: 1.75,
            }}
          >
            Real experiences from people who trust Faiths CleanPro to keep their
            spaces fresh, clean, and welcoming.
          </Typography>
        </Box>

        {/* Testimonial cards */}
        <Grid container spacing={{ xs: 2.5, md: 3.5 }}>
          {TESTIMONIALS.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
              <Box
                sx={{
                  height: '100%',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? 'translateY(0) scale(1)'
                    : `translateY(${index % 2 === 0 ? 75 : 105}px) scale(.96)`,
                  filter: isVisible ? 'blur(0)' : 'blur(7px)',
                  transition: `opacity .8s ease ${.2 + index * .16}s, transform 1s cubic-bezier(.16,1,.3,1) ${.2 + index * .16}s, filter 1s ease ${.2 + index * .16}s`,
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    minHeight: { xs: 355, md: 395 },
                    p: { xs: 1.5, md: 2 },
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: { xs: 4, md: 5 },
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${
                      dark ? 'rgba(255,255,255,.09)' : 'rgba(5,35,97,.09)'
                    }`,
                    boxShadow: dark
                      ? '0 24px 60px rgba(0,0,0,.28)'
                      : '0 20px 55px rgba(5,35,97,.10)',
                    transition:
                      'transform .38s cubic-bezier(.16,1,.3,1), box-shadow .38s ease, border-color .38s ease',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      borderColor: `${pink}60`,
                      boxShadow: `0 28px 65px ${pink}18`,
                      '& .testimonial-quote': {
                        transform: 'rotate(-7deg) scale(1.08)',
                        opacity: 0.24,
                      },
                      '& .testimonial-avatar': {
                        transform: 'scale(1.06)',
                        borderColor: pink,
                      },
                      '& .testimonial-arrow': {
                        opacity: 1,
                        transform: 'translateX(0)',
                      },
                    },
                  }}
                >
                  {/* Accent top line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '12%',
                      width: '76%',
                      height: 4,
                      borderRadius: '0 0 6px 6px',
                      background: `linear-gradient(90deg, ${primary}, ${pink}, ${primary})`,
                    }}
                  />

                  {/* Decorative quote */}
                  <FormatQuote
                    className="testimonial-quote"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 15,
                      zIndex: 0,
                      fontSize: { xs: 64, md: 72 },
                      color: pink,
                      opacity: 0.13,
                      transition: 'transform .38s ease, opacity .38s ease',
                    }}
                  />

                  <CardContent
                    sx={{
                      position: 'relative',
                      zIndex: 1,
                      p: { xs: 2, md: 2.5 },
                      '&:last-child': { pb: 2.5 },
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Rating */}
                    <Box sx={{ mb: 2.5 }}>
                      <Rating
                        value={5}
                        readOnly
                        sx={{
                          color: pink,
                          '& .MuiRating-icon': {
                            filter: `drop-shadow(0 4px 8px ${pink}22)`,
                          },
                        }}
                      />
                    </Box>

                    {/* Quote */}
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        fontStyle: 'italic',
                        fontSize: { xs: '.95rem', md: '1rem' },
                        lineHeight: 1.8,
                        mb: 4,
                        position: 'relative',
                        '&::before': {
                          content: '"“"',
                          color: pink,
                          fontSize: '2rem',
                          fontWeight: 900,
                          lineHeight: 0,
                          verticalAlign: '-.35em',
                          mr: .4,
                        },
                      }}
                    >
                      {testimonial.testimonial}
                    </Typography>

                    {/* Client */}
                    <Box
                      sx={{
                        mt: 'auto',
                        pt: 2.5,
                        borderTop: `1px solid ${
                          dark ? 'rgba(255,255,255,.08)' : 'rgba(5,35,97,.08)'
                        }`,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 2,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                          <Avatar
                            className="testimonial-avatar"
                            src={testimonial.image}
                            alt={testimonial.name}
                            sx={{
                              mr: 1.7,
                              width: 56,
                              height: 56,
                              flexShrink: 0,
                              border: `2px solid ${primary}`,
                              boxShadow: `0 8px 20px ${primary}20`,
                              transition: 'transform .35s ease, border-color .35s ease',
                            }}
                          />
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="h6"
                              component="div"
                              sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 800,
                                fontSize: { xs: '.98rem', md: '1.02rem' },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {testimonial.name}
                            </Typography>

                            <Typography
                              sx={{
                                color: theme.palette.text.secondary,
                                fontSize: '.8rem',
                                mt: .25,
                              }}
                            >
                              {testimonial.position}
                            </Typography>
                          </Box>
                        </Box>

                        <ArrowForward
                          className="testimonial-arrow"
                          sx={{
                            color: pink,
                            flexShrink: 0,
                            opacity: { xs: 0.8, sm: 0 },
                            transform: { xs: 'translateX(0)', sm: 'translateX(-8px)' },
                            transition: 'opacity .3s ease, transform .3s ease',
                          }}
                        />
                      </Box>

                      {/* Verified client label */}
                      <Stack
                        direction="row"
                        spacing={.7}
                        alignItems="center"
                        sx={{ mt: 1.5 }}
                      >
                        <Verified sx={{ fontSize: 16, color: pink }} />
                        <Typography
                          sx={{
                            color: theme.palette.text.secondary,
                            fontSize: '.72rem',
                            fontWeight: 700,
                          }}
                        >
                          Verified Client Experience
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom trust statement */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            display: 'flex',
            justifyContent: 'center',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(35px)',
            transition: 'opacity .8s ease 1s, transform .8s ease 1s',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              px: 2.2,
              py: 1.1,
              borderRadius: 99,
              border: `1px solid ${pink}30`,
              backgroundColor: dark ? `${pink}08` : `${pink}05`,
            }}
          >
            <Verified sx={{ color: pink, fontSize: 19 }} />
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '.76rem', md: '.82rem' },
                fontWeight: 700,
              }}
            >
              Trusted by clients who value a spotless standard
            </Typography>
          </Box>
        </Box>
      </Container>

      <style>
        {`
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

export default Testimonials;
