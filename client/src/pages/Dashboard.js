import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as TaskIcon,
  Folder as ProjectIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    recentProjects: [],
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [projectsRes, tasksRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5 }
        })
      ]);

      const projects = projectsRes.data;
      const tasks = tasksRes.data;

      setStats({
        totalProjects: projects.length,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(task => task.status === 'completed').length,
        recentProjects: projects.slice(0, 5),
        recentTasks: tasks
      });
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Welcome back, {user?.name}!
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/projects')}
        >
          New Project
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ProjectIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalProjects}</Typography>
                  <Typography color="textSecondary">Total Projects</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TaskIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.totalTasks}</Typography>
                  <Typography color="textSecondary">Total Tasks</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CompletedIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                <Box>
                  <Typography variant="h4">{stats.completedTasks}</Typography>
                  <Typography color="textSecondary">Completed Tasks</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Projects
              </Typography>
              {stats.recentProjects.length > 0 ? (
                <Stack spacing={2}>
                  {stats.recentProjects.map((project) => (
                    <Box
                      key={project._id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      <Typography variant="subtitle1">{project.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {project.description || 'No description'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="textSecondary">No projects yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Tasks
              </Typography>
              {stats.recentTasks.length > 0 ? (
                <Stack spacing={2}>
                  {stats.recentTasks.map((task) => (
                    <Box
                      key={task._id}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="subtitle1">{task.title}</Typography>
                      <Box display="flex" alignItems="center" mt={1}>
                        <Chip
                          size="small"
                          label={task.status}
                          color={getStatusColor(task.status)}
                          sx={{ mr: 1 }}
                        />
                        {task.dueDate && (
                          <Typography variant="body2" color="textSecondary">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography color="textSecondary">No tasks yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 