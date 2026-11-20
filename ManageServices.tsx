import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid, // Use Grid instead of Grid2
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Chip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Home,
  Business,
  Window,
  DryCleaning,
  CleaningServices,
  Construction
} from '@mui/icons-material';
import { COLORS, SERVICES, type Service, type ServiceIcon } from '../../utils/constants';

const ManageServices = () => {
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'home' as ServiceIcon,
    features: ['', '', '', '']
  });

  // Use React.ReactNode instead of JSX.Element
  const iconMap: Record<ServiceIcon, React.ReactNode> = {
    home: <Home />,
    business: <Business />,
    window: <Window />,
    carpet: <DryCleaning />,
    cleaning_services: <CleaningServices />,
    construction: <Construction />
  };

  const handleOpenDialog = (service: Service | null = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        icon: service.icon,
        features: [...service.features]
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        icon: 'home',
        features: ['', '', '', '']
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleSubmit = () => {
    if (editingService) {
      // Update existing service
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData, icon: formData.icon as ServiceIcon }
          : service
      ));
    } else {
      // Add new service
      const newService: Service = {
        id: services.length + 1,
        title: formData.title,
        description: formData.description,
        icon: formData.icon as ServiceIcon,
        features: formData.features.filter(feature => feature.trim() !== '')
      };
      setServices([...services, newService]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ color: COLORS.primary }}>
          Manage Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: COLORS.primary,
            '&:hover': {
              backgroundColor: COLORS.secondary
            }
          }}
        >
          Add New Service
        </Button>
      </Box>

      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid key={service.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: COLORS.primary,
                      width: 56,
                      height: 56
                    }}
                  >
                    {iconMap[service.icon]}
                  </Avatar>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(service)}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(service.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ color: COLORS.primary }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {service.description}
                </Typography>
                <Box>
                  {service.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingService ? 'Edit Service' : 'Add New Service'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Service Title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Service Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="icon"
            label="Icon"
            fullWidth
            variant="outlined"
            value={formData.icon}
            onChange={handleChange}
            sx={{ mb: 2 }}
            helperText="Options: home, business, window, carpet, cleaning_services, construction"
          />
          <Typography variant="subtitle1" gutterBottom>
            Features
          </Typography>
          {formData.features.map((feature, index) => (
            <TextField
              key={index}
              margin="dense"
              label={`Feature ${index + 1}`}
              fullWidth
              variant="outlined"
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              sx={{ mb: 1 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingService ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageServices;