import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const STATUS_OPTIONS = ['Todo', 'In Progress', 'Completed'];

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
    dueDate: '',
  });

  const fetchProjectAndTasks = async () => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/projects/${projectId}/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const projectData = await projectResponse.json();
      const tasksData = await tasksResponse.json();

      setProject(projectData);
      setTasks(tasksData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId, token]);

  const handleTaskDialogOpen = (task = null) => {
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.split('T')[0],
      });
    } else {
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Todo',
        dueDate: '',
      });
    }
    setTaskDialogOpen(true);
  };

  const handleTaskDialogClose = () => {
    setTaskDialogOpen(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTask
        ? `http://localhost:5000/api/projects/${projectId}/tasks/${editingTask._id}`
        : `http://localhost:5000/api/projects/${projectId}/tasks`;

      const response = await fetch(url, {
        method: editingTask ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskForm),
      });

      if (response.ok) {
        fetchProjectAndTasks();
        handleTaskDialogClose();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/projects/${projectId}/tasks/${taskId}`,
          {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
          }
        );

        if (response.ok) {
          fetchProjectAndTasks();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            {project.name}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {project.description}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleTaskDialogOpen()}
        >
          New Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        {tasks.map((task) => (
          <Grid item xs={12} md={6} lg={4} key={task._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {task.title}
                </Typography>
                <Typography color="textSecondary" paragraph>
                  {task.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Priority: {task.priority}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Status: {task.status}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleTaskDialogOpen(task)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTask(task._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={taskDialogOpen} onClose={handleTaskDialogClose}>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'New Task'}
        </DialogTitle>
        <form onSubmit={handleTaskSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Task Title"
              type="text"
              fullWidth
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
            />
            <TextField
              select
              margin="dense"
              label="Priority"
              fullWidth
              value={taskForm.priority}
              onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              margin="dense"
              label="Status"
              fullWidth
              value={taskForm.status}
              onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Due Date"
              type="date"
              fullWidth
              required
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleTaskDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingTask ? 'Save' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ProjectDetails; 