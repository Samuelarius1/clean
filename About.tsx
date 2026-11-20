import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Avatar,
  Button,
  Stack,
  Chip,
  Divider,
  useTheme
} from '@mui/material';

import {
  Work,
  Groups,
  Verified,
  TrendingUp,
  ArrowForward,
  CleaningServices,
  Favorite,
  Lightbulb,
  WorkspacePremium,
  AutoAwesome,
  Shield,
  Star
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../utils/constants';

const milestones = [
  {
    year: '2013',
    title: 'The Beginning',
    description:
      'Faiths CleanPro was established with a vision of delivering reliable, professional and exceptional cleaning services.'
  },
  {
    year: '2015',
    title: 'Business Expansion',
    description:
      'We expanded our operations to serve commercial clients and provide more comprehensive cleaning solutions.'
  },
  {
    year: '2018',
    title: 'A Greener Approach',
    description:
      'We embraced environmentally conscious cleaning products and practices to promote healthier spaces.'
  },
  {
    year: '2020',
    title: 'Growing Recognition',
    description:
      'Our commitment to quality and customer satisfaction continued to strengthen our reputation.'
  },
  {
    year: '2023',
    title: 'A Decade of Excellence',
    description:
      'We celebrated ten years of serving homes, businesses and communities with dedication.'
  }
];

const stats = [
  { icon: <Work />, value: 500, suffix: '+', label: 'Projects Completed' },
  { icon: <Groups />, value: 50, suffix: '+', label: 'Professional Staff' },
  { icon: <Verified />, value: 100, suffix: '%', label: 'Customer Commitment' },
  { icon: <TrendingUp />, value: 10, suffix: '+', label: 'Years Experience' }
];

const values = [
  {
    icon: <Star />,
    title: 'Excellence',
    description: 'We maintain high standards in every cleaning service we provide.'
  },
  {
    icon: <Shield />,
    title: 'Reliability',
    description: 'Our clients can count on us for dependable and consistent service.'
  },
  {
    icon: <Favorite />,
    title: 'Customer Care',
    description: 'We put our customers first and value every relationship we build.'
  },
  {
    icon: <AutoAwesome />,
    title: 'Innovation',
    description: 'We continuously improve our methods to deliver better results.'
  }
];

const AboutPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [counts, setCounts] = useState([0, 0, 0, 0]);

  // Reset the page's animated counters on every fresh load.
  useEffect(() => {
    setCounts([0, 0, 0, 0]);

    const duration = 1600;
    const start = Date.now();

    const timer = window.setInterval(() => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts(stats.map(stat => Math.floor(stat.value * eased)));

      if (progress >= 1) {
        window.clearInterval(timer);
      }
    }, 30);

    return () => window.clearInterval(timer);
  }, []);

  const primary = COLORS.primary;

  const sectionTitle = {
    fontWeight: 800,
    letterSpacing: '-1px',
    color: theme.palette.text.primary
  };

  const cardStyle = {
    height: '100%',
    p: 3,
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-7px)',
      boxShadow: theme.shadows[8],
      borderColor: primary
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        pb: 10
      }}
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 9, md: 13 },
          background: `linear-gradient(135deg, ${primary} 0%, #73103E 100%)`,
          color: '#fff'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 350,
            height: 350,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            top: -130,
            right: -80
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Stack spacing={3} maxWidth={750}>
            <Chip
              icon={<CleaningServices sx={{ color: '#fff !important' }} />}
              label="WHO WE ARE"
              sx={{
                width: 'fit-content',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.4)',
                backgroundColor: 'rgba(255,255,255,0.12)',
                fontWeight: 700
              }}
              variant="outlined"
            />

            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                letterSpacing: '-2px',
                fontSize: { xs: '2.5rem', md: '4rem' },
                lineHeight: 1.1
              }}
            >
              Creating Cleaner Spaces.
              <br />
              Building Better Experiences.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.9,
                color: 'rgba(255,255,255,0.85)',
                maxWidth: 650
              }}
            >
              Discover the people, passion and commitment behind
              Faiths CleanPro. We are dedicated to making every space
              cleaner, healthier and more welcoming.
            </Typography>

            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/contact')}
                sx={{
                  backgroundColor: '#fff',
                  color: primary,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 800,
                  '&:hover': {
                    backgroundColor: '#f3f3f3'
                  }
                }}
              >
                Get In Touch
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.7)',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Back Home
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ABOUT INTRODUCTION */}
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center" sx={{ py: 10 }}>
          <Grid item xs={12} md={6}>
            <Chip
              label="OUR STORY"
              sx={{
                mb: 2,
                color: primary,
                backgroundColor: `${primary}15`,
                fontWeight: 800
              }}
            />

            <Typography variant="h3" sx={sectionTitle} gutterBottom>
              About Faiths CleanPro
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 2,
                mb: 2
              }}
            >
              Founded in 2013, Faiths CleanPro has grown from a small
              team of passionate cleaners into a trusted cleaning
              company serving homes and businesses.
            </Typography>

            <Typography
              sx={{
                color: theme.palette.text.secondary,
                lineHeight: 2,
                mb: 3
              }}
            >
              Our mission is simple: to deliver exceptional cleaning
              services that exceed expectations. We believe that a
              clean environment creates a healthier, happier and
              more productive experience.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate('/contact')}
              sx={{
                backgroundColor: primary,
                borderRadius: 2,
                px: 3,
                py: 1.4,
                fontWeight: 700
              }}
            >
              Work With Us
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 5,
                background: `linear-gradient(145deg, ${primary}12, ${primary}03)`,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  mb: 3,
                  bgcolor: primary
                }}
              >
                <CleaningServices sx={{ fontSize: 36 }} />
              </Avatar>

              <Typography variant="h4" sx={{ ...sectionTitle, mb: 2 }}>
                A Commitment to Quality
              </Typography>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 2
                }}
              >
                Every project represents an opportunity to demonstrate
                our professionalism, attention to detail and dedication
                to customer satisfaction.
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={2} alignItems="center">
                <Verified sx={{ color: primary, fontSize: 30 }} />
                <Box>
                  <Typography fontWeight={800}>
                    Quality First
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Professional service. Dependable results.
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* MISSION AND VISION */}
        <Box sx={{ pb: 10 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={cardStyle}>
                <Avatar sx={{ bgcolor: `${primary}18`, color: primary, mb: 2 }}>
                  <Lightbulb />
                </Avatar>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Our Mission
                </Typography>
                <Typography color="text.secondary" lineHeight={1.9}>
                  To provide outstanding cleaning services through
                  professionalism, innovation and a commitment to
                  creating clean, safe and healthy environments.
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={cardStyle}>
                <Avatar sx={{ bgcolor: `${primary}18`, color: primary, mb: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                  Our Vision
                </Typography>
                <Typography color="text.secondary" lineHeight={1.9}>
                  To become a trusted leader in the cleaning industry,
                  recognised for exceptional service, reliability
                  and lasting customer relationships.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* ACHIEVEMENTS */}
        <Box sx={{ textAlign: 'center', mb: 11 }}>
          <Chip
            label="OUR IMPACT"
            sx={{
              color: primary,
              backgroundColor: `${primary}15`,
              fontWeight: 800,
              mb: 2
            }}
          />

          <Typography variant="h3" sx={sectionTitle}>
            Our Achievements
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 2, mb: 5 }}>
            The milestones that reflect our dedication and growth.
          </Typography>

          <Grid container spacing={3}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <Card elevation={0} sx={cardStyle}>
                  <Avatar
                    sx={{
                      width: 65,
                      height: 65,
                      mx: 'auto',
                      mb: 2,
                      color: primary,
                      bgcolor: `${primary}15`
                    }}
                  >
                    {stat.icon}
                  </Avatar>

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: primary,
                      mb: 1
                    }}
                  >
                    {counts[index]}{stat.suffix}
                  </Typography>

                  <Typography color="text.secondary" fontWeight={600}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CORE VALUES */}
        <Box sx={{ mb: 11 }}>
          <Box textAlign="center" mb={5}>
            <Chip
              label="WHAT GUIDES US"
              sx={{
                color: primary,
                backgroundColor: `${primary}15`,
                fontWeight: 800,
                mb: 2
              }}
            />

            <Typography variant="h3" sx={sectionTitle}>
              Our Core Values
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
              The principles behind everything we do.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {values.map((value) => (
              <Grid item xs={12} sm={6} md={3} key={value.title}>
                <Card elevation={0} sx={cardStyle}>
                  <Avatar
                    sx={{
                      bgcolor: `${primary}15`,
                      color: primary,
                      mb: 2
                    }}
                  >
                    {value.icon}
                  </Avatar>

                  <Typography variant="h6" fontWeight={800} gutterBottom>
                    {value.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    lineHeight={1.9}
                  >
                    {value.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* COMPANY JOURNEY */}
        <Box sx={{ mb: 10 }}>
          <Box textAlign="center" mb={6}>
            <Chip
              label="OUR HISTORY"
              sx={{
                color: primary,
                backgroundColor: `${primary}15`,
                fontWeight: 800,
                mb: 2
              }}
            />

            <Typography variant="h3" sx={sectionTitle}>
              Our Journey
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
              A look at the milestones that shaped Faiths CleanPro.
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 850, mx: 'auto', position: 'relative' }}>
            {milestones.map((milestone, index) => (
              <Box
                key={milestone.year}
                sx={{
                  display: 'flex',
                  gap: 3,
                  mb: 4,
                  position: 'relative'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: primary,
                      fontWeight: 800,
                      fontSize: 13,
                      zIndex: 1
                    }}
                  >
                    {index + 1}
                  </Avatar>

                  {index !== milestones.length - 1 && (
                    <Box
                      sx={{
                        width: 2,
                        flex: 1,
                        minHeight: 100,
                        bgcolor: theme.palette.divider
                      }}
                    />
                  )}
                </Box>

                <Card
                  elevation={0}
                  sx={{
                    flex: 1,
                    mb: 2,
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: primary,
                      transform: 'translateX(5px)'
                    }
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ color: primary, fontWeight: 900 }}
                  >
                    {milestone.year}
                  </Typography>

                  <Typography variant="h6" fontWeight={800} gutterBottom>
                    {milestone.title}
                  </Typography>

                  <Typography color="text.secondary" lineHeight={1.8}>
                    {milestone.description}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* FINAL CALL TO ACTION */}
        <Card
          elevation={0}
          sx={{
            p: { xs: 4, md: 7 },
            borderRadius: 5,
            textAlign: 'center',
            color: '#fff',
            background: `linear-gradient(135deg, ${primary}, #73103E)`
          }}
        >
          <WorkspacePremium sx={{ fontSize: 45, mb: 2 }} />

          <Typography
            variant="h3"
            fontWeight={900}
            gutterBottom
            sx={{ fontSize: { xs: '1.9rem', md: '2.7rem' } }}
          >
            Let's Create a Cleaner Environment
          </Typography>

          <Typography
            sx={{
              maxWidth: 650,
              mx: 'auto',
              mb: 4,
              lineHeight: 1.9,
              color: 'rgba(255,255,255,0.85)'
            }}
          >
            Whether you need cleaning for your home or business,
            Faiths CleanPro is ready to help you experience the difference.
          </Typography>

          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/contact')}
            sx={{
              backgroundColor: '#fff',
              color: primary,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 800,
              '&:hover': {
                backgroundColor: '#f2f2f2'
              }
            }}
          >
            Contact Us Today
          </Button>
        </Card>
      </Container>
    </Box>
  );
};

export default AboutPage;
