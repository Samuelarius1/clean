// src/utils/constants.ts

export type ServiceIcon = 'home' | 'business' | 'window' | 'carpet' | 'cleaning_services' | 'construction';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: ServiceIcon;
  features: string[];
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  image: string;
  testimonial: string;
}

export type Colors = {
  primary: string;   // Pink from screenshot
  secondary: string; // Gold/Yellow from screenshot
  accent: string;
  light: string;
  dark: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  background: string; // Main Dark Background
  surface: string;   // Slightly lighter card background
  textMain: string;
  textSec: string;
};

export const COLORS: Colors = {
  primary: '#E91E63',     // Vibrant Pink
  secondary: '#FFC107',   // Amber/Gold
  accent: '#FF9800',
  light: '#F5F5F5',
  dark: '#263238',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // --- UPDATED SOFT DARK COLORS ---
  // Changed from #121212 (Black) to #1e2329 (Charcoal/Slate)
  background: '#1e2329',  
  
  // Changed from #1E1E1E to #262c35 (Lighter Grey for cards to pop against background)
  surface: '#262c35',     
  
  textMain: '#ECEFF1',    // Soft White (Not pure #FFFFFF)
  textSec: '#B0BEC5'      // Muted Blue-Grey
};

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Home Cleaning',
    description: 'Professional home cleaning services to keep your space sparkling clean.',
    icon: 'home',
    features: ['Living Areas', 'Bedrooms', 'Bathrooms', 'Kitchen']
  },
  {
    id: 2,
    title: 'Office Cleaning',
    description: 'Keep your workspace clean and productive with our office cleaning services.',
    icon: 'business',
    features: ['Workstations', 'Meeting Rooms', 'Restrooms', 'Common Areas']
  },
  {
    id: 3,
    title: 'Window Cleaning',
    description: 'Crystal clear windows to brighten up your space.',
    icon: 'window',
    features: ['Interior Windows', 'Exterior Windows', 'Glass Doors', 'Mirrors']
  },
  {
    id: 4,
    title: 'Carpet Cleaning',
    description: 'Deep clean your carpets to remove dirt, stains, and allergens.',
    icon: 'carpet',
    features: ['Steam Cleaning', 'Stain Removal', 'Deodorizing', 'Quick Dry']
  },
  {
    id: 5,
    title: 'Deep Cleaning',
    description: 'Thorough cleaning service for those hard-to-reach areas.',
    icon: 'cleaning_services',
    features: ['Baseboards', 'Ceiling Fans', 'Behind Appliances', 'Cabinets']
  },
  {
    id: 6,
    title: 'Post-Construction',
    description: 'Clean up after construction or renovation projects.',
    icon: 'construction',
    features: ['Dust Removal', 'Debris Cleanup', 'Surface Polishing', 'Final Touches']
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'Founder & CEO',
    image: 'https://picsum.photos/seed/sarah/300/300.jpg',
    description: 'With over 10 years in the cleaning industry, Sarah founded Faiths CleanPro with a vision to provide exceptional cleaning services.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Operations Manager',
    image: 'https://picsum.photos/seed/michael/300/300.jpg',
    description: 'Michael ensures all operations run smoothly and our clients receive the highest quality service.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    position: 'Customer Relations',
    image: 'https://picsum.photos/seed/emily/300/300.jpg',
    description: 'Emily is dedicated to ensuring our clients have the best experience with Faiths CleanPro.'
  },
  {
    id: 4,
    name: 'David Kim',
    position: 'Lead Technician',
    image: 'https://picsum.photos/seed/david/300/300.jpg',
    description: 'David leads our team of cleaning technicians with expertise in the latest cleaning techniques.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Jessica Williams',
    position: 'Homeowner',
    image: 'https://picsum.photos/seed/jessica/100/100.jpg',
    testimonial: 'Faiths CleanPro transformed my home! Their team is professional, thorough, and friendly. I couldn\'t be happier with the service.'
  },
  {
    id: 2,
    name: 'Robert Thompson',
    position: 'Office Manager',
    image: 'https://picsum.photos/seed/robert/100/100.jpg',
    testimonial: 'We\'ve been using Faiths CleanPro for our office for over a year now. They consistently deliver exceptional service and our workspace has never been cleaner.'
  },
  {
    id: 3,
    name: 'Maria Garcia',
    position: 'Restaurant Owner',
    image: 'https://picsum.photos/seed/maria/100/100.jpg',
    testimonial: 'The deep cleaning service was exactly what my restaurant needed. The team was meticulous and paid attention to every detail. Highly recommend!'
  }
];