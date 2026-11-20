import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

export interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
  address: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  smsAlerts: boolean;
}

export const useSettings = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Profile State
  const [profile, setProfile] = useState<UserSettings>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@faithscleanpro.com',
    phone: '+1 (555) 123-4567',
    avatar: null,
    address: '123 Cleaning Lane',
    city: 'Springfield',
    zipCode: '12345',
    country: 'United States'
  });

  // Notification State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    pushNotifications: true,
    marketingEmails: false,
    smsAlerts: false,
  });

  // Show Feedback
  const showMessage = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
  };

  // Handle Profile Save
  const saveProfile = async (data: Partial<UserSettings>) => {
    setLoading(true);
    try {
      // Simulate API Call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => ({ ...prev, ...data }));
      showMessage('Profile updated successfully!', 'success');
    } catch (error) {
      showMessage('Failed to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Avatar Upload (Base64)
  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, avatar: reader.result as string }));
      showMessage('Avatar updated!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Handle Notification Save
  const saveNotifications = async (data: NotificationSettings) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setNotifications(data);
      showMessage('Notification preferences saved.', 'success');
    } catch (error) {
      showMessage('Failed to save preferences.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    notifications,
    saveProfile,
    handleAvatarUpload,
    saveNotifications,
    loading,
    snackbar,
    showMessage
  };
};