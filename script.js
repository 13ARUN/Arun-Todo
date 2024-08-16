//* Query Selectors
const inputBox = document.querySelector('#input') //? Task input field
const taskList = document.querySelector('#listtask'); //? List of Tasks
const taskCountText = document.querySelector('.count h3'); //? Task Count Text

const noTasks = document.querySelector('.notasks'); 
const showtask = document.querySelector('.tasklist'); 
const taskActions = document.querySelector('.tasktext'); 
const countText = document.querySelector('.clear');

//* Global Variable to store Task Counts
let taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 0; //? ID counter variable for tasks

//* Render the page with the Saved filter and its Tasks
document.addEventListener('DOMContentLoaded', () => { 
    const savedFilter = localStorage.getItem('statusFilter') || 'all';
    document.querySelector(`input[value="${savedFilter}"]`).checked = true;
    renderTasks(savedFilter); 
});

//* Re-Render page based on filter clicked
document.querySelectorAll('input[name="taskFilter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const filter = e.target.value;
        localStorage.setItem('statusFilter', filter); //? Store filter value in Local Storage
        renderTasks(filter);
    });
});

//* Add a new Task on submission
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

//* UX 
['blur', 'input'].forEach(event => {
    inputBox.addEventListener(event, () => {
        inputBox.style.borderBottom = 'none'; // Remove border style on blur or input
    });
});

//* Clear tasks
document.getElementById('clear').addEventListener('click', clearTasks);


//* Render Cluster *//

//* To Render the Page
//! 
function renderTasks() {

    const allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    const filter = localStorage.getItem('statusFilter') || 'all';

    clearTaskList(); //! Fn: Clear existing tasks
    toggleTaskListVisibility(allTasks); //! Fn: Display based on tasks presence
    displayTaskCounts(allTasks, filter); //! Fn: Display task counts

    let filteredTasks = filterTasks(allTasks, filter); //! Fn: Filter tasks based on its status
    
    filteredTasks.forEach(task => {
        renderEachTask(task); //! Fn: Rendering a task and its elements
    });   
}

//* To Clear tasks Html
//?
function clearTaskList() {
    taskList.innerHTML = '';
}

//* To Display task counts based on filter 
//?
function displayTaskCounts(tasks, filter) {

    const totalTasks = tasks.length;
    const inProgressTasks = tasks.filter(task => !task.completed).length;
    const completedTasks = totalTasks - inProgressTasks;

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

//* To Filter tasks
//?
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

//* To Render each task 
//!
function renderEachTask(task) {

    let aTask = createTaskElement(task); //! Fn
    taskList.appendChild(aTask);
    //taskList.prepend(aTask); 

}

//* To Create a task element with its elements
//?
function createTaskElement(task) {
    let aTask = document.createElement("div"); 
    aTask.classList.add("atask"); 
    aTask.style.opacity = task.completed ? '0.6' : '1';

    let taskHTML = `
        <div class="eachtask">
            <input type="text" id="onetask-${task.id}" value="${task.text}" maxlength="150" readonly="true"> 
        </div>
        <div class="editdel" id="edit-${task.id}">
            <button id="checkbox-${task.id}" title="Status">
                <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
            </button>
            <button title="Edit Task">
                <img src="img/edit.png" alt="edit icon">
            </button> <!-- Edit button -->
            <button title="Delete Task">
                <img src="img/delete.png" alt="delete icon">
            </button> <!-- Delete button -->
        </div>
        <div class="savecancel" id="save-${task.id}" style="display:none">
            <button id="checkbox-${task.id}" title="Status" disabled="true">
                <img src="${task.completed ? 'img/done.png' : 'img/notdone.png'}" alt="checkbox">
            </button>
            <button title="Save Task">
                <img src="img/save.png" alt="save icon">
            </button> <!-- Save button -->
            <button title="Cancel Edit">
                <img src="img/wrong.png" alt="cancel icon">
            </button> <!-- Cancel button -->
        </div>
    `;
    
    aTask.innerHTML = taskHTML;

    aTask.querySelector(`#checkbox-${task.id}`).addEventListener('click', () => checkBox(task.id));
    aTask.querySelector('button[title="Delete Task"]').addEventListener('click', () => deleteTask(task.id));
    aTask.querySelector('button[title="Save Task"]').addEventListener('click', () => saveTask(task.id));
    aTask.querySelector('button[title="Cancel Edit"]').addEventListener('click', () => cancelEdit(task.id));
    aTask.querySelector('button[title="Edit Task"]').addEventListener('click', () => {
        if (!task.completed){
            toggleEdit(task.id)
        }else{
            showNotification('Cannot edit completed task!')
        }
    });

    return aTask;
}

//* To Change Visibility based on task count
//?
function toggleTaskListVisibility(tasks) {

    if (tasks.length === 0) {
        noTasks.style.display = 'flex'; 
        showtask.style.display = 'none'; 
        taskActions.style.display = 'none';
        countText.style.display = 'none';
    } else {
        noTasks.style.display = 'none'; 
        showtask.style.display = 'flex'; 
        taskActions.style.display = 'flex';
        countText.style.display = 'flex';
    }

}


//* Add Task Cluster

//* To Add a task 
//!
function addTask() {
    
    const inputValue = inputBox.value;

    if (!validateInput(inputValue)) { //! Fn: Validate input text
        inputBox.value = "";
        inputBox.style.borderBottom = '2px solid red';
        inputBox.focus();
        return;
    }

    let task = {
        id: ++taskIdCounter,
        text: inputBox.value.trim().replace(/\s+/g, ' '),
        completed: false
    };

    let allTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    allTasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    localStorage.setItem('taskIdCounter', taskIdCounter);
    localStorage.setItem('statusFilter', 'all');

    showNotification('Task added successfully', 'green'); //! Fn: Show task added notification
    const statusFilter = document.querySelector('input[name="taskFilter"][value="all"]');
    statusFilter.checked = true;
    
    renderTasks(); //! Fn: Re-Render Tasks

    inputBox.value = "";
    inputBox.focus();
}

//* To Validate the input
//?
function validateInput(taskText, currentId = -1) {

    if (taskText === '') {
        showNotification('Task cannot be empty!!', '#b80d0d'); //! Fn: Show task empty notification
        return false;
    } else if (taskText.replace(/\s+/g, ' ') === ' ') {
        showNotification('Task cannot contain only spaces!', '#b80d0d'); //! Fn: Show task not be spaces notification
        return false;
    } else if (isTaskAlreadyExists(taskText.trim().replace(/\s+/g, ' '), currentId)) {
        showNotification('Task already exists!', '#b80d0d'); //! Fn: Show task exists notification
        return false;
    }
    return true;
}

//* To Check if task already exists
//?
function isTaskAlreadyExists(taskText, currentId) { 

    let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return allTasks.some(task => task.text.toLowerCase() === taskText.toLowerCase() && task.id !== currentId); //? Return true if exists
}


//* Status Cluster

//* To Change a task's status
//!
function checkBox(taskId) {

    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let task = allTasks.find(task => task.id === taskId);

    task.completed = !task.completed;

    localStorage.setItem('tasks', JSON.stringify(allTasks));
    renderTasks(); //! Fn: Re-Render Tasks
}


//* Delete Cluster

//* To Delete a task
//!
function deleteTask(taskId) {

    showToast('Are you sure you want to delete this task?', () => { //! Fn: To ask for delete confirmation
        
        let allTasks = JSON.parse(localStorage.getItem('tasks'));
        allTasks = allTasks.filter(task => task.id !== taskId);
        localStorage.setItem('tasks', JSON.stringify(allTasks));

        showNotification('Task deleted successfully', 'green'); //! Fn: Show task deleted notification
        renderTasks(); //! Fn: Re-Render Tasks
    }, () => {
        showNotification('Task deletion canceled', 'red'); //! Fn: Show task deletion canceled notification
    });
}


//* Clear Cluster

//* To Clear tasks
//!
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

    showToast(message, () => { //! Fn: To ask for clear confirmation
        let allTasks;
        allTasks = JSON.parse(localStorage.getItem('tasks'));
        

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
                break;
        }

        showNotification(`${filter.charAt(0).toUpperCase() + filter.slice(1)} tasks cleared!`, 'green'); //! Fn: To show tasks cleared message
        renderTasks();

    }, () => {
        showNotification('Task clearing canceled', 'red'); //! Fn: To show task cleared cancel message
    });
}


//* Edit Cluster

//* To Toggle to Edit mode
//!
function toggleEdit(taskId) {

    inputBox.style.borderBottom = 'none';

    disableOtherElements(true); //! Fn: Disable other elements
    toggleTaskControls(taskId, false); //! Fn: Show Save and Cancel Button

    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.removeAttribute('readonly');
    taskText.focus();
    taskText.setSelectionRange(taskText.value.length, taskText.value.length);
    taskText.style.borderBottom = '2px solid #461b80';

    taskText.addEventListener('input', () => {
        taskText.style.borderBottom = '2px solid #461b80';
    });

}

//* To Enabe/Disable other Elements
//?
function disableOtherElements(disabled) {

    const addButton = document.querySelector('#add');
    const clearButton = document.querySelector('#clear');
    const allEditButtons = document.querySelectorAll('.editdel button');
    const radioButtons = document.querySelectorAll('input[name="taskFilter"]');

    inputBox.disabled = disabled;
    addButton.disabled = disabled;
    clearButton.disabled = disabled;

    allEditButtons.forEach(button => {
        button.disabled = disabled;
    });

    radioButtons.forEach(radio => {
        radio.disabled = disabled;
    });

}

//* To Save edited task
//!
function saveTask(taskId) {

    let allTasks = JSON.parse(localStorage.getItem('tasks'));
    let taskText = document.querySelector(`#onetask-${taskId}`);
    let editedText = taskText.value;

    if (!validateInput(editedText, taskId)) { //! Fn: Validate edited task text
        taskText.focus();
        return;
    }

    const confirmSave = () => {

    let task = allTasks.find(task => task.id === taskId);
    task.text = editedText;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    showNotification('Task updated successfully!', 'green'); //! Fn: show update task notification
    toggleSave(taskId); //! Fn: Toggle back to edit and delete
    renderTasks(); //! Fn: Re-render Tasks

    };

    const cancelSave = () => {
        cancelEdit(taskId);
        showNotification('Task saving canceled', 'red');
    };

    showToast('Are you sure you want to save changes to this task?', confirmSave, cancelSave);
}

//* To Cancel Task editing
//!
function cancelEdit(taskId) {

    let tasks = JSON.parse(localStorage.getItem('tasks'));
    let task = tasks.find(task => task.id === taskId);

    let taskText = document.querySelector(`#onetask-${taskId}`);

    taskText.value = task.text; 
    toggleSave(taskId); //! Fn: Toggle back to edit and delete
}


//* To Toggle EditDelete and SaveCancel
//!
function toggleSave(taskId) {

    disableOtherElements(false); //!Fn: Enable all elements

    toggleTaskControls(taskId, true); //!Fn: Toggle backk to edit delete

    let taskText = document.querySelector(`#onetask-${taskId}`);
    taskText.setAttribute('readonly', 'true');
    taskText.style.borderStyle = 'none';
}

//* To Change visibility of EditDelete and SaveCancel
//?
function toggleTaskControls(taskId, showEdit) {

    document.querySelector(`#edit-${taskId}`).style.display = showEdit ? 'flex' : 'none';
    document.querySelector(`#save-${taskId}`).style.display = showEdit ? 'none' : 'flex';
}

//* Notification and Toast Cluster

//* To Show Notification
//?
function showNotification(text = 'Notification', color = 'blue') {

    const notification = document.querySelector('.notification');

    notification.textContent = text;
    notification.style.backgroundColor = color;
    notification.style.visibility = 'visible';

    setTimeout(() => {
        notification.textContent = "";
        notification.style.visibility = 'hidden';
    }, 3000);
}

//* To Show Toast for Confirmations
//!
function showToast(message, onConfirm, onCancel) {

    const messageText = document.getElementById('message-text');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');

    toggleToast(true); //! Fn: Toggle the toast to display Flex
    messageText.textContent = message;

    confirmButton.onclick = () => {
        onConfirm();
        toggleToast(false); //! Fn: Toggle the toast to display none
    };

    cancelButton.onclick = () => {
        onCancel();
        toggleToast(false); //! Fn: Toggle the toast to display none
    };
}

//* To Toggle Toast div visisbility
//?
function toggleToast(visible) {
    const toastContainer = document.getElementById('toast-container');
    toastContainer.style.display = visible ? 'flex' : 'none';
}

//* Exports

module.exports = {
    renderTasks,
    renderEachTask,
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
    toggleToast
};


















