import { Box, Typography, keyframes } from '@mui/material';
import { useEffect, useState } from 'react';

/* ==========================================================================
   FAITH'S CLEANPRO — PREMIUM LOADING SCREEN
   ========================================================================== */

const NAVY = '#052361';
const MAGENTA = '#E923DA';
const WHITE = '#FFFFFF';

/* ==========================================================================
   PREMIUM ANIMATIONS
   ========================================================================== */

/* Main logo entrance — soft, controlled and elegant */
const logoReveal = keyframes`
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.86);
    filter: blur(8px);
  }

  65% {
    opacity: 1;
    transform: translateY(-3px) scale(1.015);
    filter: blur(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`;

/* Very subtle logo breathing effect */
const logoBreath = keyframes`
  0%, 100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.025);
  }
`;

/* Rotating light around the logo */
const lightSweep = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

/* Soft expanding halo */
const halo = keyframes`
  0% {
    transform: scale(0.82);
    opacity: 0;
  }

  30% {
    opacity: 0.22;
  }

  70% {
    opacity: 0.08;
  }

  100% {
    transform: scale(1.18);
    opacity: 0;
  }
`;

/* Text reveal */
const fadeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(14px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* Progress shimmer */
const progressSweep = keyframes`
  0% {
    transform: translateX(-120%);
  }

  100% {
    transform: translateX(240%);
  }
`;

/* Loading dots */
const dotBounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.35;
  }

  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
`;

/* Background glow */
const ambientGlow = keyframes`
  0%, 100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.18;
  }

  50% {
    transform: translate3d(0, -20px, 0) scale(1.05);
    opacity: 0.27;
  }
`;

/* Exit animation */
const exitUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  100% {
    opacity: 0;
    transform: translateY(-18px) scale(0.985);
  }
`;

/* ==========================================================================
   LOADING COMPONENT
   ========================================================================== */

const Loading = () => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLeaving(true);
    }, 1350);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
        zIndex: 99999,

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        overflow: 'hidden',

        background: `
          radial-gradient(
            circle at 50% 42%,
            rgba(233,35,218,0.10) 0%,
            rgba(233,35,218,0.035) 22%,
            transparent 48%
          ),
          linear-gradient(
            145deg,
            #041b4b 0%,
            ${NAVY} 48%,
            #031a48 100%
          )
        `,

        opacity: leaving ? 0 : 1,

        visibility: leaving ? 'hidden' : 'visible',

        animation: leaving
          ? `${exitUp} .48s cubic-bezier(.22,1,.36,1) forwards`
          : 'none',

        pointerEvents: leaving ? 'none' : 'auto',

        transition: 'visibility .48s ease',

        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          transition: 'none',

          '& *': {
            animation: 'none !important',
            transition: 'none !important',
          },
        },
      }}
    >
      {/* ====================================================================
          AMBIENT BACKGROUND GLOWS
          ==================================================================== */}

      <Box
        sx={{
          position: 'absolute',
          width: {
            xs: 230,
            sm: 330,
            md: 420,
          },
          height: {
            xs: 230,
            sm: 330,
            md: 420,
          },

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(233,35,218,.18) 0%, rgba(233,35,218,.04) 42%, transparent 72%)',

          top: {
            xs: '8%',
            md: '12%',
          },

          right: {
            xs: '-120px',
            sm: '-100px',
            md: '-80px',
          },

          animation: `${ambientGlow} 7s ease-in-out infinite`,

          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          width: {
            xs: 210,
            sm: 300,
            md: 380,
          },
          height: {
            xs: 210,
            sm: 300,
            md: 380,
          },

          borderRadius: '50%',

          background:
            'radial-gradient(circle, rgba(233,35,218,.12) 0%, rgba(233,35,218,.025) 45%, transparent 72%)',

          bottom: {
            xs: '-120px',
            sm: '-110px',
            md: '-90px',
          },

          left: {
            xs: '-110px',
            sm: '-90px',
            md: '-70px',
          },

          animation: `${ambientGlow} 8s ease-in-out infinite`,
          animationDelay: '-3s',

          pointerEvents: 'none',
        }}
      />

      {/* ====================================================================
          TOP BRAND MARK
          ==================================================================== */}

      <Box
        sx={{
          position: 'absolute',

          top: {
            xs: 22,
            sm: 30,
            md: 36,
          },

          left: {
            xs: 20,
            sm: 30,
            md: 42,
          },

          display: 'flex',
          alignItems: 'center',
          gap: 1.1,

          opacity: 0.82,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: MAGENTA,

            boxShadow: `0 0 14px rgba(233,35,218,.65)`,

            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -4,
              borderRadius: '50%',
              border: `1px solid rgba(233,35,218,.3)`,
            },
          }}
        />

        <Typography
          sx={{
            color: WHITE,

            fontFamily:
              '"Inter", "Montserrat", "Segoe UI", sans-serif',

            fontSize: {
              xs: '0.58rem',
              sm: '0.62rem',
            },

            fontWeight: 700,

            letterSpacing: {
              xs: '0.13em',
              sm: '0.17em',
            },

            textTransform: 'uppercase',

            whiteSpace: 'nowrap',
          }}
        >
          Faiths CleanPro
        </Typography>
      </Box>

      {/* ====================================================================
          MAIN CONTENT
          ==================================================================== */}

      <Box
        sx={{
          position: 'relative',
          zIndex: 5,

          width: '100%',
          maxWidth: 520,

          px: {
            xs: 2.5,
            sm: 4,
          },

          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',

          textAlign: 'center',
        }}
      >
        {/* ==================================================================
            LOGO SYSTEM
            ================================================================== */}

        <Box
          sx={{
            position: 'relative',

            width: {
              xs: 150,
              sm: 176,
              md: 194,
            },

            height: {
              xs: 150,
              sm: 176,
              md: 194,
            },

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            mb: {
              xs: 3.2,
              sm: 3.8,
            },

            animation: `${logoReveal} .9s cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          {/* Large soft halo */}
          <Box
            sx={{
              position: 'absolute',
              inset: {
                xs: 8,
                sm: 9,
                md: 10,
              },

              borderRadius: '50%',

              border: '1px solid rgba(233,35,218,.24)',

              animation: `${halo} 2.8s ease-out infinite`,
            }}
          />

          {/* Second halo */}
          <Box
            sx={{
              position: 'absolute',
              inset: {
                xs: 18,
                sm: 20,
                md: 22,
              },

              borderRadius: '50%',

              border: '1px solid rgba(255,255,255,.10)',

              animation: `${halo} 2.8s ease-out infinite`,
              animationDelay: '1.35s',
            }}
          />

          {/* Rotating light ring */}
          <Box
            sx={{
              position: 'absolute',
              inset: {
                xs: 3,
                sm: 4,
                md: 5,
              },

              borderRadius: '50%',

              background: `
                conic-gradient(
                  from 0deg,
                  transparent 0deg,
                  transparent 265deg,
                  rgba(233,35,218,.08) 285deg,
                  rgba(233,35,218,.9) 320deg,
                  rgba(255,255,255,.75) 340deg,
                  transparent 360deg
                )
              `,

              animation: `${lightSweep} 2.8s linear infinite`,

              WebkitMask:
                'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',

              mask:
                'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)',
            }}
          />

          {/* Outer static ring */}
          <Box
            sx={{
              position: 'absolute',
              inset: {
                xs: 5,
                sm: 6,
                md: 7,
              },

              borderRadius: '50%',

              border: '1px solid rgba(233,35,218,.36)',

              boxShadow: `
                0 0 30px rgba(233,35,218,.08),
                inset 0 0 25px rgba(233,35,218,.04)
              `,
            }}
          />

          {/* Logo container */}
          <Box
            sx={{
              position: 'relative',

              width: {
                xs: 112,
                sm: 132,
                md: 146,
              },

              height: {
                xs: 112,
                sm: 132,
                md: 146,
              },

              borderRadius: '50%',

              backgroundColor: WHITE,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              overflow: 'hidden',

              border: {
                xs: '3px solid rgba(255,255,255,.96)',
                sm: '3px solid rgba(255,255,255,.96)',
              },

              boxShadow: `
                0 22px 55px rgba(0,0,0,.28),
                0 0 0 8px rgba(255,255,255,.025)
              `,

              animation: `${logoBreath} 3.4s ease-in-out infinite`,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="Faiths CleanPro"
              sx={{
                width: '100%',
                height: '100%',

                objectFit: 'contain',

                display: 'block',
              }}
            />
          </Box>
        </Box>

        {/* ==================================================================
            BRAND NAME
            ================================================================== */}

        <Typography
          component="h1"
          sx={{
            color: WHITE,

            fontFamily:
              '"Inter", "Montserrat", "Segoe UI", sans-serif',

            fontSize: {
              xs: '1.72rem',
              sm: '2.08rem',
              md: '2.38rem',
            },

            fontWeight: 800,

            lineHeight: 1.08,

            letterSpacing: {
              xs: '-0.045em',
              sm: '-0.055em',
            },

            mb: 0.9,

            animation: `${fadeUp} .7s .2s cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          Faiths
          <Box
            component="span"
            sx={{
              color: MAGENTA,
              ml: 0.65,

              textShadow:
                '0 0 22px rgba(233,35,218,.20)',
            }}
          >
            CleanPro
          </Box>
        </Typography>

        {/* ==================================================================
            TAGLINE
            ================================================================== */}

        <Typography
          sx={{
            color: 'rgba(255,255,255,.68)',

            fontFamily:
              '"Inter", "Montserrat", "Segoe UI", sans-serif',

            fontSize: {
              xs: '0.67rem',
              sm: '0.74rem',
              md: '0.78rem',
            },

            fontWeight: 600,

            letterSpacing: {
              xs: '0.105em',
              sm: '0.14em',
            },

            textTransform: 'uppercase',

            animation: `${fadeUp} .7s .3s cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          Clean. Fresh. Professional.
        </Typography>

        {/* ==================================================================
            LOADING STATUS
            ================================================================== */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            gap: 0.7,

            mt: {
              xs: 3.5,
              sm: 4,
            },

            animation: `${fadeUp} .7s .4s cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          <Typography
            sx={{
              color: 'rgba(255,255,255,.48)',

              fontFamily:
                '"Inter", "Montserrat", "Segoe UI", sans-serif',

              fontSize: {
                xs: '0.68rem',
                sm: '0.72rem',
              },

              fontWeight: 500,

              letterSpacing: '0.02em',
            }}
          >
            Preparing your experience
          </Typography>

          {[0, 1, 2].map((item) => (
            <Box
              key={item}
              sx={{
                width: 4,
                height: 4,

                borderRadius: '50%',

                backgroundColor: MAGENTA,

                boxShadow:
                  '0 0 7px rgba(233,35,218,.55)',

                animation: `${dotBounce} 1.35s ease-in-out infinite`,

                animationDelay: `${item * 0.16}s`,
              }}
            />
          ))}
        </Box>

        {/* ==================================================================
            PREMIUM PROGRESS BAR
            ================================================================== */}

        <Box
          sx={{
            position: 'relative',

            width: {
              xs: '76%',
              sm: 270,
              md: 290,
            },

            height: {
              xs: 3,
              sm: 3,
            },

            mt: 2.1,

            borderRadius: 99,

            backgroundColor: 'rgba(255,255,255,.09)',

            overflow: 'hidden',

            animation: `${fadeUp} .7s .48s cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          {/* Base progress */}
          <Box
            sx={{
              position: 'absolute',

              top: 0,
              bottom: 0,
              left: 0,

              width: '100%',

              background:
                `linear-gradient(
                  90deg,
                  transparent 0%,
                  rgba(233,35,218,.35) 22%,
                  ${MAGENTA} 50%,
                  rgba(233,35,218,.35) 78%,
                  transparent 100%
                )`,

              animation:
                `${progressSweep} 1.8s cubic-bezier(.65,0,.35,1) infinite`,
            }}
          />
        </Box>

        {/* ==================================================================
            BOTTOM BRAND STATEMENT
            ================================================================== */}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            gap: {
              xs: 1,
              sm: 1.3,
            },

            mt: {
              xs: 3,
              sm: 3.5,
            },

            animation: `${fadeUp} .7s .56s cubic-bezier(.16,1,.3,1) both`,
          }}
        >
          <Box
            sx={{
              width: {
                xs: 18,
                sm: 28,
              },

              height: '1px',

              background:
                'linear-gradient(90deg, transparent, rgba(233,35,218,.65))',
            }}
          />

          <Typography
            sx={{
              color: 'rgba(255,255,255,.30)',

              fontFamily:
                '"Inter", "Montserrat", "Segoe UI", sans-serif',

              fontSize: {
                xs: '0.52rem',
                sm: '0.58rem',
              },

              fontWeight: 700,

              letterSpacing: {
                xs: '0.14em',
                sm: '0.20em',
              },

              textTransform: 'uppercase',

              whiteSpace: 'nowrap',
            }}
          >
            Professional Care
          </Typography>

          <Box
            sx={{
              width: {
                xs: 18,
                sm: 28,
              },

              height: '1px',

              background:
                'linear-gradient(90deg, rgba(233,35,218,.65), transparent)',
            }}
          />
        </Box>
      </Box>

      {/* ====================================================================
          BOTTOM CENTER INDICATOR
          ==================================================================== */}

      <Box
        sx={{
          position: 'absolute',

          bottom: {
            xs: 20,
            sm: 28,
            md: 34,
          },

          left: '50%',

          transform: 'translateX(-50%)',

          width: {
            xs: 46,
            sm: 60,
          },

          height: 2,

          borderRadius: 99,

          background:
            'linear-gradient(90deg, transparent, rgba(233,35,218,.75), transparent)',

          opacity: 0.7,
        }}
      />
    </Box>
  );
};

export default Loading;