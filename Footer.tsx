// src/components/common/Footer.tsx

import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  alpha,
} from '@mui/material';

import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
  CleaningServices,
  Home,
  Business,
  AutoAwesome,
  LocalShipping,
  ArrowForward,
  KeyboardArrowRight,
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';

const NAVY = '#052361';
const MAGENTA = '#E923DA';

const Footer = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isDark = theme.palette.mode === 'dark';

  const year = new Date().getFullYear();

  /*
   * ============================================================
   * THEME TOKENS
   * ============================================================
   */

  const footerBg = isDark
    ? '#020817'
    : '#F5F8FC';



  const footerSurfaceSoft = isDark
    ? alpha('#FFFFFF', 0.035)
    : alpha(NAVY, 0.035);

  const headingColor = isDark
    ? '#FFFFFF'
    : NAVY;

  const bodyColor = isDark
    ? alpha('#FFFFFF', 0.68)
    : alpha(NAVY, 0.68);

  const mutedColor = isDark
    ? alpha('#FFFFFF', 0.43)
    : alpha(NAVY, 0.45);

  const borderColor = isDark
    ? alpha('#FFFFFF', 0.09)
    : alpha(NAVY, 0.09);

  const dividerColor = isDark
    ? alpha('#FFFFFF', 0.09)
    : alpha(NAVY, 0.10);

  const accent = MAGENTA;

  /*
   * ============================================================
   * DATA
   * ============================================================
   */

  const serviceItems = [
    {
      name: 'Home Cleaning',
      icon: <Home />,
    },
    {
      name: 'Office Cleaning',
      icon: <Business />,
    },
    {
      name: 'Deep Cleaning',
      icon: <AutoAwesome />,
    },
    {
      name: 'Move In / Out',
      icon: <LocalShipping />,
    },
    {
      name: 'Professional Care',
      icon: <CleaningServices />,
    },
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Services', path: '/services' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const socials = [
    {
      label: 'Facebook',
      icon: <Facebook />,
      url: '#',
    },
    {
      label: 'Twitter',
      icon: <Twitter />,
      url: '#',
    },
    {
      label: 'Instagram',
      icon: <Instagram />,
      url: '#',
    },
    {
      label: 'LinkedIn',
      icon: <LinkedIn />,
      url: '#',
    },
  ];

  /*
   * ============================================================
   * STYLES
   * ============================================================
   */

  const sectionTitleSx = {
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.78rem',
    fontWeight: 850,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: headingColor,
    mb: 2,
  };

  const linkSx = {
    justifyContent: 'flex-start',
    px: 0,
    minHeight: 35,
    color: bodyColor,
    fontSize: '0.82rem',
    fontWeight: 600,
    textTransform: 'none' as const,
    letterSpacing: '-0.005em',
    borderRadius: 1.5,

    '& .MuiButton-endIcon': {
      ml: 'auto',
      opacity: 0,
      transform: 'translateX(-4px)',
      transition: 'all .22s ease',
    },

    '&:hover': {
      color: accent,
      background: 'transparent',

      '& .MuiButton-endIcon': {
        opacity: 1,
        transform: 'translateX(0)',
      },
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        background: footerBg,
        color: headingColor,

        /*
         * Modern typography throughout the footer
         */
        '& *': {
          fontFamily: theme.typography.fontFamily,
        },
      }}
    >
      {/* =========================================================
          AMBIENT LIGHT
      ========================================================= */}

      <Box
        sx={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: accent,
          opacity: isDark ? 0.045 : 0.025,
          filter: 'blur(120px)',
          top: -260,
          right: -180,
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: 430,
          height: 430,
          borderRadius: '50%',
          background: '#1465FF',
          opacity: isDark ? 0.055 : 0.025,
          filter: 'blur(120px)',
          bottom: -220,
          left: -160,
          pointerEvents: 'none',
        }}
      />

      {/* =========================================================
          SERVICE MARQUEE
      ========================================================= */}

      <Box
        sx={{
          position: 'relative',
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
          background: isDark
            ? `linear-gradient(
                90deg,
                ${alpha(NAVY, 0.9)},
                ${alpha(MAGENTA, 0.08)},
                ${alpha(NAVY, 0.9)}
              )`
            : `linear-gradient(
                90deg,
                ${alpha('#FFFFFF', 0.95)},
                ${alpha(MAGENTA, 0.035)},
                ${alpha('#FFFFFF', 0.95)}
              )`,
          overflow: 'hidden',

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: isDark
              ? `linear-gradient(
                  90deg,
                  #020817 0%,
                  transparent 12%,
                  transparent 88%,
                  #020817 100%
                )`
              : `linear-gradient(
                  90deg,
                  ${footerBg} 0%,
                  transparent 12%,
                  transparent 88%,
                  ${footerBg} 100%
                )`,
            zIndex: 2,
            pointerEvents: 'none',
          },

          '@keyframes footerMarquee': {
            from: {
              transform: 'translateX(0)',
            },
            to: {
              transform: 'translateX(-50%)',
            },
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: 'footerMarquee 28s linear infinite',
            py: {
              xs: 1.5,
              md: 1.8,
            },

            '&:hover': {
              animationPlayState: 'paused',
            },
          }}
        >
          {[...serviceItems, ...serviceItems].map(
            (item, index) => (
              <Box
                key={`${item.name}-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  mx: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 34,
                      md: 39,
                    },
                    height: {
                      xs: 34,
                      md: 39,
                    },
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accent,
                    background: alpha(accent, isDark ? 0.10 : 0.065),
                    border: `1px solid ${alpha(
                      accent,
                      isDark ? 0.22 : 0.15
                    )}`,
                    mr: 1.2,

                    '& svg': {
                      fontSize: {
                        xs: 17,
                        md: 19,
                      },
                    },
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.8rem',
                      md: '0.84rem',
                    },
                    fontWeight: 750,
                    color: bodyColor,
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.name}
                </Typography>

                <Box
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: accent,
                    ml: {
                      xs: 4,
                      md: 5,
                    },
                    opacity: 0.7,
                  }}
                />
              </Box>
            )
          )}
        </Box>
      </Box>

      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          py: {
            xs: 5.5,
            sm: 7,
            md: 8.5,
          },
          px: {
            xs: 2.5,
            sm: 3,
            md: 4,
          },
        }}
      >
        {/* =====================================================
            CTA
        ===================================================== */}

        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: {
              xs: '20px',
              md: '26px',
            },
            mb: {
              xs: 5,
              md: 7,
            },
            p: {
              xs: 2.5,
              sm: 3.5,
              md: 4.5,
            },

            background: isDark
              ? `linear-gradient(
                  135deg,
                  ${alpha('#FFFFFF', 0.045)},
                  ${alpha(MAGENTA, 0.075)}
                )`
              : `linear-gradient(
                  135deg,
                  #FFFFFF,
                  ${alpha(MAGENTA, 0.035)}
                )`,

            border: `1px solid ${borderColor}`,

            boxShadow: isDark
              ? '0 24px 60px rgba(0,0,0,.20)'
              : '0 20px 55px rgba(5,35,97,.07)',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background: accent,
              opacity: isDark ? 0.07 : 0.035,
              filter: 'blur(70px)',
              right: -60,
              top: -100,
              pointerEvents: 'none',
            }}
          />

          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: {
                xs: 'flex-start',
                md: 'center',
              },
              justifyContent: 'space-between',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              gap: 3,
            }}
          >
            <Box sx={{ maxWidth: 670 }}>
              <Typography
                sx={{
                  color: accent,
                  fontSize: '0.68rem',
                  fontWeight: 850,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  mb: 1,
                }}
              >
                Need a cleaner space?
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: '1.4rem',
                    sm: '1.75rem',
                    md: '2rem',
                  },
                  lineHeight: 1.15,
                  fontWeight: 850,
                  letterSpacing: '-0.035em',
                  color: headingColor,
                }}
              >
                Let Faiths CleanPro take care of the cleaning.
              </Typography>

              <Typography
                sx={{
                  mt: 1.15,
                  color: bodyColor,
                  fontSize: {
                    xs: '0.8rem',
                    md: '0.88rem',
                  },
                  lineHeight: 1.75,
                  maxWidth: 570,
                  fontWeight: 450,
                }}
              >
                Professional cleaning solutions designed to
                leave your home or business fresh, clean and
                ready for what matters most.
              </Typography>
            </Box>

            <Button
              onClick={() => navigate('/contact')}
              endIcon={<ArrowForward />}
              sx={{
                flexShrink: 0,
                minHeight: 49,
                px: 2.8,
                borderRadius: '14px',

                background: isDark
                  ? '#FFFFFF'
                  : NAVY,

                color: isDark
                  ? NAVY
                  : '#FFFFFF',

                fontSize: '0.82rem',
                fontWeight: 800,
                textTransform: 'none',
                letterSpacing: '-0.005em',

                boxShadow: isDark
                  ? '0 12px 30px rgba(0,0,0,.22)'
                  : `0 12px 30px ${alpha(NAVY, 0.20)}`,

                transition: 'all .25s ease',

                '&:hover': {
                  background: isDark
                    ? '#FFFFFF'
                    : NAVY,
                  color: isDark
                    ? NAVY
                    : '#FFFFFF',
                  transform: 'translateY(-3px)',
                  boxShadow: isDark
                    ? '0 17px 35px rgba(0,0,0,.28)'
                    : `0 17px 35px ${alpha(NAVY, 0.25)}`,
                },

                '& .MuiButton-endIcon': {
                  transition: 'transform .25s ease',
                },

                '&:hover .MuiButton-endIcon': {
                  transform: 'translateX(4px)',
                },
              }}
            >
              Get a Quote
            </Button>
          </Box>
        </Box>

        {/* =====================================================
            FOOTER COLUMNS
        ===================================================== */}

        <Grid
          container
          spacing={{
            xs: 4,
            md: 5,
          }}
        >
          {/* ===================================================
              BRAND
          =================================================== */}

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.4,
                mb: 2.2,
              }}
            >
              {/* LOGO */}

              <Box
                sx={{
                  width: {
                    xs: 50,
                    sm: 56,
                  },
                  height: {
                    xs: 50,
                    sm: 56,
                  },
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: isDark
                    ? '0 10px 30px rgba(0,0,0,.25)'
                    : '0 10px 28px rgba(5,35,97,.12)',
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Faiths CleanPro logo"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: '1.1rem',
                      sm: '1.25rem',
                    },
                    lineHeight: 1,
                    fontWeight: 900,
                    color: headingColor,
                    letterSpacing: '-0.035em',
                  }}
                >
                  Faiths

                  <Box
                    component="span"
                    sx={{
                      color: accent,
                      ml: 0.35,
                    }}
                  >
                    CleanPro
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    mt: 0.6,
                    fontSize: '0.59rem',
                    color: mutedColor,
                    fontWeight: 750,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                  }}
                >
                  Clean • Fresh • Professional
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                maxWidth: 500,
                color: bodyColor,
                fontSize: {
                  xs: '0.82rem',
                  sm: '0.86rem',
                },
                lineHeight: 1.85,
                fontWeight: 450,
                letterSpacing: '-0.005em',
              }}
            >
              Your trusted partner for professional cleaning
              services. We are committed to providing
              dependable cleaning solutions for homes,
              offices and businesses.
            </Typography>

            {/* SOCIALS */}

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mt: 2.5,
              }}
            >
              {socials.map((social) => (
                <Tooltip
                  key={social.label}
                  title={social.label}
                  arrow
                >
                  <IconButton
                    component="a"
                    href={social.url}
                    aria-label={social.label}
                    sx={{
                      width: 40,
                      height: 40,
                      color: bodyColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '12px',
                      background: footerSurfaceSoft,
                      transition: 'all .25s ease',

                      '&:hover': {
                        color: '#FFFFFF',
                        borderColor: accent,
                        background: accent,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 10px 25px ${alpha(
                          accent,
                          0.22
                        )}`,
                      },

                      '& svg': {
                        fontSize: 18,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Grid>

          {/* ===================================================
              QUICK LINKS
          =================================================== */}

          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 2,
            }}
          >
            <Typography sx={sectionTitleSx}>
              Quick Links
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.55,
              }}
            >
              {quickLinks.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  endIcon={
                    <KeyboardArrowRight
                      sx={{ fontSize: 17 }}
                    />
                  }
                  sx={linkSx}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* ===================================================
              SERVICES
          =================================================== */}

          <Grid
            size={{
              xs: 6,
              sm: 4,
              md: 2,
            }}
            sx={{
              display: {
                xs: 'none',
                sm: 'block',
              },
            }}
          >
            <Typography sx={sectionTitleSx}>
              Services
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.55,
              }}
            >
              {[
                'Home Cleaning',
                'Office Cleaning',
                'Deep Cleaning',
                'Move In / Out',
              ].map((service) => (
                <Button
                  key={service}
                  onClick={() => navigate('/services')}
                  endIcon={
                    <KeyboardArrowRight
                      sx={{ fontSize: 17 }}
                    />
                  }
                  sx={linkSx}
                >
                  {service}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* ===================================================
              CONTACT
          =================================================== */}

          <Grid
            size={{
              xs: 12,
              sm: 4,
              md: 3,
            }}
          >
            <Typography sx={sectionTitleSx}>
              Contact Us
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.55,
              }}
            >
              {/* LOCATION */}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.2,
                }}
              >
                <LocationOn
                  sx={{
                    color: accent,
                    fontSize: 19,
                    mt: 0.15,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    color: bodyColor,
                    fontSize: '0.77rem',
                    lineHeight: 1.65,
                    fontWeight: 500,
                  }}
                >
                  123 Clean Street,
                  <br />
                  Sparkle City, SC 12345
                </Typography>
              </Box>

              {/* PHONE */}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                }}
              >
                <Phone
                  sx={{
                    color: accent,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    color: bodyColor,
                    fontSize: '0.77rem',
                    fontWeight: 500,
                  }}
                >
                  (123) 456-7890
                </Typography>
              </Box>

              {/* EMAIL */}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                }}
              >
                <Email
                  sx={{
                    color: accent,
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    color: bodyColor,
                    fontSize: '0.77rem',
                    fontWeight: 500,
                    wordBreak: 'break-word',
                  }}
                >
                  info@faithscleanpro.com
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <Divider
          sx={{
            my: {
              xs: 4,
              md: 5,
            },
            borderColor: dividerColor,
          }}
        />

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <Box
          sx={{
            display: 'flex',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: mutedColor,
              fontSize: {
                xs: '0.68rem',
                sm: '0.73rem',
              },
              fontWeight: 500,
              letterSpacing: '-0.005em',
            }}
          >
            © {year} Faiths CleanPro. All rights reserved.
          </Typography>

          {/* DESKTOP LEGAL LINKS */}

          <Box
            sx={{
              display: {
                xs: 'none',
                sm: 'flex',
              },
              alignItems: 'center',
              gap: 2.5,
            }}
          >
            <Typography
              onClick={() => navigate('/')}
              sx={{
                cursor: 'pointer',
                color: mutedColor,
                fontSize: '0.72rem',
                fontWeight: 550,
                transition: 'color .2s ease',

                '&:hover': {
                  color: accent,
                },
              }}
            >
              Privacy Policy
            </Typography>

            <Typography
              sx={{
                color: mutedColor,
                fontSize: '0.72rem',
                fontWeight: 550,
                cursor: 'pointer',
                transition: 'color .2s ease',

                '&:hover': {
                  color: accent,
                },
              }}
            >
              Terms of Service
            </Typography>
          </Box>

          {/* MOBILE BRANDING */}

          <Box
            sx={{
              display: {
                xs: 'flex',
                sm: 'none',
              },
              alignItems: 'center',
              gap: 0.7,
            }}
          >
            <CleaningServices
              sx={{
                fontSize: 15,
                color: accent,
              }}
            />

            <Typography
              sx={{
                color: mutedColor,
                fontSize: '0.67rem',
                fontWeight: 600,
              }}
            >
              Professional Cleaning Services
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;