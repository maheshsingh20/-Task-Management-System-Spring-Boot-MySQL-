// Global variables
let currentUser = null;
let authToken = null;
let tasks = [];
let currentEditingTask = null;

// API Base URL
const API_BASE = '/api';

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const userWelcome = document.getElementById('user-welcome');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');
const statusFilter = document.getElementById('status-filter');
const priorityFilter = document.getElementById('priority-filter');
const loading = document.getElementById('loading');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // Check for existing token
    authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (authToken && userData) {
        currentUser = JSON.parse(userData);
        showApp();
    } else {
        showAuth();
    }
}

function setupEventListeners() {
    // Auth forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Task management
    addTaskBtn.addEventListener('click', openTaskModal);
    taskForm.addEventListener('submit', handleTaskSubmit);
    
    // Filters
    statusFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);
    
    // Modal
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === taskModal) {
            closeModal();
        }
    });
}

// Authentication functions
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

async function handleLogin(event) {
    event.preventDefault();
    showLoading(true);
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.accessToken;
            currentUser = {
                id: data.id,
                username: data.username,
                email: data.email
            };
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('userData', JSON.stringify(currentUser));
            
            showToast('Login successful!', 'success');
            showApp();
        } else {
            showToast(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
    
    showLoading(false);
}

async function handleRegister(event) {
    event.preventDefault();
    showLoading(true);
    
    const formData = {
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        firstName: document.getElementById('register-firstName').value,
        lastName: document.getElementById('register-lastName').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Registration successful! Please login.', 'success');
            showTab('login');
            registerForm.reset();
        } else {
            showToast(data.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Network error. Please try again.', 'error');
    }
    
    showLoading(false);
}

function handleLogout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    showAuth();
    showToast('Logged out successfully', 'info');
}

function showAuth() {
    authSection.style.display = 'block';
    appSection.style.display = 'none';
}

function showApp() {
    authSection.style.display = 'none';
    appSection.style.display = 'block';
    userWelcome.textContent = `Welcome, ${currentUser.username}!`;
    loadTasks();
}

// Task management functions
async function loadTasks() {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/tasks`, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (response.ok) {
            tasks = await response.json();
            displayTasks();
            updateStats();
        } else {
            showToast('Failed to load tasks', 'error');
        }
    } catch (error) {
        showToast('Network error while loading tasks', 'error');
    }
    
    showLoading(false);
}

function displayTasks() {
    const filteredTasks = getFilteredTasks();
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-tasks" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                <p>No tasks found. Create your first task!</p>
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority.toLowerCase()}`;
    
    const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'DONE';
    
    card.innerHTML = `
        <div class="task-header">
            <div>
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span class="task-status ${task.status.toLowerCase().replace('_', '-')}">${formatStatus(task.status)}</span>
                    <span class="task-priority ${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
            </div>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        ${task.deadline ? `<div class="task-deadline ${isOverdue ? 'overdue' : ''}">
            <i class="fas fa-calendar-alt"></i>
            Due: ${formatDateTime(task.deadline)}
            ${isOverdue ? '<i class="fas fa-exclamation-triangle" style="margin-left: 10px; color: #dc3545;"></i>' : ''}
        </div>` : ''}
        <div class="task-actions">
            <button class="btn btn-sm btn-primary" onclick="editTask(${task.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn btn-sm ${task.status === 'DONE' ? 'btn-warning' : 'btn-success'}" 
                onclick="toggleTaskStatus(${task.id})">
                <i class="fas ${task.status === 'DONE' ? 'fa-undo' : 'fa-check'}"></i>
                ${task.status === 'DONE' ? 'Reopen' : 'Complete'}
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    
    return card;
}

function getFilteredTasks() {
    let filtered = [...tasks];
    
    const statusValue = statusFilter.value;
    const priorityValue = priorityFilter.value;
    
    if (statusValue) {
        filtered = filtered.filter(task => task.status === statusValue);
    }
    
    if (priorityValue) {
        filtered = filtered.filter(task => task.priority === priorityValue);
    }
    
    return filtered;
}

function updateStats() {
    const todoCount = tasks.filter(t => t.status === 'TODO').length;
    const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const doneCount = tasks.filter(t => t.status === 'DONE').length;
    const overdueCount = tasks.filter(t => 
        t.deadline && new Date(t.deadline) < new Date() && t.status !== 'DONE'
    ).length;
    
    document.getElementById('todo-count').textContent = todoCount;
    document.getElementById('in-progress-count').textContent = inProgressCount;
    document.getElementById('done-count').textContent = doneCount;
    document.getElementById('overdue-count').textContent = overdueCount;
}

function openTaskModal(task = null) {
    currentEditingTask = task;
    const modalTitle = document.getElementById('modal-title');
    
    if (task) {
        modalTitle.textContent = 'Edit Task';
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        document.getElementById('task-status').value = task.status;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-deadline').value = task.deadline ? 
            new Date(task.deadline).toISOString().slice(0, 16) : '';
    } else {
        modalTitle.textContent = 'Add New Task';
        taskForm.reset();
        document.getElementById('task-status').value = 'TODO';
        document.getElementById('task-priority').value = 'MEDIUM';
    }
    
    taskModal.style.display = 'block';
}

function closeModal() {
    taskModal.style.display = 'none';
    currentEditingTask = null;
    taskForm.reset();
}

async function handleTaskSubmit(event) {
    event.preventDefault();
    showLoading(true);
    
    const taskData = {
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-description').value,
        status: document.getElementById('task-status').value,
        priority: document.getElementById('task-priority').value,
        deadline: document.getElementById('task-deadline').value || null
    };
    
    if (taskData.deadline) {
        taskData.deadline = new Date(taskData.deadline).toISOString();
    }
    
    try {
        const url = currentEditingTask ? 
            `${API_BASE}/tasks/${currentEditingTask.id}` : 
            `${API_BASE}/tasks`;
        const method = currentEditingTask ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(taskData),
        });
        
        if (response.ok) {
            showToast(currentEditingTask ? 'Task updated successfully!' : 'Task created successfully!', 'success');
            closeModal();
            loadTasks();
        } else {
            const error = await response.json();
            showToast(error.message || 'Failed to save task', 'error');
        }
    } catch (error) {
        showToast('Network error while saving task', 'error');
    }
    
    showLoading(false);
}

async function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        openTaskModal(task);
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (response.ok) {
            showToast('Task deleted successfully!', 'success');
            loadTasks();
        } else {
            showToast('Failed to delete task', 'error');
        }
    } catch (error) {
        showToast('Network error while deleting task', 'error');
    }
    
    showLoading(false);
}

async function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/tasks/${taskId}/status?status=${newStatus}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });
        
        if (response.ok) {
            showToast(`Task marked as ${newStatus === 'DONE' ? 'completed' : 'incomplete'}!`, 'success');
            loadTasks();
        } else {
            showToast('Failed to update task status', 'error');
        }
    } catch (error) {
        showToast('Network error while updating task', 'error');
    }
    
    showLoading(false);
}

function applyFilters() {
    displayTasks();
}

// Utility functions
function formatStatus(status) {
    switch (status) {
        case 'TODO': return 'To Do';
        case 'IN_PROGRESS': return 'In Progress';
        case 'DONE': return 'Done';
        default: return status;
    }
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
    
    // Remove on click
    toast.addEventListener('click', () => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    });
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fas fa-check-circle';
        case 'error': return 'fas fa-exclamation-circle';
        case 'warning': return 'fas fa-exclamation-triangle';
        case 'info': return 'fas fa-info-circle';
        default: return 'fas fa-info-circle';
    }
}