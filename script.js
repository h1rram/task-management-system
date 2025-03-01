// get elements 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskContainer = document.querySelector('.tasks');
const taskList = document.querySelector('.taskList');
const newTaskModal = document.querySelector('.newTask');
const editTaskModal = document.querySelector('.editTask');
const noTasks = document.querySelector('.noTasks');
const noResults = document.querySelector('.noResults');
const newTaskInput = document.getElementById('newTaskInput');
const newTaskStatus = document.getElementById('newTaskStatus');
const newTaskPriority = document.getElementById('newTaskPriority');
const newTaskDate = document.getElementById('newTaskDate');
const newTaskForm = document.getElementById('newTaskForm');
const searchInput = document.getElementById('searchInput');
const editTaskForm = document.getElementById('editTaskForm');
const editTaskInput = document.getElementById('editTaskInput');

// load tasks
const loadTasks = () => {
    tasks.length === 0 ? searchInput.disabled = true : searchInput.disabled = false;
    if (tasks.length > 0) {
        noTasks.style.display = 'none'

        taskList.innerHTML = ''
        tasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.innerHTML = `
                <div class="task task-element">
                    <p>${task.description}</p>
                    <div class="status">
                        <select id="status" onchange="updateStatus(${task.id})">
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

    // handle empty input error
    if (newTaskInput.value.trim().length === 0) {
        return alert("Task Description is required.");
    }

    // handle empty date error
    else if (newTaskDate.value.trim().length === 0) {
        return alert("Task Due Date is required.");
    }

    // handle description over 200 characters
    else if (editTaskInput.value.trim().length > 200) {
        return alert("Task Description must have at least 1 to 200 characters.");
    }

    const data = {
        id: tasks.length + 1,
        description: newTaskInput.value,
        priority: newTaskPriority.value,
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
    strikethroughComplete();
};

// updating task
const updateTask = (e, id) => {
    e.preventDefault();
    id = e.target.dataset.id;
    let task = tasks.find(t => t.id === parseInt(id));

    // handle empty input error
    if (editTaskInput.value.trim().length === 0) {
        return alert("Task Description is required.");
    }

    // handle description over 200 characters
    else if (editTaskInput.value.trim().length > 200) {
        return alert("Task Description must have at least 1 to 200 characters.");
    }

    task.description = editTaskInput.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    closeUpdateModal();
    alert("Task updated.");
    loadTasks();
    strikethroughComplete();
};

// updating status
const updateStatus = (id) => {
    const statusInput = document.getElementById("status");
    const task = tasks.find(t => t.id === parseInt(id));
    task.status = statusInput.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
    strikethroughComplete();
};

// updating priority
const updatePriority = (id) => {
    const priorityInput = document.getElementById("priority");
    const task = tasks.find(t => t.id === parseInt(id));
    task.priority = priorityInput.value;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
    strikethroughComplete();
};

// deleting task
const deleteTask = (id) => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        alert("Task deleted.");
        loadTasks();
        strikethroughComplete();
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

// strikethrough completed tasks
const strikethroughComplete = () => {
    document.querySelectorAll('.task-element').forEach(task => {
        const status = task.querySelector('#status').value;
        const description = task.querySelector('p');

        if (status === 'completed') {
            description.style.textDecoration = 'line-through';
            description.style.opacity = '0.6';
        }
    });
};

// filters
const filterAll = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    noResults.style.display = 'none';
    taskContainer.style.display = 'block';
    loadTasks();
    strikethroughComplete();
};

const filterPending = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    noResults.style.display = 'none';
    taskContainer.style.display = 'block';
    tasks = tasks.filter(task => task.status === 'pending');
    loadTasks();
    strikethroughComplete();
};

const filterCompleted = () => {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    noResults.style.display = 'none';
    taskContainer.style.display = 'block';
    tasks = tasks.filter(task => task.status === 'completed');
    loadTasks();
    strikethroughComplete();
};


document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    strikethroughComplete();
    newTaskForm.addEventListener('submit', addTask);
    editTaskForm.addEventListener('submit', updateTask);

    tasks.length === 0 ? searchInput.disabled = true : searchInput.disabled = false;
    searchInput.addEventListener('input', searchTask);
});