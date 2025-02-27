// get elements 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskContainer = document.querySelector('.tasks');
const taskList = document.querySelector('.taskList');
const newTaskModal = document.querySelector('.newTask');
const editTaskModal = document.querySelector('.editTask');
const noTasks = document.querySelector('.noTasks');
const noResults = document.querySelector('.noResults');
const newTaskInput = document.querySelector('#newTaskInput');
const newTaskStatus = document.querySelector('#newTaskStatus');
const newTaskDate = document.querySelector('#newTaskDate');
const newTaskForm = document.querySelector('#newTaskForm');
const searchInput = document.querySelector('#searchInput');
const editTaskForm = document.querySelector('#editTaskForm');
const editTaskInput = document.querySelector('#editTaskInput');

// load tasks
const loadTasks = () => {
    tasks.length === 0 ? searchInput.disabled = true : searchInput.disabled = false;
    if (tasks.length > 0) {
        noTasks.style.display = 'none'

        taskList.innerHTML = ''
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.innerHTML = `
                <div class="task">
                    <p>${task.description}</p>
                    <div class="status">
                        <select name="status">
                            <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                    </div>
                    <div class="priority">
                        <select id="priority" onchange="updatePriority(${task.id})">
                            <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                            <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                        </select>
                    </div>
                    <span id="dueDate">${task.dueDate}</span>
                    <div class="btns">
                        <button onclick="openUpdateModal(${task.id})" class="edit" title="Edit task">
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </button>
                        <button onclick="deleteTask(${task.id})" class="delete" title="Delete task">
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>
                    </div>
                </div>
                `
            taskList.appendChild(taskDiv);
        });

    } else {
        noTasks.style.display = 'flex'
        taskContainer.style.display = 'none'
    };
};

// opening and closing modals
const openNewTaskModal = () => {
    newTaskModal.style.display = 'flex';
}
const openUpdateModal = (id) => {
    editTaskModal.style.display = 'flex';
    let task = tasks.find(t => t.id === parseInt(id));
    editTaskInput.value = task.description;
    editTaskForm.dataset.id = task.id;
}
const closeNewTaskModal = () => {
    newTaskModal.style.display = 'none';
}
const closeUpdateModal = () => {
    editTaskModal.style.display = 'none'
}

// adding task
const addTask = (e) => {
    e.preventDefault();
    const data = {
        id: tasks.length + 1,
        description: newTaskInput.value,
        status: newTaskStatus.value,
        dueDate: newTaskDate.value
    };
    tasks.unshift(data);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    alert('New task added!');
    closeNewTaskModal();
    newTaskForm.reset();
    taskContainer.style.display = 'block';
    loadTasks();
};

// updating task
const updateTask = (e, id) => {
    e.preventDefault();
    id = e.target.dataset.id;
    let task = tasks.find(t => t.id === parseInt(id));
    task.description = editTaskInput.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    closeUpdateModal();
    alert("Task updated.");
    loadTasks();
};

// deleting task
const deleteTask = (id) => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        alert("Task deleted.");
        loadTasks();
    }
};

// searching by keyword
const searchTask = (e) => {
    if (e.target.value !== '') {
        const searchTerm = e.target.value.toLowerCase().trim();
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.description.toLowerCase().includes(searchTerm));
        if (tasks.length === 0) {
            noTasks.style.display = 'none';
            taskContainer.style.display = 'none';
            noResults.style.display = 'flex';
        } else {
            noResults.style.display = 'none';
            taskContainer.style.display = 'block';
            loadTasks();
        }
    } else {
        noResults.style.display = 'none';
        taskContainer.style.display = 'block';
        tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        loadTasks();
    }
}


// filters
const filterAll = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    noResults.style.display = 'none';
    taskContainer.style.display = 'block';
    loadTasks();
};
const filterPending = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    noResults.style.display = 'none';
    taskContainer.style.display = 'block';
    tasks = tasks.filter(task => task.status === 'pending');
    loadTasks();
};
const filterCompleted = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    noResults.style.display = 'none';
    taskContainer.style.display = 'block';
    tasks = tasks.filter(task => task.status === 'completed');
    loadTasks();
};



document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    newTaskForm.addEventListener('submit', addTask);
    editTaskForm.addEventListener('submit', updateTask);

    tasks.length === 0 ? searchInput.disabled = true : searchInput.disabled = false;
    searchInput.addEventListener('input', searchTask)
});