
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton
} from '@mui/material';
import { LinkedIn, Twitter, Facebook } from '@mui/icons-material';
import { COLORS, TEAM_MEMBERS } from '../../utils/constants';

const Team = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
            Meet Our Team
          </Typography>
          <Typography variant="h6" component="p" sx={{ maxWidth: 700, mx: 'auto', color: 'text.secondary' }}>
            Our team of dedicated professionals is committed to delivering exceptional cleaning services.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {TEAM_MEMBERS.map((member) => (
            <Grid key={member.id}>
              <Card sx={{ textAlign: 'center', height: '100%' }}>
                <CardContent>
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mb: 2,
                      border: `4px solid ${COLORS.primary}`
                    }}
                  />
                  <Typography variant="h5" component="h3" gutterBottom sx={{ color: COLORS.primary }}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                    {member.position}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {member.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                    <IconButton size="small" sx={{ color: COLORS.primary }}>
                      <LinkedIn />
                    </IconButton>
                    <IconButton size="small" sx={{ color: COLORS.primary }}>
                      <Twitter />
                    </IconButton>
                    <IconButton size="small" sx={{ color: COLORS.primary }}>
                      <Facebook />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Team;