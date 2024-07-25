

let taskIdCounter = localStorage.getItem('taskIdCounter') ? parseInt(localStorage.getItem('taskIdCounter')) : 0; //? ID counter variable for tasks

//* 3.Event listeners

//* 3.1 Event listener for DOMContentLoaded to render tasks from local storage on page load based on filter
document.addEventListener('DOMContentLoaded', () => { // Load existing tasks on page load
    const savedFilter = localStorage.getItem('statusFilter') || 'all';
    document.querySelector(`input[value="${savedFilter}"]`).checked = true;
    renderTasks(savedFilter); // Render tasks from local storage
});

//* 3.2 Event listner for rendering tasks based on changed filter
document.querySelectorAll('input[name="taskFilter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const filter = e.target.value;
        localStorage.setItem('statusFilter', filter); //? Store filter value in Local Storage
        renderTasks(filter);
    });
});

//* 3.3 Event listner for removing error focus on task input on typing


//* 4.Function to render tasks 

function renderTasks() {
    let allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    const filter = localStorage.getItem('statusFilter');

    clearTaskList();

    displayTaskCounts(allTasks, filter);
    let filteredTasks = filterTasks(allTasks, filter);

    filteredTasks.forEach(task => {
        renderTask(task);
    });

    toggleTaskListVisibility(allTasks);

    
}

function renderTask(task) {
    const taskList = document.querySelector('#listtask');
    let aTask = createTaskElement(task);
    taskList.appendChild(aTask);
}


function clearTaskList() {
    const taskList = document.querySelector('#listtask');
    taskList.innerHTML = '';
}




function addTask() {

    const inputBox = document.querySelector('#input');
    const addButton = document.querySelector('#add');
    const inputValue = inputBox.value;


    if (!validateInput(inputValue)) {
        inputBox.value = "";
        inputBox.style.borderBottom = '2px solid red';
        inputBox.focus();
        return;
    }

    let task = {
        id: taskIdCounter++,
        text: inputBox.value.trim().replace(/\s+/g, ' '),
        completed: false
    };

    let allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    allTasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(allTasks));
    localStorage.setItem('taskIdCounter', taskIdCounter);
    localStorage.setItem('statusFilter', 'all');

    showNotification('Task added sucessfully', 'green');
    const statusFilter = document.querySelector('input[name="taskFilter"][value="all"]');
    statusFilter.checked = true;

    inputBox.addEventListener('input', () => {
        inputBox.style.borderBottom = 'none'; // Remove border style when typed
    });
    
    
    inputBox.addEventListener('blur', () => {
        inputBox.style.borderBottom = 'none'; // Remove border style when not focused
    });

    renderTasks();

    inputBox.value = "";
    inputBox.focus();
}


function validateInput(taskText, currentId = -1) {
    if (taskText === '') {
        showNotification('Task cannot be empty!!', '#b80d0d');
        return false;
    } else if (taskText.replace(/\s+/g, ' ') === ' ') {
        showNotification('Task cannot contain only spaces!', '#b80d0d');
        return false;
    } else if (isTaskAlreadyExists(taskText.trim().replace(/\s+/g, ' '), currentId)) {
        showNotification('Task already exists!', '#b80d0d');
        
        return false;
    }
    return true;
}



//* 6.Function to create a task element
function createTaskElement(task) {
    let aTask = document.createElement("div"); //? Create div atask to add elements for each task
    aTask.classList.add("atask"); // Add a class name "atask"
    aTask.style.opacity = task.completed ? '0.6' : '1';
    aTask.innerHTML = ` 
                        <div class="eachtask">
                            <input type="text" id="onetask-${task.id}" value="${task.text}" maxlength="150" readonly="true"> <!--//? Task content Default:readonly-->
                        </div>
                        
                        <div class="editdel" id="edit-${task.id}">
                            <button id="checkbox-${task.id}" title="Status" onclick="checkBox(${task.id})" ${task.completed ? 'checked' : ''}>
                            <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
                            </button>
                            <button title="Edit Task" onclick="${task.completed ? " " : `toggleEdit(${task.id})`}"> <!--//! Function call: To enable editing of task content-->
                            <img src="img/edit.png" alt="edit icon">
                            </button>  <!--//? Edit button-->
                            <button title="Delete Task" onclick="deleteTask(${task.id})"> <!--//! Function call: To delete a task from task list-->
                            <img src="img/delete.png" alt="delete icon">
                            </button>  <!--//? Delete button-->
                        </div>
                        <div class="savecancel" id="save-${task.id}" style="display:none">
                            <button id="checkbox-${task.id}" title="Status"  disabled="true" onclick="checkBox(${task.id})" ${task.completed ? 'checked' : ''}>
                            <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
                            </button>
                            <button  title="Save Task" onclick="saveTask(${task.id})">  <!--//! Function call: To save edited task-->
                            <img src="img/save.png" alt="save icon">
                            </button>  <!--//? Save button-->
                            <button  title="Cancel Edit" onclick="cancelEdit(${task.id})"> <!--//! Function call: To cancel editing a task-->   
                            <img src="img/wrong.png" alt="cancel icon">
                            </button>  <!--//? Cancel button-->
                        </div>`;
    return aTask; // Return the aTask to append in ul as a child
}



//* 7.Function to display task counts text based on filter
function displayTaskCounts(tasks, filter) {

    const taskCountText = document.querySelector('.count h3')

    //* Count variables for each filter
    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = totalTasks - inProgressTasks;

    //* Display task count text based on filter & filter count
    switch (filter) {
        case 'inprogress':
            if (inProgressTasks === 0) {
                taskCountText.textContent = "You have no tasks to do!";
            } else {
                taskCountText.textContent = inProgressTasks === 1 ? `You have ${inProgressTasks} task to do!` : `You have ${inProgressTasks} tasks to do!`;
            }
            break;
        case 'completed':
            if (completedTasks === 0) {
                taskCountText.textContent = "You have not completed any tasks!";
            } else {
                taskCountText.textContent = completedTasks === 1 ? `You have completed ${completedTasks} task!` : `You have completed ${completedTasks} tasks!`;
            }
            break;
        case 'all':
            if (totalTasks === 0) {
                taskCountText.textContent = "You have no tasks here!";
            } else {
                taskCountText.textContent = totalTasks === 1 ? `You have a total of ${totalTasks} task!` : `You have a total of ${totalTasks} tasks!`;
            }
            break;
        default:
            taskCountText.textContent = "You have no tasks here!";
    }
}


//* 8.Function to filter tasks based on the selected filter
function filterTasks(tasks, filter) {
    switch (filter) {
        case 'inprogress':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

//* 9.Function to toggle visibility of task list and no tasks page
function toggleTaskListVisibility(tasks) {

    const taskCountText = document.querySelector('.count h3');

    //* Elements to change visibility
    const noTasks = document.querySelector('.notasks'), //? No tasks page
          showtask = document.querySelector('.tasklist'), //? Tasks page
          taskActions = document.querySelector('.tasktext'); //? Task count & filter
          countText = document.querySelector('.clear') //? clear button and count display field

    if (tasks.length === 0) {
        taskCountText.textContent = `You have no tasks here!`; // display when all tasks are deleted
        noTasks.style.display = 'flex'; // Show no tasks
        showtask.style.display = 'none'; // Hide tasks
        taskActions.style.display = 'none';
        countText.style.display = 'none';
    } else {
        noTasks.style.display = 'none'; // Hide no tasks
        showtask.style.display = 'flex'; // Show tasks
        taskActions.style.display = 'flex';
        countText.style.display = 'flex';
    }
}

//* 10.Function to change completed status when checkbox is clicked
function checkBox(taskId) {

    //* Change completed status 
    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let task = allTasks.find(task => task.id === taskId); // Find task to change status

    task.completed = !task.completed; // Toggle true and false

    localStorage.setItem('tasks', JSON.stringify(allTasks));
    renderTasks(); //! Function call: To Re-render tasks after changing status
}

//* 11.Function to delete a task
function deleteTask(taskId) {
    showToast('Are you sure you want to delete this task?', () => { //! Function call: To ask for delete confirmation
        let allTasks = JSON.parse(localStorage.getItem('tasks')); //? Get the tasks from local storage
        allTasks = allTasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(allTasks));
        showNotification('Task deleted successfully', 'green'); //! Function call: To show task deleted message
        renderTasks(); //! Function call: To Re-render tasks after deletion
    }, () => {
        showNotification('Task deletion canceled', 'red'); //! Function call: To show deletion canceled message
    });
}


function toggleEdit(taskId) {
    
    const inputBox = document.querySelector('#input');


    inputBox.style.borderBottom = 'none';

    disableOtherElements(true);

    toggleTaskControls(taskId, 'edit', 'save');

    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.removeAttribute('readonly');

    taskText.focus();
    taskText.setSelectionRange(taskText.value.length, taskText.value.length);
    taskText.style.borderBottom = '2px solid #461b80';

    taskText.addEventListener('input', () => {
        taskText.style.borderBottom = '2px solid #461b80';
    });

    taskText.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveTask(taskId);
        }
        else {
            return;
        }
        
    });
}


function toggleSave(taskId) {

    disableOtherElements(false);

    toggleTaskControls(taskId, 'save', 'edit');

    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.setAttribute('readonly', 'true');
    taskText.style.borderStyle = 'none';
}


function disableOtherElements(disabled) {

    const inputBox = document.querySelector('#input');
    const addButton = document.querySelector('#add');
    const clearButton = document.querySelector('#clear');


    inputBox.disabled = disabled;
    addButton.disabled = disabled;
    clearButton.disabled = disabled;

    const allEditButtons = document.querySelectorAll('.editdel button');
    allEditButtons.forEach(button => {
        button.disabled = disabled;
    });

    const radioButtons = document.querySelectorAll('input[name="taskFilter"]');
    radioButtons.forEach(radio => {
        radio.disabled = disabled;
    });
}


//* 14.Function to toggle between edit/delete and save/cancel
function toggleTaskControls(taskId, from, to) {

    //* Select the respective div
    let fromDiv = document.querySelector(`#${from}-${taskId}`);
    let toDiv = document.querySelector(`#${to}-${taskId}`);

    //* Toggle display properties
    fromDiv.style.display = 'none';
    toDiv.style.display = 'flex';
}

//* 15.Function to save edited task
function saveTask(taskId) {
    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let taskText = document.querySelector(`#onetask-${taskId}`);
    let editedText = taskText.value.trim().replace(/\s+/g, ' ');

    // Use validateInput to check if the task is valid
    if (!validateInput(editedText, taskId)) {
        return;
    }

    const confirmSave = () => {
        let task = allTasks.find(task => task.id === taskId);
        task.text = editedText;
        localStorage.setItem('tasks', JSON.stringify(allTasks));

        showNotification('Task updated successfully!', 'green');
        toggleSave(taskId);
        renderTasks();
    };

    const cancelSave = () => {
        cancelEdit(taskId);
        showNotification('Task saving canceled', 'red');
    };

    showToast('Are you sure you want to save changes to this task?', confirmSave, cancelSave);
}


//* 16.Function to cancel editing task
function cancelEdit(taskId) {

    //* Cancel task editing
    let task = JSON.parse(localStorage.getItem('tasks')).find(task => task.id === taskId); // Original task text from local storage
    let taskText = document.querySelector(`#onetask-${taskId}`); 
    taskText.value = task.text; // Reassign original task text
    toggleSave(taskId); //! Function call: To toggle to edit/delete div
}

//* 17.Function to clear all tasks from screen and local storage based on filter
function clearTasks() {
    const filter = localStorage.getItem('statusFilter');
    let message = '';

    //* Message for confirmation dialog
    switch (filter) {
        case 'all':
            message = 'Are you sure you want to clear all tasks?';
            break;
        case 'inprogress':
            message = 'Are you sure you want to clear all in-progress tasks?';
            break;
        case 'completed':
            message = 'Are you sure you want to clear all completed tasks?';
            break;
    }

    showToast(message, () => { //! Function call: To ask for clear confirmation
        let allTasks = JSON.parse(localStorage.getItem('tasks'));
        
        //* Clear tasks based on filter
        switch (filter) {
            case 'all':
                localStorage.removeItem('tasks');
                localStorage.removeItem('taskIdCounter');
                taskIdCounter = 0;
                break;
            case 'inprogress':
                const inProgressTasks = allTasks.filter(task => task.completed);
                localStorage.setItem('tasks', JSON.stringify(inProgressTasks));
                break;
            case 'completed':
                const completedTasks = allTasks.filter(task => !task.completed);
                localStorage.setItem('tasks', JSON.stringify(completedTasks));
                taskIdCounter = 0;
                break;
        }

        showNotification(`${filter.charAt(0).toUpperCase() + filter.slice(1)} tasks cleared!`, 'green'); //! Function call: To show tasks cleared message
        renderTasks();
    }, () => {
        showNotification('Task clearing canceled', 'red'); //! Function call: To show task cleared cancel message
    });
}

//* 18.Function to check if task is already present
function isTaskAlreadyExists(taskText, currentId) { 
    let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return allTasks.some(task => task.text.toLowerCase() === taskText.toLowerCase() && task.id !== currentId); //? Return true is exists
}

//* 19.Function to display notification
function showNotification(text,color){

    const notification = document.querySelector('.notification');

    //* Assign text and background color
    notification.textContent = text;
    notification.style.backgroundColor = color;
    notification.style.visibility = 'visible'; // To display
    
    setTimeout(() => {
        notification.textContent = "";
        notification.style.visibility = 'hidden';
    }, 2000);
}

//* 20.Function to create and show a toast message
function showToast(message, onConfirm, onCancel) {

    // Toast container elements
    const toastContainer = document.getElementById('toast-container');
    const messageText = document.getElementById('message-text');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');

    // Show toast container
    toggleToast(true);

    // Set message text
    messageText.textContent = message;

    // Assign event handlers
    confirmButton.onclick = () => {
        onConfirm(); //! Function call: Execute for yes
        toggleToast(false); // Hide toast after confirmation
    };

    cancelButton.onclick = () => {
        onCancel(); //! Function call: Execute for no
        toggleToast(false); // Hide toast after cancellation
    };
}

//* 21.Function to hide toast message
function toggleToast(visible) {
    const toastContainer = document.getElementById('toast-container');
    toastContainer.style.display = visible ? 'flex' : 'none'; // Toggle toast visibility
}





window.addTask = addTask;
window.checkBox = checkBox;
window.clearTasks = clearTasks;
window.cancelEdit = cancelEdit;
window.filterTasks = filterTasks;
window.deleteTask = deleteTask;
window.saveTask = saveTask;
window.toggleEdit = toggleEdit;
window.toggleSave = toggleSave;
window.showNotification = showNotification;
window.showToast = showToast;
window.clearTaskList = clearTaskList;
window.createTaskElement = createTaskElement;
window.displayTaskCounts = displayTaskCounts;
window.toggleTaskListVisibility = toggleTaskListVisibility;
window.disableOtherElements = disableOtherElements;
window.toggleTaskControls = toggleTaskControls;
window.cancelEdit = cancelEdit;
window.validateInput = validateInput;
window.taskIdCounter = taskIdCounter;
window.renderTasks = renderTasks;
window.renderTask = renderTask;
window.isTaskAlreadyExists = isTaskAlreadyExists;
window.toggleToast = toggleToast;

module.exports = {
    taskIdCounter,
    renderTasks,
    renderTask,
    addTask,
    validateInput,
    checkBox,
    clearTasks,
    cancelEdit,
    isTaskAlreadyExists,
    filterTasks,
    deleteTask,
    saveTask,
    toggleEdit,
    toggleSave,
    showNotification,
    showToast,
    clearTaskList,
    createTaskElement,
    displayTaskCounts,
    toggleTaskListVisibility,
    disableOtherElements,
    toggleTaskControls,
    toggleToast,
};


















