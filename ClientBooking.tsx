// src/components/admin/clients/ClientBooking.tsx
import { Box, Typography, Button, TextField, Grid, Paper, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ClientBooking = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box maxWidth="md" sx={{ p: { xs: 2, sm: 3 } }}>
      <Paper 
        sx={{ 
          p: { xs: 3, sm: 4 }, 
          bgcolor: isDark ? '#1E1E1E' : '#fff', 
          borderRadius: 2,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: isDark ? '#fff' : '#333' }}>
          Book a Cleaning Service
        </Typography>
        
        <Grid container spacing={3}>
          {/* Service Address */}
          <Grid >
            <TextField 
              fullWidth 
              label="Service Address" 
              variant="outlined" 
              placeholder="Enter the address where service is needed"
              InputProps={{ 
                sx: { 
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderRadius: 1
                } 
              }} 
            />
          </Grid>
          
          {/* Date */}
          <Grid >
            <TextField 
              fullWidth 
              type="date" 
              label="Preferred Date" 
              InputLabelProps={{ shrink: true }} 
              variant="outlined" 
              InputProps={{ 
                sx: { 
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderRadius: 1
                } 
              }} 
            />
          </Grid>
          
          {/* Time */}
          <Grid>
            <TextField 
              fullWidth 
              type="time" 
              label="Preferred Time" 
              InputLabelProps={{ shrink: true }} 
              variant="outlined" 
              InputProps={{ 
                sx: { 
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderRadius: 1
                } 
              }} 
            />
          </Grid>

          {/* Service Type */}
          <Grid >
            <Typography variant="h6" sx={{ mt: 2, mb: 1, color: isDark ? '#fff' : '#333' }}>
              Service Type
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup name="service-type" aria-label="service-type">
                <FormControlLabel 
                  value="home" 
                  control={<Radio color="primary" />} 
                  label={
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 500, color: isDark ? '#fff' : '#333' }}>
                        Home Cleaning
                      </Typography>
                      <Typography component="span" sx={{ ml: 1, color: isDark ? '#aaa' : '#666' }}>
                        ($150)
                      </Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="office" 
                  control={<Radio color="primary" />} 
                  label={
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 500, color: isDark ? '#fff' : '#333' }}>
                        Office Cleaning
                      </Typography>
                      <Typography component="span" sx={{ ml: 1, color: isDark ? '#aaa' : '#666' }}>
                        ($250)
                      </Typography>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="deep" 
                  control={<Radio color="primary" />} 
                  label={
                    <Box>
                      <Typography component="span" sx={{ fontWeight: 500, color: isDark ? '#fff' : '#333' }}>
                        Deep Clean
                      </Typography>
                      <Typography component="span" sx={{ ml: 1, color: isDark ? '#aaa' : '#666' }}>
                        ($300)
                      </Typography>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Additional Notes */}
          <Grid>
            <TextField 
              fullWidth 
              label="Additional Notes (Optional)" 
              multiline 
              rows={3} 
              variant="outlined" 
              placeholder="Any special instructions or requests..."
              InputProps={{ 
                sx: { 
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
                  borderRadius: 1
                } 
              }} 
            />
          </Grid>

          {/* Submit Button */}
          <Grid>
            <Button 
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ 
                py: 1.5, 
                bgcolor: '#E91E63', 
                '&:hover': { bgcolor: '#C2185B' },
                fontWeight: 600,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1rem'
              }}
            >
              Confirm Booking
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ClientBooking;