import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Define a type for our posts for better type safety
interface Post {
  id: number;
  title: string;
  image: string;
  date: string;
}

const ContentPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // State for posts and for the snackbar feedback
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, title: 'Spring Cleaning Special', image: 'https://via.placeholder.com/300', date: '2023-10-01' },
    { id: 2, title: 'Why Eco-Friendly Products Matter', image: 'https://via.placeholder.com/300', date: '2023-09-25' },
  ]);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  // --- Handler Functions ---

  const handleAddPost = () => {
    const title = prompt('Enter the title for the new post:');
    if (title) {
      const newPost: Post = {
        id: Date.now(), // Simple unique ID
        title,
        image: `https://picsum.photos/seed/${Date.now()}/300/200.jpg`, // Random image
        date: new Date().toISOString().split('T')[0],
      };
      setPosts([...posts, newPost]);
      setSnackbar({ open: true, message: `"${title}" added successfully!` });
    }
  };

  const handleEditPost = (id: number) => {
    const postToEdit = posts.find((p) => p.id === id);
    if (postToEdit) {
      const newTitle = prompt('Edit the post title:', postToEdit.title);
      if (newTitle && newTitle !== postToEdit.title) {
        setPosts(posts.map((p) => (p.id === id ? { ...p, title: newTitle } : p)));
        setSnackbar({ open: true, message: 'Post updated successfully!' });
      }
    }
  };

  const handleDeletePost = (id: number) => {
    const postToDelete = posts.find((p) => p.id === id);
    if (postToDelete && window.confirm(`Are you sure you want to delete "${postToDelete.title}"?`)) {
      setPosts(posts.filter((p) => p.id !== id));
      setSnackbar({ open: true, message: 'Post deleted.' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: isDark ? '#fff' : '#333' }}>
        Website Content Management
      </Typography>

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No posts yet. Create your first post!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid key={post.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  bgcolor: isDark ? '#1E1E1E' : '#fff',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardMedia component="img" height="140" image={post.image} alt={post.title} />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: isDark ? '#fff' : '#333' }}>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {post.date}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<Edit />} onClick={() => handleEditPost(post.id)}>
                    Edit
                  </Button>
                  <Button size="small" startIcon={<Delete />} color="error" onClick={() => handleDeletePost(post.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddPost}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          bgcolor: '#E91E63',
          '&:hover': { bgcolor: '#C2185B' },
        }}
      >
        <Add />
      </Fab>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContentPage;