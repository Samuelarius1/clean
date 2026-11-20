
import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Alert,
  MenuItem,
  useTheme
} from '@mui/material';

import {
  CheckCircle,
  ArrowForward,
  CleaningServices,
  Verified,
  AutoAwesome
} from '@mui/icons-material';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

const Hero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [showAlert, setShowAlert] = useState(false);

  const primary = '#052361';
  const accent = '#E923DA';

  const textColor = isDark ? '#FFFFFF' : primary;
  const mutedColor = isDark
    ? 'rgba(255,255,255,0.68)'
    : 'rgba(5,35,97,0.68)';

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('Quote enquiry:', formData);

    setShowAlert(true);

    window.setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const fieldSx = {
    mb: 1.5,

    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      backgroundColor: isDark
        ? 'rgba(255,255,255,0.035)'
        : '#F8FAFD',
      color: textColor,
      minHeight: 53,

      '& fieldset': {
        borderColor: isDark
          ? 'rgba(255,255,255,0.13)'
          : 'rgba(5,35,97,0.13)'
      },

      '&:hover fieldset': {
        borderColor: accent
      },

      '&.Mui-focused fieldset': {
        borderColor: accent,
        borderWidth: 1.5
      }
    },

    '& .MuiInputLabel-root': {
      color: mutedColor
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: accent
    },

    '& input, & textarea': {
      fontSize: '0.9rem'
    },

    '& .MuiSelect-icon': {
      color: mutedColor
    }
  };

  const trustItems = [
    'Professional Care',
    'Quality Service',
    'Customer Focus'
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        backgroundColor: isDark ? '#08132D' : '#FFFFFF',
        color: textColor,

        pt: {
          xs: 5,
          sm: 6,
          md: 9
        },

        pb: {
          xs: 5,
          sm: 7,
          md: 10
        },

        minHeight: {
          md: 'calc(100vh - 72px)'
        },

        display: 'flex',
        alignItems: 'center',

        borderBottom: `1px solid ${theme.palette.divider}`,

        '@keyframes heroReveal': {
          from: {
            opacity: 0,
            transform: 'translateY(22px)'
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)'
          }
        },

        '@keyframes cardReveal': {
          from: {
            opacity: 0,
            transform: 'translateX(25px)'
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)'
          }
        },

        '@keyframes floatSoft': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-8px)'
          }
        },

        '@keyframes pulseRing': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: 0.35
          },
          '50%': {
            transform: 'scale(1.08)',
            opacity: 0.12
          }
        },

        '@media (prefers-reduced-motion: reduce)': {
          '& *': {
            animation: 'none !important',
            transition: 'none !important'
          }
        }
      }}
    >
      {/* DECORATIVE BACKGROUND */}

      <Box
        sx={{
          position: 'absolute',
          width: { xs: 180, md: 350 },
          height: { xs: 180, md: 350 },
          borderRadius: '50%',
          border: `1px solid ${accent}35`,
          right: { xs: -100, md: -120 },
          top: { xs: 30, md: -100 },
          animation: 'pulseRing 6s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: accent,
          right: { xs: 24, md: 100 },
          top: { xs: 110, md: 130 },
          animation: 'floatSoft 4s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      {/* MAIN CONTENT */}

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: {
            xs: 2.2,
            sm: 4,
            md: 5
          }
        }}
      >
        <Grid
          container
          spacing={{
            xs: 5,
            md: 7,
            lg: 9
          }}
          alignItems="center"
        >
          {/* LEFT CONTENT */}

          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                animation: 'heroReveal 0.8s ease-out both',
                maxWidth: 750
              }}
            >
              {/* BRAND LABEL */}

              <Stack
                direction="row"
                spacing={1.2}
                alignItems="center"
                sx={{ mb: { xs: 2.5, md: 3.5 } }}
              >
                <Box
                  sx={{
                    width: 35,
                    height: 3,
                    borderRadius: 10,
                    backgroundColor: accent
                  }}
                />

                <Typography
                  sx={{
                    fontSize: { xs: '0.7rem', md: '0.8rem' },
                    letterSpacing: '0.17em',
                    fontWeight: 900,
                    color: mutedColor
                  }}
                >
                  FAITHS CLEANPRO
                </Typography>
              </Stack>

              {/* MAIN HEADING */}

              <Typography
                component="h1"
                sx={{
                  fontSize: {
                    xs: '2.65rem',
                    sm: '3.6rem',
                    md: '4.4rem',
                    lg: '5.2rem'
                  },

                  lineHeight: {
                    xs: 1.08,
                    md: 1.02
                  },

                  letterSpacing: {
                    xs: '-0.055em',
                    md: '-0.06em'
                  },

                  fontWeight: 900,
                  mb: 2.5,
                  color: textColor
                }}
              >
                A cleaner space.

                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    color: accent
                  }}
                >
                  A better standard.
                </Box>
              </Typography>

              {/* DESCRIPTION */}

              <Typography
                sx={{
                  maxWidth: 620,
                  fontSize: {
                    xs: '0.98rem',
                    sm: '1.05rem',
                    md: '1.16rem'
                  },
                  lineHeight: 1.8,
                  color: mutedColor,
                  mb: 3
                }}
              >
                Professional cleaning for homes, offices and
                businesses — delivered with care, consistency
                and attention to the details that make a space
                feel truly fresh.
              </Typography>

              {/* TRUST INDICATORS */}

              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row'
                }}
                spacing={{
                  xs: 1.3,
                  sm: 2.5
                }}
                sx={{ mb: 3.5 }}
              >
                {trustItems.map(item => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CheckCircle
                      sx={{
                        fontSize: 18,
                        color: accent
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: textColor
                      }}
                    >
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* ACTION BUTTONS */}

              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row'
                }}
                spacing={1.5}
                sx={{ mb: 3.5 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => scrollTo('quote-form')}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 'auto'
                    },
                    minHeight: 54,
                    px: 3.5,
                    borderRadius: 2.5,
                    backgroundColor: accent,
                    color: '#FFFFFF',
                    fontWeight: 850,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    boxShadow: `0 12px 28px ${accent}35`,

                    '&:hover': {
                      backgroundColor: '#D51AC5',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  Get a Free Quote
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => scrollTo('services')}
                  sx={{
                    width: {
                      xs: '100%',
                      sm: 'auto'
                    },
                    minHeight: 54,
                    px: 3,
                    borderRadius: 2.5,
                    borderColor: theme.palette.divider,
                    color: textColor,
                    fontWeight: 800,
                    textTransform: 'none',

                    '&:hover': {
                      borderColor: accent,
                      backgroundColor: `${accent}08`
                    }
                  }}
                >
                  Explore Services
                </Button>
              </Stack>

              {/* CREDIBILITY STRIP */}

              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  width: 'fit-content',
                  maxWidth: '100%',
                  p: 1.5,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.035)'
                    : '#F8FAFD'
                }}
              >
                <Verified
                  sx={{
                    fontSize: 27,
                    color: accent
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      fontSize: '0.84rem',
                      fontWeight: 850,
                      color: textColor
                    }}
                  >
                    Cleaning You Can Count On
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '0.73rem',
                      color: mutedColor
                    }}
                  >
                    Professional care, every step of the way.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* RIGHT QUOTE FORM */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              id="quote-form"
              sx={{
                position: 'relative',
                scrollMarginTop: 90,
                animation: 'cardReveal 0.9s ease-out 0.15s both'
              }}
            >
              {/* FLOATING BADGE */}

              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 2,
                  top: -17,
                  left: { xs: 15, sm: 25, md: -18 },
                  px: 2,
                  py: 1.1,
                  borderRadius: 2.5,
                  backgroundColor: primary,
                  color: '#FFFFFF',
                  boxShadow: '0 10px 25px rgba(5,35,97,0.2)',
                  animation: 'floatSoft 4s ease-in-out infinite'
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    letterSpacing: '0.1em'
                  }}
                >
                  QUICK QUOTE
                </Typography>

                <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                  Simple. Fast. Personal.
                </Typography>
              </Box>

              {/* FORM CARD */}

              <Paper
                elevation={0}
                sx={{
                  p: {
                    xs: 2.5,
                    sm: 3.5,
                    md: 3.5,
                    lg: 4
                  },

                  borderRadius: {
                    xs: 3.5,
                    md: 4.5
                  },

                  backgroundColor: isDark ? '#0E1D3D' : '#FFFFFF',

                  color: textColor,

                  border: `1px solid ${theme.palette.divider}`,

                  boxShadow: isDark
                    ? '0 20px 55px rgba(0,0,0,0.25)'
                    : '0 22px 60px rgba(5,35,97,0.10)'
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <CleaningServices
                      sx={{
                        color: accent,
                        fontSize: 25
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: '0.73rem',
                        fontWeight: 900,
                        letterSpacing: '0.12em',
                        color: accent
                      }}
                    >
                      REQUEST A QUOTE
                    </Typography>
                  </Stack>

                  <Typography
                    component="h2"
                    sx={{
                      fontSize: {
                        xs: '1.55rem',
                        sm: '1.8rem'
                      },
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      color: textColor
                    }}
                  >
                    Tell us what needs cleaning.
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: '0.86rem',
                      lineHeight: 1.7,
                      color: mutedColor
                    }}
                  >
                    Share a few details and let us help you
                    find the right cleaning solution.
                  </Typography>
                </Box>

                {/* FORM */}

                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={0.5}>
                    <TextField
                      fullWidth
                      required
                      name="name"
                      label="Your Name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      sx={fieldSx}
                    />

                    <TextField
                      fullWidth
                      required
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      sx={fieldSx}
                    />

                    <TextField
                      fullWidth
                      name="phone"
                      type="tel"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      sx={fieldSx}
                    />

                    <TextField
                      fullWidth
                      select
                      required
                      name="service"
                      label="Service Required"
                      value={formData.service}
                      onChange={handleChange}
                      sx={fieldSx}
                    >
                      <MenuItem value="home">Home Cleaning</MenuItem>
                      <MenuItem value="office">Office Cleaning</MenuItem>
                      <MenuItem value="commercial">
                        Commercial Cleaning
                      </MenuItem>
                      <MenuItem value="deep">Deep Cleaning</MenuItem>
                      <MenuItem value="other">Other Services</MenuItem>
                    </TextField>

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="message"
                      label="Additional Details (Optional)"
                      placeholder="Tell us a little more about your cleaning needs..."
                      value={formData.message}
                      onChange={handleChange}
                      sx={{
                        ...fieldSx,
                        '& .MuiOutlinedInput-root': {
                          ...fieldSx['& .MuiOutlinedInput-root'],
                          alignItems: 'flex-start',
                          py: 1
                        }
                      }}
                    />
                  </Stack>

                  {/* SUBMIT */}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{
                      mt: 1,
                      minHeight: 55,
                      borderRadius: 2.5,
                      backgroundColor: primary,
                      color: '#FFFFFF',
                      fontWeight: 900,
                      fontSize: '0.94rem',
                      textTransform: 'none',
                      transition: 'all 0.25s ease',

                      '&:hover': {
                        backgroundColor: '#0A347F',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 25px rgba(5,35,97,0.2)'
                      }
                    }}
                  >
                    Request My Quote
                  </Button>

                  {showAlert && (
                    <Alert
                      severity="success"
                      sx={{
                        mt: 2,
                        borderRadius: 2
                      }}
                    >
                      Form submitted locally. Connect your backend
                      to deliver enquiries to Faiths CleanPro.
                    </Alert>
                  )}
                </Box>
              </Paper>

              {/* BOTTOM MESSAGE */}

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                alignItems="center"
                sx={{
                  mt: 2,
                  color: mutedColor
                }}
              >
                <AutoAwesome
                  sx={{
                    fontSize: 15,
                    color: accent
                  }}
                />

                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.67rem',
                      sm: '0.74rem'
                    },
                    fontWeight: 700,
                    textAlign: 'center'
                  }}
                >
                  Professional care, from first contact to final clean.
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
