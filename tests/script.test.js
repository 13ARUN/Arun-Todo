const fs = require('fs');
const path = require('path');
const {fireEvent} = require('@testing-library/dom');

const { taskIdCounter,
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
    toggleToast} = require('../script.js')

// jest.mock('../script.js', () => ({
//     ...jest.requireActual('../script.js'),
//     toggleSave: jest.fn(),
// }));

beforeEach(() => {

    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
    const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/style.css'), 'utf8');

    document.body.innerHTML = html;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = cssContent;
    document.head.appendChild(styleElement);
    
    require('../script.js');
    
    jest.resetModules();

    // Mock localStorage
    const mockLocalStorage = (() => {
        let store = {};
        return {
            getItem: (key) => store[key] || null,
            setItem: (key, value) => (store[key] = value.toString()),
            clear: () => (store = {}),
            removeItem: (key) => delete store[key],
        };
    })();
    Object.defineProperty(window, 'localStorage', {value: mockLocalStorage});

    // Clear any previous tasks
    localStorage.clear();

});

afterEach(() => {
    localStorage.clear();
});



describe('Html', () => {


    describe('HTML-File Section', () => {

        it('should have font family as "Arial,sans-serif"', () => {
            const file = document.querySelector('*');
            const style = window.getComputedStyle(file);
    
            expect(file).toBeTruthy();
            expect(style.fontFamily).toBe('Arial,sans-serif'); 
        });
    });

    describe('HTML-Body Section', () => {

        it('should have a body tag', () => {
            const body = document.querySelector('body');
            expect(body).toBeTruthy();
        });
        
        it('should have a main div', () => {
            const body = document.querySelector('body');
            const mainDiv = document.querySelector('.main');

            expect(body.contains(mainDiv)).toBe(true);
        });

        it('should have a notification message', () => {
            const body = document.querySelector('body');
            const noti = document.querySelector('p');

            expect(body.contains(noti)).toBe(true);
        });

        it('should have a toast div', () => {
            const body = document.querySelector('body');
            const toastDiv = document.querySelector('#toast-container');

            expect(body.contains(toastDiv)).toBe(true);
        });

        it('should have a script tag', () => {
            const body = document.querySelector('body');
            const script = document.querySelector('script');

            expect(body.contains(script)).toBe(true);
        });
    });

    describe('HTML-Main Section', () => {

        it('should have a div with class name "main"', () => {
            const mainDiv = document.querySelector('.main');
            const styles = window.getComputedStyle(mainDiv);

            expect(mainDiv).toBeTruthy();
            expect(styles.backgroundImage).toBe("url(../img/back2.jpg)");
        });
    });

    describe('HTML-ToDo Section', () => {

        it('should have a div with class name "todo"', () => {
            const todoDiv = document.querySelector('.todo');
            const styles = window.getComputedStyle(todoDiv);

            expect(todoDiv).toBeTruthy();
            expect(styles.backgroundColor).toBe('rgba(212, 174, 236, 0.801)');      
        });
    });

    describe('HTML-Header Section', () => {

        it('should have a header', () => {
            const header = document.querySelector('header');

            expect(header).toBeTruthy();
        });

        it('should have a h1 inside header', () => {
            const header = document.querySelector('header');
            const h1Element = header.querySelector('h1');

            expect(header.contains(h1Element)).toBe(true);
        });

        it('should have a header with text "To-Do Planner!"', () => {
            const header = document.querySelector('header');
            const h1Element = document.querySelector('header h1');
            const styles = window.getComputedStyle(header);

            expect(h1Element.textContent).toBe('To-Do Planner!');
            expect(styles.color).toBe('rgb(63, 20, 119)');
        
        });
    });

    describe('HTML-Task Input Section', () => {

        
        it('should have a div with class name "taskfield"', () => {
            const taskFieldDiv = document.querySelector('.taskfield');
            expect(taskFieldDiv).toBeTruthy();
        });

        it('should have a div with class name "taskinput"', () => {
            const taskInputDiv = document.querySelector('.taskinput');
            expect(taskInputDiv).toBeTruthy();
        });

        it('should have a form tag inside taskinput', () => {
            const taskInputDiv = document.querySelector('.taskinput');
            const form= taskInputDiv.querySelector('form');

            expect(taskInputDiv.contains(form)).toBe(true);
        });

        it('should have a onsubmit function in form tag', () => {
            const form = document.querySelector('form');
        
            expect(form.getAttribute('onsubmit')).toBe('event.preventDefault(); addTask();');
        });

        it('should have a input and button tag inside form', () => {
            const form= document.querySelector('form');
            const inputField = form.querySelector('#input');
            const addBtn= form.querySelector('#add');

            expect(form.contains(inputField) && form.contains(addBtn)).toBe(true);
        });

        it('should have a input field with attributes "type:text, id:input" ', () => {
            const inputField = document.querySelector('form input');
            
            expect(inputField.getAttribute('type')).toBe('text');
            expect(inputField.getAttribute('id')).toBe('input');
            
        });

        it('should have a placeholder as "Enter your tasks..."', () => {
            const inputField = document.querySelector('form input');
        
            expect(inputField.getAttribute('placeholder')).toBe('Enter your tasks...');   
        });

        it('should have autocomplete off and maximum length 150 for input field', () => {
            const inputField = document.querySelector('form input');

            expect(inputField.getAttribute('autocomplete')).toBe('off');  
            expect( inputField.getAttribute('maxlength')).toBe('150'); 
        });

        it('should have a empty value "" in input field ', () => {
            const inputField = document.querySelector('form input');

            expect(inputField.textContent).toBe('');
            
        });

        it('should have a add button with attributes "type:submit, id:add, title:Add" ', () => {
            const addBtn = document.querySelector('#add');
            
            expect(addBtn.getAttribute('type')).toBe('submit');
            expect(addBtn.getAttribute('id')).toBe('add');
            expect(addBtn.getAttribute('title')).toBe('Add');
        });

        it('should have a image for add button', () => {
            const addBtn= document.querySelector('#add');
            const addBtnImg = addBtn.querySelector('img');
            

            expect(addBtn.contains(addBtnImg)).toBe(true);
        });

        it('should have a add button image with attributes "source alt:add icon" ', () => {
            
            const addBtnImg= document.querySelector('#add img');

            expect(addBtnImg.getAttribute('src')).toBe('img/taskadd.png');
            expect(addBtnImg.getAttribute('alt')).toBe('add icon'); 
        });

    });

    describe('HTML-Task Filter Section', () => {

        it('should have a div with class name "tasktext"', () => {
            const taskTextDiv = document.querySelector('.tasktext');
            expect(taskTextDiv).toBeTruthy();
        });

        it('should have a div with class name "taskfilterclr"', () => {
            const taskFilterClr = document.querySelector('.taskfilterclr');
            expect(taskFilterClr).toBeTruthy();
        });

        it('should have input type as radio buttons with name "taskFilter" ', () => {
            const taskFilterInputs = document.querySelectorAll('.taskfilterclr input')

            taskFilterInputs.forEach((input) => {
        
                expect(input.getAttribute('type')).toBe('radio');
                expect(input.getAttribute('name')).toBe('taskFilter');
            });
        });

        //? All Button
        it('should have all button and label inside taskfilterclr', () => {
            const taskFilterClr = document.querySelector('.taskfilterclr');
            const allRadioBtn = taskFilterClr.querySelector('#all');
            const allRadioLabel= taskFilterClr.querySelector('#labelall');

            expect(allRadioBtn).toBeTruthy();
            expect(allRadioLabel).toBeTruthy();
            expect(taskFilterClr.contains(allRadioBtn) && taskFilterClr.contains(allRadioLabel)).toBe(true);
        });

        it('should have `all` input button with the attributes "value:all" and onchange parameter as "all"', () =>{
            const allRadioBtn = document.querySelector('#all'); 

            expect(allRadioBtn.getAttribute('value')).toBe('all');
            expect(allRadioBtn.getAttribute('onchange')).toBe("filterTasks('all')");   
        });

        it('should have `all` label text content as "All" and attributes as "for:all, title:All" ', () => {
            const allRadioLabel= document.querySelector('#labelall');
            
            expect(allRadioLabel.textContent).toBe('All');
            expect(allRadioLabel.getAttribute('for')).toBe('all');
            expect(allRadioLabel.getAttribute('title')).toBe('All');
        });

        //? In Progress Button
        it('should have In Progress button and label inside taskfilterclr', () => {
            const taskFilterClr = document.querySelector('.taskfilterclr');
            const inprogressRadioBtn = taskFilterClr.querySelector('#inprogress');
            const inprogressRadioLabel= taskFilterClr.querySelector('#labelinprogress');

            expect(inprogressRadioBtn).toBeTruthy();
            expect(inprogressRadioLabel).toBeTruthy();
            expect(taskFilterClr.contains(inprogressRadioBtn) && taskFilterClr.contains(inprogressRadioLabel)).toBe(true);
        });

        it('should have `in progress` input button with the attributes "value:inprogress" and onchange parameter as "inprogress"', () =>{
            const inprogressRadioBtn = document.querySelector('#inprogress'); 

            expect(inprogressRadioBtn.getAttribute('value')).toBe('inprogress');
            expect(inprogressRadioBtn.getAttribute('onchange')).toBe("filterTasks('inprogress')");   
        });

        it('should have `inprogress` label text content as "inprogress" and attributes as "for:inprogress, title:inprogress" ', () => {
            const inprogressRadioLabel= document.querySelector('#labelinprogress');
            
            expect(inprogressRadioLabel.textContent).toBe('In Progress');
            expect(inprogressRadioLabel.getAttribute('for')).toBe('inprogress');
            expect(inprogressRadioLabel.getAttribute('title')).toBe('In Progress');
        });

        //? Completed Button
        it('should have complete button and label inside taskfilterclr', () => {
            const taskFilterClr = document.querySelector('.taskfilterclr');
            const completedRadioBtn = taskFilterClr.querySelector('#completed');
            const completedRadioLabel= taskFilterClr.querySelector('#labelcompleted');

            expect(completedRadioBtn).toBeTruthy();
            expect(completedRadioLabel).toBeTruthy();
            expect(taskFilterClr.contains(completedRadioBtn) && taskFilterClr.contains(completedRadioLabel)).toBe(true);
        });

        it('should have `in progress` input button with the attributes "value:completed" and onchange parameter as "completed"', () =>{
            const completedRadioBtn = document.querySelector('#completed'); 

            expect(completedRadioBtn.getAttribute('value')).toBe('completed');
            expect(completedRadioBtn.getAttribute('onchange')).toBe("filterTasks('completed')");   
        });

        it('should have `completed` label text content as "completed" and attributes as "for:completed, title:completed" ', () => {
            const completedRadioLabel= document.querySelector('#labelcompleted');
            
            expect(completedRadioLabel.textContent).toBe('Completed');
            expect(completedRadioLabel.getAttribute('for')).toBe('completed');
            expect(completedRadioLabel.getAttribute('title')).toBe('Completed');
        });
    });

    describe('HTML-No Tasks Section', () => {    

        it('should have a div with class name "notasks" with display as none', () => {
            const noTasksDiv = document.querySelector('.notasks');
            expect(noTasksDiv).toBeTruthy();
            
        });

        it('should have a div with class name "notasks"', () => {
            const noTaskContentDiv = document.querySelector('.notaskcontent');
            expect(noTaskContentDiv).toBeTruthy();
        });

        it('should have a image and h2 tag inside notaskcontent', () => {
            const noTaskContentDiv = document.querySelector('.notaskcontent');
            const noTaskImg = noTaskContentDiv.querySelector('img');
            const noTaskText = noTaskContentDiv.querySelector('h2');

            expect(noTaskContentDiv.contains(noTaskImg)).toBe(true);
            expect(noTaskContentDiv.contains(noTaskText)).toBe(true);
        });

        it('should have a no task image with attributes "source alt:notask image" ', () => {
            
            const noTaskImg = document.querySelector('.notaskcontent img');

            expect(noTaskImg.getAttribute('src')).toBe('img/notask.png');
            expect(noTaskImg.getAttribute('alt')).toBe('notask image'); 
        });


        it('should have a content with text "Add tasks to begin!!"', () => {
            const noTaskText = document.querySelector('.notaskcontent h2');
            expect(noTaskText.textContent).toBe('Add tasks to begin!!');
        });

        
    });

    describe('HTML-Task List Section', () => {

        it('should have a div with class name "tasklist"', () => {
            const taskListDiv = document.querySelector('.tasklist');
            expect(taskListDiv).toBeTruthy();
        });

        it('should have a div with class name "tasklist"', () => {
            const taskDisplayDiv = document.querySelector('.taskdisplay');
            expect(taskDisplayDiv).toBeTruthy();
        });

        it('should have a ul with id "listtask"', () => {
            const ul = document.querySelector('#listtask');
            expect(ul).toBeTruthy();
        });

        it('should have a ul as child of taskdisplay', () => {
            const taskDisplayDiv = document.querySelector('.taskdisplay');
            const ul = document.querySelector('ul');
            
            expect(taskDisplayDiv.contains(ul)).toBe(true);
        });


    });

    describe('HTML-Task Count and Clear Section', () => {

        it('should have a div with class name "clear"', () => {
            const clearDiv = document.querySelector('.clear');
            expect(clearDiv).toBeTruthy();
        });

        it('should have a div with class name "count"', () => {
            const countDiv = document.querySelector('.count');
            expect(countDiv).toBeTruthy();
        });

        it('should have a h3 as child of count', () => {
            const countDiv = document.querySelector('.count');
            const h3Element = document.querySelector('h3');
            
            expect(countDiv.contains(h3Element)).toBe(true);
        });

        it('should have a text content of h3 as "You have no tasks here!"', () => {
            const h3Element = document.querySelector('h3');
            expect(h3Element.textContent).toBe('You have no tasks here!');
        });

        it('should have a button with id "clear"', () => {
            const clearBtn = document.querySelector('.clear #clear');
            expect(clearBtn).toBeTruthy();
        });

        it('should have a clear button with attributes "title:Clear, onclick function: clearTask" ', () => {
            const clearBtn = document.querySelector('.clear #clear');

            expect(clearBtn.getAttribute('title')).toBe('Clear');
            expect(clearBtn.getAttribute('onclick')).toBe('clearTasks()'); 
        });

        it('should have a text content of clear button as "Clear Tasks"', () => {
            const clearBtn = document.querySelector('.clear #clear');
            expect(clearBtn.textContent).toBe('Clear Tasks');
        });
    });

    describe('HTML-Notification Message Section', () => {

        it('should have a paragraph tag', () => {
            const notiTag = document.querySelector('body p');
            const style = window.getComputedStyle(notiTag);

            expect(notiTag).toBeTruthy();
            expect(notiTag.getAttribute('class')).toBe('notification');
            expect(style.visibility).toBe('hidden');
        });

        it('should not contain any text content', () => {
            const notiTag = document.querySelector('body p');
            expect(notiTag.textContent).toBe('');
        })

    });

    describe('HTML-Toast Message Section', () => {

        it('should have a div with class name "toast-container"', () => {
            const toastDiv = document.querySelector('#toast-container');
            expect(toastDiv).toBeTruthy();
        });

        it('should have a div with class name "toast-message"', () => {
            const toastMsgDiv = document.querySelector('.toast-message');
            expect(toastMsgDiv).toBeTruthy();
        });

        it('should have span and button container as child of toast-message', () => {
            const toastMsgDiv = document.querySelector('.toast-message');
            const toastSpan = document.querySelector('#message-text');
            const toastBtn = document.querySelector('.button-container');
            
            expect(toastMsgDiv.contains(toastSpan)).toBe(true);
            expect(toastMsgDiv.contains(toastBtn)).toBe(true);
        });

        it('should have confirm and cancel button in toast-message', () => {
            const toastBtn = document.querySelector('.button-container');
            const confirmBtn = document.querySelector('#confirm-button');
            const CancelBtn = document.querySelector('#cancel-button');
            
            expect(toastBtn.contains(confirmBtn)).toBe(true);
            expect(toastBtn.contains(CancelBtn)).toBe(true);
        });

        it('should have h3 tags inside button', () => {
            const toastBtn = document.querySelector('.button-container button');
            const h3 = document.querySelector('.button-container h3')

            expect(toastBtn.contains(h3)).toBe(true);
            expect(toastBtn.contains(h3)).toBe(true);
        
        });

        it('should have confirm and cancel button content as yes and no', () => {
            const confirmBtn = document.querySelector('#confirm-button');
            const CancelBtn = document.querySelector('#cancel-button');
            
            expect(confirmBtn.textContent).toBe('Yes');
            expect(CancelBtn.textContent).toBe('No');
        });  
    });

    describe('HTML-Script Section', () => {

        it('should have the source file', () => {
            const script = document.querySelector('script');
            expect(script.getAttribute('src')).toBe('script.js');
        });
    });

});


describe('DOM content load', () => {

    it('should render tasks based on saved filter when DOMContentLoaded is fired', () => {
        const savedFilter = 'completed';
        localStorage.setItem('statusFilter', savedFilter);
        localStorage.setItem('taskIdCounter', '0');
        
        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(localStorage.getItem('statusFilter')).toBe(savedFilter);
        expect(document.querySelector('input[value="completed"]').checked).toBe(true);
        
    });

    // it('should increment taskIdCounter when a task is added', () => {
    //     const inputBox = document.querySelector('#input');
    //     const addButton = document.querySelector('#add');
    
    //     inputBox.value = 'Test Task 1';
    //     addButton.click();
    
    //     //expect(localStorage.getItem('taskIdCounter')).toBe('1');
    
    //     inputBox.value = 'Test Task 2';
    //     addButton.click();
    
    //     //expect(localStorage.getItem('taskIdCounter')).toBe('2');
        
    //   });

    it('should set default filter to "all" if no saved filter is found when DOMContentLoaded is fired', () => {
        localStorage.setItem('taskIdCounter', '0');

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(localStorage.getItem('statusFilter')).toBeNull();
        expect(document.querySelector('input[value="all"]').checked).toBe(true);
        
    });



    it('should initialize taskIdCounter from localStorage value', () => {
        localStorage.setItem('taskIdCounter', '10');
        
        
        expect(taskIdCounter).toBe(0);
        expect(localStorage.getItem('taskIdCounter')).toBe('10');
    });
})


describe('Isolated functions', () => {

    //!
    describe('Render Tasks Function', () => {

        it('should render tasks from localStorage', () => {
            // Prepare localStorage with sample tasks
            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('statusFilter', 'all');
    
            // Call the function to render tasks
            renderTasks();
    
            // Assertions
            const taskElements = document.querySelectorAll('.atask');
            expect(taskElements.length).toBe(tasks.length);
    
            const taskTexts = Array.from(taskElements).map(el => el.querySelector('input').value);
            expect(taskTexts).toEqual(tasks.map(task => task.text));
        });
    
        it('should render only in-progress tasks when filter is set to "inprogress"', () => {
            // Prepare localStorage with sample tasks and set filter
            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('statusFilter', 'inprogress');
    
            // Call the function to render tasks
            renderTasks();
    
            // Assertions
            const taskElements = document.querySelectorAll('.atask');
            expect(taskElements.length).toBe(1);
            expect(taskElements[0].querySelector('input').value).toBe('Task 1');
        });
    
        it('should render only completed tasks when filter is set to "completed"', () => {
            // Prepare localStorage with sample tasks and set filter
            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            localStorage.setItem('statusFilter', 'completed');
    
            // Call the function to render tasks
            renderTasks();
    
            // Assertions
            const taskElements = document.querySelectorAll('.atask');
            expect(taskElements.length).toBe(1);
            expect(taskElements[0].querySelector('input').value).toBe('Task 2');
        });
    
        it('should display "no tasks" message if no tasks are available', () => {
            // Prepare localStorage with no tasks
            localStorage.setItem('tasks', JSON.stringify([]));
            localStorage.setItem('statusFilter', 'all');
    
            // Call the function to render tasks
            renderTasks();
    
            // Assertions
            const noTasksMessage = document.querySelector('.notasks');
            expect(noTasksMessage.style.display).toBe('flex');
            const taskList = document.querySelector('.tasklist');
            expect(taskList.style.display).toBe('none');
        });
    });

    //!
    describe('Render task Function', () => {
        it('should create and append a task element with correct content', () => {
            // Create a sample task
            const task = {
                id: 1,
                text: 'Sample Task',
                completed: false
            };
    
            // Call the function to render the task
            renderTask(task);
    
            // Assertions
            const taskElement = document.querySelector('.atask');
            expect(taskElement).not.toBeNull();
    
            const inputElement = taskElement.querySelector('input');
            expect(inputElement).not.toBeNull();
            expect(inputElement.value).toBe(task.text);
    
            const editButton = taskElement.querySelector('button[title="Edit Task"]');
            expect(editButton).not.toBeNull();
    
            const deleteButton = taskElement.querySelector('button[title="Delete Task"]');
            expect(deleteButton).not.toBeNull();
            
            const checkboxButton = taskElement.querySelector('button[title="Status"]');
            expect(checkboxButton).not.toBeNull();
            expect(checkboxButton.querySelector('img').src).toContain('img/notdone.png');
        });
    
        it('should apply the correct opacity based on the task completion status', () => {
            // Create a completed task
            const task = {
                id: 2,
                text: 'Completed Task',
                completed: true
            };
    
            // Call the function to render the task
            renderTask(task);
    
            // Assertions
            const taskElement = document.querySelector('.atask');
            expect(taskElement.style.opacity).toBe('0.6');
        });
    
        it('should render the save/cancel buttons only when editing', () => {
            // Create a sample task
            const task = {
                id: 3,
                text: 'Editable Task',
                completed: false
            };
    
            // Call the function to render the task
            renderTask(task);
    
            // Assertions
            const saveCancelDiv = document.querySelector(`#save-${task.id}`);
            expect(saveCancelDiv.style.display).toBe('none');
        });
    });

    //!
    describe('clearTaskList Function', () => {

        it('should clear all tasks from the task list', () => {

            const taskList = document.querySelector('#listtask');
            taskList.innerHTML = `
                <li>Task 1</li>
                <li>Task 2</li>
                <li>Task 3</li>
            `;
    
            clearTaskList();
    
            expect(taskList.innerHTML).toBe('');
        });
    
        it('should not affect other elements on the page', () => {
            document.body.innerHTML = `
                <ul id="listtask">
                    <li>Task 1</li>
                </ul>
                <div id="other-element">This should not be cleared</div>
            `;
    
            clearTaskList();
    
            // Assert: Check if other elements are unaffected
            expect(document.querySelector('#other-element').textContent).toBe('This should not be cleared');
        });
    
        it('should handle an empty task list gracefully', () => {
            // Arrange: Ensure the task list is empty
            const taskList = document.querySelector('#listtask');
            taskList.innerHTML = '';

            clearTaskList();

            expect(taskList.innerHTML).toBe('');
        });

    });


    // TODO
    describe('Add Task Function', () => {

        beforeEach(() => {

            
            localStorage.clear();
        
        });
        
        afterEach(() => {
            localStorage.clear();
        });

        it('should add a task and update localStorage', () => {
            // Arrange
            document.querySelector('#input').value = 'Test Task';
    
            // Act
            addTask();
    
            // Assert
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            expect(tasks).toHaveLength(1);
            expect(tasks[0].text).toBe('Test Task');
            expect(tasks[0].completed).toBe(false);
            expect(localStorage.getItem('taskIdCounter')).toBe('1'); // Counter should increment
        });

        it('should treat tasks with different cases as duplicates', () => {
            // Arrange
            document.querySelector('#input').value = 'Case Insensitive Task';
            addTask(); // Add first task
            
            // Act
            document.querySelector('#input').value = 'case insensitive task'; // Set to duplicate with different case
            addTask(); // Try to add duplicate task
            
            // Assert
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            expect(tasks).toHaveLength(1); // Only one task should be present
        });

        it('should not add a task if input is empty', () => {
            // Arrange
            document.querySelector('#input').value = '';
    
            // Act
            addTask();
    
            // Assert
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            expect(tasks).toBeNull();
            
        });
    
        it('should not add a task if input contains only spaces', () => {
            // Arrange
            document.querySelector('#input').value = '   ';
    
            // Act
            addTask();
    
            // Assert
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            expect(tasks).toBeNull();
            
        });
    
        it('should not add a duplicate task', () => {
            // Arrange
            document.querySelector('#input').value = 'Duplicate Task';
            addTask(); // Add first task
            document.querySelector('#input').value = 'Duplicate Task'; // Set to duplicate task
            addTask(); // Try to add duplicate task
    
            // Act
            const tasks = JSON.parse(localStorage.getItem('tasks'));
    
            // Assert
            expect(tasks).toHaveLength(1); // Only one task should be present
        });
    
        
    
        it('should clear input field and focus after adding a task', () => {
            // Arrange
            const input = document.querySelector('#input');
            input.value = 'Task to Clear';
    
            // Act
            addTask();
    
            // Assert
            expect(input.value).toBe('');
            expect(document.activeElement).toBe(input); // Check if input is focused
        });

        it('should correctly increment taskIdCounter for multiple tasks', () => {
            // Arrange
            document.querySelector('#input').value = 'First Task';
            addTask(); // Add first task
            document.querySelector('#input').value = 'Second Task';
            addTask(); // Add second task
            
            // Act
            const taskIdCounter = localStorage.getItem('taskIdCounter');
            
            // Assert
            //expect(taskIdCounter).toBe('2'); // Assuming initial counter was 1
        });
        // TODO
        it('should show notification when input is empty', () => {
            // Arrange
            document.querySelector('#input').value = '';
            
            // Mock showNotification to track calls
            const mockShowNotification = jest.fn();
            //jest.spyOn(global, 'showNotification').mockImplementation(mockShowNotification);
            
            // Act
            addTask();
            
            // Assert
            //expect(mockShowNotification).toHaveBeenCalledWith('Task cannot be empty');
        });
        // TODO
        it('should show notification when adding a duplicate task', () => {
            // Arrange
            document.querySelector('#input').value = 'Duplicate Task';
            addTask(); // Add first task
            
            // Mock showNotification to track calls
            const mockShowNotification = jest.fn();
            //jest.spyOn(global, 'showNotification').mockImplementation(mockShowNotification);
            
            // Act
            document.querySelector('#input').value = 'Duplicate Task'; // Set to duplicate task
            addTask(); // Try to add duplicate task
            
            // Assert
            //expect(mockShowNotification).toHaveBeenCalledWith('Task already exists');
        });
    });


    //!
    describe('validateInput function', () => {

        
    
        it('should return false and show notification if input is empty', () => {
            // Arrange
            const inputValue = '';
            const existingTasks = [];
    
            // Act
            const result = validateInput(inputValue, existingTasks);
    
            // Assert
            expect(result).toBe(false);
            
        });
    
        it('should return false and show notification if input is only whitespace', () => {
            // Arrange
            const inputValue = '   ';
            const existingTasks = [];
    
            // Act
            const result = validateInput(inputValue, existingTasks);
    
            // Assert
            expect(result).toBe(false);
            
        });
    
        //TODO
        // it('should return false and show notification if task already exists', () => {
        //     // Arrange
        //     const inputValue = 'Existing Task';
        //     const existingTasks = [{ text: 'Existing Task' }];
    
        //     // Act
        //     const result = validateInput(inputValue, existingTasks);
    
        //     // Assert
        //     expect(result).toBe(false);
            
        // });
    
        it('should return true if input is valid and unique', () => {
            // Arrange
            const inputValue = 'Unique Task';
            const existingTasks = [{ text: 'Other Task' }];
    
            // Act
            const result = validateInput(inputValue, existingTasks);
    
            // Assert
            expect(result).toBe(true);
            
        });
    
    });
    //!
    describe('createTaskElement Function', () => {

        it('should create a task element with the correct structure', () => {
           
            taskList = document.querySelector('#listtask');

            const task = {
                id: 1,
                text: 'Sample Task',
                completed: false
            };
    
            const taskElement = createTaskElement(task);
   
            taskList.appendChild(taskElement);

            expect(taskElement).toBeTruthy();
            expect(taskElement.querySelector('input[type="text"]').value).toBe('Sample Task');
            expect(taskElement.querySelector('input[type="text"]').getAttribute('readonly')).toBe('true');
            expect(taskElement.querySelector('button[title="Status"]').querySelector('img').src).toContain('img/notdone.png');

            
            const saveDiv = taskElement.querySelector(`#save-${task.id}`);
            const style = window.getComputedStyle(saveDiv);
            expect(style.display).toBe("none");

            expect(taskElement.querySelector('button[title="Edit Task"]')).toBeTruthy();
            expect(taskElement.querySelector('button[title="Delete Task"]')).toBeTruthy();
            expect(taskElement.querySelector('button[title="Save Task"]')).toBeTruthy();
            expect(taskElement.querySelector('button[title="Cancel Edit"]')).toBeTruthy();
        });

        it('should create a task element with the correct structure for a completed task', () => {
         
            const task = {
                id: 2,
                text: 'Completed Task',
                completed: true
            };
    
        
            const taskElement = createTaskElement(task);
            const taskList = document.querySelector('#listtask');
    
       
            taskList.appendChild(taskElement);
    

            expect(taskElement).toBeTruthy();
            expect(taskElement.querySelector('input[type="text"]').value).toBe('Completed Task');
            expect(taskElement.querySelector('input[type="text"]').getAttribute('readonly')).toBe('true');
            expect(taskElement.querySelector('button[title="Status"]')).toBeTruthy();
            expect(taskElement.querySelector('button[title="Status"]').querySelector('img').src).toContain('img/done.png');
        });

        // it('should correctly display Save and Cancel buttons when toggled', () => {
            
        //     const task = {
        //         id: 4,
        //         text: 'Task to be edited',
        //         completed: false
        //     };
           
        //     const taskElement = createTaskElement(task);
        //     const taskList = document.querySelector('#listtask');
    
        //     taskList.appendChild(taskElement);
    
   
        //     const editButton = taskElement.querySelector('button[title="Edit Task"]');
        //     editButton.click();

        //     expect(taskElement.querySelector('button[title="Save Task"]')).toBeTruthy();
        //     expect(taskElement.querySelector('button[title="Cancel Edit"]')).toBeTruthy();
            
        //     const saveDiv = taskElement.querySelector(`#save-${task.id}`);
        //     const style = window.getComputedStyle(saveDiv);
        //     expect(style.display).toBe("flex");
        // });
    
    });
    //!
    describe('displayTaskCounts Function', () => {

        it('should display "You have no tasks here!" for an empty task array with filter "all"', () => {
            
            const countDiv = document.querySelector('.count h3');

            const tasks = [];
            const filter = 'all';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have no tasks here!');
        });
    
        it('should display "You have no tasks to do!";" for an empty task array with filter "inprogress"', () => {
            const countDiv = document.querySelector('.count h3');

            const tasks = [];
            const filter = 'inprogress';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have no tasks to do!');
        });
    
        it('should display "You have not completed any tasks!" for an empty task array with filter "completed"', () => {
            const countDiv = document.querySelector('.count h3');

            const tasks = [];
            const filter = 'completed';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have not completed any tasks!');
        });

        it('should display the correct count for all tasks', () => {
            
            const countDiv = document.querySelector('.count h3');

            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: false }
            ];
            const filter = 'all';
    
            
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have a total of 3 tasks!');
        });

        it('should display the correct count for in-progress tasks', () => {
            const countDiv = document.querySelector('.count h3');

            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: false }
            ];
            const filter = 'inprogress';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have 2 tasks to do!');
        });
    
        it('should display the correct count for completed tasks', () => {
            const countDiv = document.querySelector('.count h3');

            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: true }
            ];
            const filter = 'completed';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have completed 2 tasks!');
        });

        it('should display the correct count text for all tasks with 1 task', () => {

            const countDiv = document.querySelector('.count h3');

            const tasks = [
                { id: 1, text: 'Single Task', completed: false }
            ];
            const filter = 'all';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have a total of 1 task!');
        });
    
        it('should display the correct count text for in-progress tasks with 1 task', () => {

            const countDiv = document.querySelector('.count h3');

            const tasks = [
                { id: 1, text: 'In-progress Task', completed: false }
            ];
            const filter = 'inprogress';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have 1 task to do!');
        });
    
        it('should display the correct count text for completed tasks with 1 task', () => {

            const countDiv = document.querySelector('.count h3');

            const tasks = [
                { id: 1, text: 'Completed Task', completed: true }
            ];
            const filter = 'completed';
    
            displayTaskCounts(tasks, filter);
    
            expect(countDiv.textContent).toBe('You have completed 1 task!');
        });

    });
    //!
    describe('filterTasks Function', () => {

        it('should return an empty array for an empty task list', () => {
            const tasks = [];
            const filteredTasks = filterTasks(tasks, 'all');
            expect(filteredTasks).toEqual([]);
        
            const filteredInProgressTasks = filterTasks(tasks, 'inprogress');
            expect(filteredInProgressTasks).toEqual([]);
        
            const filteredCompletedTasks = filterTasks(tasks, 'completed');
            expect(filteredCompletedTasks).toEqual([]);
        });
    
        it('should return an empty array if no tasks match the filter', () => {
            const tasks = [
                { id: 1, text: 'Task 1', completed: true },
                { id: 2, text: 'Task 2', completed: true },
            ];
            const filteredTasks = filterTasks(tasks, 'inprogress');
            expect(filteredTasks).toEqual([]);
        });
    
        it('should return an empty array if no tasks match the filter', () => {
            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: false },
            ];
            const filteredTasks = filterTasks(tasks, 'completed');
            expect(filteredTasks).toEqual([]);
        });
    
        it('filterTasks should correctly filter tasks based on completion status', () => {
            const tasks = [
                { id: 1, text: 'Task 1', completed: false },
                { id: 2, text: 'Task 2', completed: true },
                { id: 3, text: 'Task 3', completed: false },
            ];
    
            const filteredAllTasks = filterTasks(tasks, 'all');
            expect(filteredAllTasks).toEqual(tasks);
        
            const filteredInProgressTasks = filterTasks(tasks, 'inprogress');
            expect(filteredInProgressTasks).toEqual([
                { id: 1, text: 'Task 1', completed: false },
                { id: 3, text: 'Task 3', completed: false },
            ]);
        
            const filteredCompletedTasks = filterTasks(tasks, 'completed');
            expect(filteredCompletedTasks).toEqual([
                { id: 2, text: 'Task 2', completed: true },
            ]);
        });
    });
    //!
    describe('toggleTaskVisibility Function', () => {
        
        let noTasks, showtask, taskActions, countDiv;

        beforeEach(() => {
            // Set up the DOM elements
            const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
            document.body.innerHTML = html;
    
            noTasks = document.querySelector('.notasks');
            showtask = document.querySelector('.tasklist');
            taskActions = document.querySelector('.tasktext');
            countDiv = document.querySelector('.clear');
        });
    
        it('should hide task list and display no tasks message when there are no tasks', () => {
            const tasks = [];
            toggleTaskListVisibility(tasks);
    
            expect(noTasks.style.display).toBe('flex');
            expect(showtask.style.display).toBe('none');
            expect(taskActions.style.display).toBe('none');
            expect(countDiv.style.display).toBe('none');
        });
    
        it('should show task list and hide no tasks message when there are tasks', () => {
            const tasks = [{ id: 1, text: 'Sample Task', completed: false }];
            toggleTaskListVisibility(tasks);
    
            expect(noTasks.style.display).toBe('none');
            expect(showtask.style.display).toBe('flex');
            expect(taskActions.style.display).toBe('flex');
            expect(countDiv.style.display).toBe('flex');
        });

    });
    //!
    describe('checkBox function', () => {

    
        it('should toggle the completion status of a task and re-render tasks', () => {
            // Arrange
            const taskId = 1;
            const initialTasks = [
                { id: taskId, text: 'Sample Task', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(initialTasks));
    
            // Act
            checkBox(taskId);
    
            // Assert
            const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
            const updatedTask = updatedTasks.find(task => task.id === taskId);
            expect(updatedTask.completed).toBe(true); // Status should be toggled to true
        
        });

        it('should toggle the completion status of a task and re-render tasks', () => {
            // Arrange
            const taskId = 1;
            const initialTasks = [
                { id: taskId, text: 'Sample Task', completed: true }
            ];
            localStorage.setItem('tasks', JSON.stringify(initialTasks));
    
            // Act
            checkBox(taskId);
    
            // Assert
            const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
            const updatedTask = updatedTasks.find(task => task.id === taskId);
            expect(updatedTask.completed).toBe(false); // Status should be toggled to true
        
        });
    
        
    
    });


    //!
    describe('Delete Function', () => {

        it('should delete a task and update localStorage and UI on confirmation', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Task to Delete', completed: false },
                { id: '2', text: 'Another Task', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '2');
    
            // Render tasks to the UI
            renderTasks();
    
            // Mock showToast to automatically confirm deletion
            // const showToastMock = jest.fn((message, onConfirm) => onConfirm());
            // global.showToast = showToastMock;
    
            // Spy on showNotification and renderTasks functions
            // const showNotificationSpy = jest.spyOn(window, 'showNotification').mockImplementation(() => {});
            // const renderTasksSpy = jest.spyOn(window, 'renderTasks').mockImplementation(() => {});
    
            // Act
            deleteTask('1');

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();

    
            // Assert
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            expect(tasks).toHaveLength(1);
            expect(tasks[0].id).toBe('2'); // Only the second task should remain
    
            expect(document.querySelector('#onetask-1')).toBeNull(); // The task should be removed from the UI
            expect(document.querySelector('#onetask-2')).toBeTruthy(); // The remaining task should still be there
    
            //expect(showNotificationSpy).toHaveBeenCalledWith('Task deleted successfully', 'green');
            //expect(renderTasksSpy).toHaveBeenCalled();
    
            // showNotificationSpy.mockRestore();
            // renderTasksSpy.mockRestore();
        });

        it('should cancel deletion and show cancellation message on cancel', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Task to Cancel', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Mock showToast to automatically cancel deletion
            // const showToastMock = jest.fn((message, onConfirm, onCancel) => onCancel());
            // global.showToast = showToastMock;
    
            // Spy on showNotification function
            // const showNotificationSpy = jest.spyOn(window, 'showNotification').mockImplementation(() => {});
    
            // Act
            deleteTask('1');

            const cancelButton = document.getElementById('cancel-button');
            cancelButton.click();
    
            // Assert
            const tasks = JSON.parse(localStorage.getItem('tasks'));
            expect(tasks).toHaveLength(1); // The task should still be present in the localStorage
            expect(document.querySelector('#onetask-1')).toBeTruthy(); // The task should still be in the UI
    
            //expect(showNotificationSpy).toHaveBeenCalledWith('Task deletion canceled', 'red');
    
            //showNotificationSpy.mockRestore();
        });
        
    });
    // TODO
    describe('ToggleEdit Function', () => {

        it('should enable editing mode for a task', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Editable Task', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            toggleEdit('1');
    
            // Assert
            const taskInput = document.querySelector('#onetask-1');
            expect(taskInput).toBeTruthy();
            expect(taskInput.hasAttribute('readonly')).toBe(false);
            expect(taskInput.style.borderBottom).toBe('2px solid #461b80');
            expect(document.activeElement).toBe(taskInput); // Check if input is focused
        });

        // it('should disable other elements while editing', () => {
        //     // Arrange
        //     const sampleTasks = [
        //         { id: '1', text: 'Another Task', completed: false }
        //     ];
        //     localStorage.setItem('tasks', JSON.stringify(sampleTasks));
        //     localStorage.setItem('taskIdCounter', '1');
    
        //     // Render tasks to the UI
        //     renderTasks();
    
        //     // Mock the disableOtherElements function
        //     const disableOtherElementsMock = jest.spyOn(window, 'disableOtherElements').mockImplementation(() => {});
    
        //     // Act
        //     toggleEdit('1');
    
        //     // Assert
        //     expect(disableOtherElementsMock).toHaveBeenCalledWith(true);
            
        //     disableOtherElementsMock.mockRestore();
        // });

        it('should set up event listeners correctly for task input', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Event Listener Task', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            toggleEdit('1');
    
            const taskInput = document.querySelector('#onetask-1');
    
            // Simulate input event
            taskInput.value = 'Updated Task';
            taskInput.dispatchEvent(new Event('input'));
    
            // Simulate Enter key press
            const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
            taskInput.dispatchEvent(enterEvent);
    
            // Assert
            expect(taskInput.style.borderBottom).toBe('2px solid #461b80');
            // You may need to add more specific assertions based on saveTask behavior
    
            // Check if saveTask function is called (requires spy on saveTask)
            //const saveTaskSpy = jest.spyOn(window, 'saveTask');
            //expect(saveTaskSpy).toHaveBeenCalledWith('1');
    
            //saveTaskSpy.mockRestore();
        });

        it('should restore input border style on input event', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Task with Border', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            toggleEdit('1');
    
            const taskInput = document.querySelector('#onetask-1');
            taskInput.dispatchEvent(new Event('input'));
    
            // Assert
            expect(taskInput.style.borderBottom).toBe('2px solid #461b80');
        });

        it('should not call saveTask if Enter key is not pressed', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Task without Save', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            toggleEdit('1');
    
            const taskInput = document.querySelector('#onetask-1');
    
            // Simulate input event
            taskInput.value = 'Updated Text';
            taskInput.dispatchEvent(new Event('input'));
    
            // Simulate a key press other than Enter
            const otherKeyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            taskInput.dispatchEvent(otherKeyEvent);
    
            // Assert
            //const saveTaskSpy = jest.spyOn(window, 'saveTask');
            //expect(saveTaskSpy).not.toHaveBeenCalled();
    
            //saveTaskSpy.mockRestore();
        });
    });    
    // TODO
    describe('ToggleSave Function', () => {


        it('should disable editing controls and restore input state', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Task to Save', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Mock the disableOtherElements function
            //const disableOtherElementsMock = jest.spyOn(window, 'disableOtherElements').mockImplementation(() => {});
    
            // Act
            toggleEdit('1'); // Enter edit mode
            toggleSave('1'); // Save changes
    
            // Assert
            //expect(disableOtherElementsMock).toHaveBeenCalledWith(false);
            expect(document.querySelector('#onetask-1').getAttribute('readonly')).toBe('true');
            
            
            //disableOtherElementsMock.mockRestore();
        });
    });


    //!
    describe('DisableOtherElements Function', () => {

        it('should disable all elements when passed true', () => {
    
            const inputBox = document.getElementById('input');
            const addButton = document.getElementById('add');
            const clearButton = document.getElementById('clear');
            const allEditButtons = document.querySelectorAll('.editdel button');
            const radioButtons = document.querySelectorAll('input[name="taskFilter"]');
    
            disableOtherElements(true);
    
            expect(inputBox.disabled).toBe(true);
            expect(addButton.disabled).toBe(true);
            expect(clearButton.disabled).toBe(true);
    
            allEditButtons.forEach(button => {
                expect(button.disabled).toBe(true);
            });
    
            radioButtons.forEach(radio => {
                expect(radio.disabled).toBe(true);
            });
        });
    
        it('should enable all elements when passed false', () => {
    
            const inputBox = document.getElementById('input');
            const addButton = document.getElementById('add');
            const clearButton = document.getElementById('clear');
            const allEditButtons = document.querySelectorAll('.editdel button');
            const radioButtons = document.querySelectorAll('input[name="taskFilter"]');
    
            disableOtherElements(false);
    
            expect(inputBox.disabled).toBe(false);
            expect(addButton.disabled).toBe(false);
            expect(clearButton.disabled).toBe(false);
    
            allEditButtons.forEach(button => {
                expect(button.disabled).toBe(false);
            });
    
            radioButtons.forEach(radio => {
                expect(radio.disabled).toBe(false);
            });
        });
    
    });


    // TODO
    describe('ToggleTaskControls Function', () => {

    });
    // TODO
    describe('SaveTask Function', () => {

        it('should update task text and re-render tasks', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Old Task Text', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = 'Updated Task Text';
            saveTask('1'); // Save changes

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
    
            // Assert
            const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
            expect(updatedTasks).toHaveLength(1);
            expect(updatedTasks[0].text).toBe('Updated Task Text');
            expect(taskInput.value).toBe('Updated Task Text'); // Ensure UI reflects updated text
        });

        

        it('should not update task text when input empty and re-render tasks', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Old Task Text', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = '';
            saveTask('1'); // Save changes

            
    
            // Assert
            const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
            expect(updatedTasks).toHaveLength(1);
            expect(updatedTasks[0].text).toBe('Old Task Text');
            expect(taskInput.value).toBe(''); // Ensure UI reflects updated text

            const notificationElement = document.querySelector('.notification');
            expect(notificationElement.textContent).toBe('Task cannot be empty!!'); // Example error message
        });

        it('should not update task text when input empty and re-render tasks', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Old Task Text', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = '     ';
            saveTask('1'); // Save changes

            
            // Assert
            const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
            expect(updatedTasks).toHaveLength(1);
            expect(updatedTasks[0].text).toBe('Old Task Text');
            //expect(taskInput.value).toBe(''); // Ensure UI reflects updated text

            const notificationElement = document.querySelector('.notification');
            expect(notificationElement.textContent).toBe('Task cannot be empty!!'); // Example error message
        });

        it('should not allow saving a task with text that already exists', () => {
            // Setup

            const sampleTasks = [
                { id: 1, text: 'Existing Task', completed: false },
                { id: 2, text: 'Another Task', completed: false }
            ];
            

            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();
    
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = 'Another Task';
            saveTask('1'); // Save changes

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
        
            // Assertions
            const notificationElement = document.querySelector('.notification');
            expect(notificationElement.textContent).toBe('Task already exists!'); // Example error message
            expect(localStorage.getItem('tasks')).toBe(JSON.stringify([
                { id: 1, text: 'Existing Task', completed: false },
                { id: 2, text: 'Another Task', completed: false }
            ]));
    
        });
    
        it('should call showToast with confirmation dialog', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Task for Toast Confirmation', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Mock showToast to call the confirmation callback immediately
            // const showToastSpy = jest.spyOn(window, 'showToast').mockImplementation((message, onConfirm) => {
            //     onConfirm();
            // });
    
            // Render tasks to the UI
            renderTasks();
    
            // Act
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = 'Updated Task Text';
            saveTask('1'); // Save changes
            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
    
            // Assert
            //expect(showToastSpy).toHaveBeenCalledWith('Are you sure you want to save changes to this task?', expect.any(Function), expect.any(Function));
            expect(JSON.parse(localStorage.getItem('tasks'))[0].text).toBe('Updated Task Text');
    
            //showToastSpy.mockRestore();
        });
    
        it('should call showNotification with success message on save', () => {
            // Arrange
            const sampleTasks = [
                { id: '1', text: 'Task for Notification Check', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Mock showNotification function
            //const showNotificationSpy = jest.spyOn(window, 'showNotification').mockImplementation(() => {});
    
            // Render tasks to the UI
            renderTasks();

            
    
            // Act
            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = 'Updated Task Text';
            saveTask('1'); // Save changes

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
    
            // Assert
            //expect(showNotificationSpy).toHaveBeenCalledWith('Task updated successfully!', 'green');
    
            //showNotificationSpy.mockRestore();
        });
    
        
    });
    //!
    describe('Cancel Edit Function', () => {
    
        it('should restore original task text on cancel edit', () => {

            const sampleTasks = [
                { id: '1', text: 'Task Text', completed: false }
            ];
            localStorage.setItem('tasks', JSON.stringify(sampleTasks));
            localStorage.setItem('taskIdCounter', '1');
    
            // Render tasks to the UI
            renderTasks();

            const taskInput = document.querySelector('#onetask-1');
            taskInput.value = 'Updated Task Text';
            // Simulate the cancel edit action
            cancelEdit('1'); // ID 1 refers to the task being edited
        
            // Get the input element
            
        
            // Assertions
            expect(taskInput.value).toBe('Task Text'); // Ensure the value is restored
            expect(document.querySelector('#save-1').style.display).toBe('none'); // Save/Cancel should be hidden
            expect(document.querySelector('#edit-1').style.display).toBe('flex'); // Edit/Delete should be visible
        });
    });
    //!
    describe('ClearTasks Function', () => {
    
        it('should clear all tasks when filter is "all"', () => {
            // Arrange
            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }, { id: 2, text: 'Task 2', completed: true }]));
            localStorage.setItem('statusFilter', 'all');
            
            // Act
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
            
            // Assert
            expect(localStorage.getItem('tasks')).toBe(null); // All tasks should be cleared
        });

        it('should clear only in-progress tasks when filter is "inprogress"', () => {
            // Arrange
            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }, { id: 2, text: 'Task 2', completed: true }]));
            localStorage.setItem('statusFilter', 'inprogress');
            
            // Act
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
            
            // Assert
            const remainingTasks = JSON.parse(localStorage.getItem('tasks'));
            expect(remainingTasks.length).toBe(1); // Only completed tasks should remain
            expect(remainingTasks[0].completed).toBe(true);
        });
    
        it('should clear only completed tasks when filter is "completed"', () => {
            // Arrange
            localStorage.setItem('tasks', JSON.stringify([{ id: 1, text: 'Task 1', completed: false }, { id: 2, text: 'Task 2', completed: true }]));
            localStorage.setItem('statusFilter', 'completed');
            
            // Act
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
            
            // Assert
            const remainingTasks = JSON.parse(localStorage.getItem('tasks'));
            expect(remainingTasks.length).toBe(1); // Only in-progress tasks should remain
            expect(remainingTasks[0].completed).toBe(false);
        });

        it('should handle case where there are no tasks to clear', () => {
            // Arrange
            localStorage.setItem('tasks', JSON.stringify([])); // No tasks to clear
            localStorage.setItem('statusFilter', 'all');
            
            // Act
            clearTasks();

            const confirmButton = document.getElementById('confirm-button');
            confirmButton.click();
            
            // Assert
            expect(localStorage.getItem('tasks')).toBeNull(); // Tasks array should remain empty
        });
    });

    //!
    describe('isTaskAlreadyExists Function', () => {

        it('should return false when there are no tasks', () => {
            // Arrange
            localStorage.setItem('tasks', JSON.stringify([]));
            
            // Act
            const result = isTaskAlreadyExists('New Task', -1);
            
            // Assert
            expect(result).toBe(false);
          });
        
          it('should return false when task does not exist', () => {
            // Arrange
            const tasks = [
              { id: 1, text: 'Task 1' },
              { id: 2, text: 'Task 2' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Act
            const result = isTaskAlreadyExists('New Task', -1);
            
            // Assert
            expect(result).toBe(false);
          });
        
          it('should return true when task already exists', () => {
            // Arrange
            const tasks = [
              { id: 1, text: 'Task 1' },
              { id: 2, text: 'Task 2' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Act
            const result = isTaskAlreadyExists('Task 1', -1);
            
            // Assert
            expect(result).toBe(true);
          });

          it('should return true when task already exists but in different case', () => {
            // Arrange
            const tasks = [
              { id: 1, text: 'tAsK 1' },
              { id: 2, text: 'Task 2' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Act
            const result = isTaskAlreadyExists('Task 1', -1);
            
            // Assert
            expect(result).toBe(true);
          });
        
          it('should return false when task exists but has the same id', () => {
            // Arrange
            const tasks = [
              { id: 1, text: 'Task 1' },
              { id: 2, text: 'Task 2' }
            ];
            localStorage.setItem('tasks', JSON.stringify(tasks));
            
            // Act
            const result = isTaskAlreadyExists('Task 1', 1);
            
            // Assert
            expect(result).toBe(false);
          });

        
    
    });

    //!
    describe('showNotification', () => {
        let notification;
    
        beforeEach(() => {
            
            notification = document.querySelector('.notification');
            jest.useFakeTimers();
        });
    
        afterEach(() => {
            jest.useRealTimers();
        });
    
        it('should display the notification with the correct text and color', () => {
            // Arrange
            const text = 'Test notification';
            const color = 'red';
            
            // Act
            showNotification(text, color);
            
            // Assert
            expect(notification.textContent).toBe(text);
            expect(notification.style.backgroundColor).toBe(color);
            expect(notification.style.visibility).toBe('visible');
            expect(notification.classList.contains('notification')).toBe(true);
          });
        
          it('should hide the notification after the timeout', () => {
            jest.useFakeTimers();
        
            // Arrange
            const text = 'Test notification';
            const color = 'red';
            
            // Act
            showNotification(text, color);
            
            // Fast-forward until all timers have been executed
            jest.runAllTimers();
            
            // Assert
            expect(notification.textContent).toBe('');
            expect(notification.style.visibility).toBe('hidden');
          });
    });

    //!
    describe('showToast', () => {
        it('should display toast with correct message and handle confirm and cancel actions', () => {

          const mockOnConfirm = jest.fn();
          const mockOnCancel = jest.fn();
      
          showToast('Test message', mockOnConfirm, mockOnCancel);
      
          const toastContainer = document.getElementById('toast-container');
          expect(toastContainer.style.display).toBe('flex');
      
          const messageText = document.getElementById('message-text');
          expect(messageText.textContent).toBe('Test message');
      
          const confirmButton = document.getElementById('confirm-button');
          confirmButton.click();
          expect(mockOnConfirm).toHaveBeenCalled();
      
          const cancelButton = document.getElementById('cancel-button');
          cancelButton.click();
          expect(mockOnCancel).toHaveBeenCalled();
      
          expect(toastContainer.style.display).toBe('none');
        });
    });

    //!
    describe('toggleToast Function', () => {


        it('should show the toast container when visible is true', () => {

            const toastContainer = document.querySelector("#toast-container");
            toggleToast(true);
    
            expect(toastContainer.style.display).toBe('flex');
        });



        it('should hide the toast container when visible is false', () => {

            const toastContainer = document.querySelector("#toast-container");
            toggleToast(false);
    
            expect(toastContainer.style.display).toBe('none');
        });
    
        it('should handle toggling between visible and hidden states correctly', () => {

            const toastContainer = document.querySelector("#toast-container");
            toggleToast(true);
            expect(toastContainer.style.display).toBe('flex');
    
            toggleToast(false);
            expect(toastContainer.style.display).toBe('none');
    
            toggleToast(true);
            expect(toastContainer.style.display).toBe('flex');
        });

    });
      
    
    

    

});


describe('Adding a Task', () => {

    it('should add a new task', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        const addButton = document.querySelector('#add')
    
        inputBox.value = 'New Task';
        

        fireEvent.submit(form);
        //form.dispatchEvent(new Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('New Task');
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task added sucessfully');
    });

    

    it('should add two new tasks', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        inputBox.value = 'Task 2';
        form.dispatchEvent(new Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(2);
        expect(tasks[0].text).toBe('Task 1');
        expect(tasks[1].text).toBe('Task 2');

    });

    it('should add a new task with leading spaces after trimming', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '    Task';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('Task');
    });

    it('should add a new task with trailing spaces after trimming', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = 'Task     ';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('Task');
    });

    it('should add a new task with leading and trailing spaces after trimming', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '    Task     ';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        expect(tasks[0].text).toBe('Task');
    });

    it('should not add an empty task', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '';
        form.dispatchEvent(new  Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull();
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot be empty!!');

    });

    // TODO
    it('should not add an empty task', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '';
        form.dispatchEvent(new Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull();
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot be empty!!');

        inputBox.dispatchEvent(new Event('input'));
        // const style = window.getComputedStyle(inputBox);
        //expect(inputBox.borderBottom).toBe('none');

    });

    it('should not add a task with only spaces', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
    
        inputBox.value = '     ';
        form.dispatchEvent(new Event('submit'));
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull();
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot contain only spaces!');
    });

    it('should not add an existing task', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toHaveLength(1);
        
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task already exists!');

        const displayedTasks = document.querySelectorAll('.eachtask input[type="text"]');
        expect(displayedTasks).toHaveLength(1);
        expect(displayedTasks[0].value).toBe('Task 1');
    });
});


describe('filter a Task', () => {

    

   

    
    

    //? Integration tests

    it('should filter tasks based on status', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new  Event('submit'));
        
        inputBox.value = 'Task 2';
        form.dispatchEvent(new  Event('submit'));

        inputBox.value = 'Task 3';
        form.dispatchEvent(new  Event('submit'));
        
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        tasks[1].completed = true;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    
        const inProgressFilter = document.querySelector('input[name="taskFilter"][value="inprogress"]');
        inProgressFilter.click();
    
        const displayedInProgressTasks = document.querySelectorAll('.eachtask input[type="text"]');
        expect(displayedInProgressTasks).toHaveLength(2);
        expect(displayedInProgressTasks[0].value).toBe('Task 1');
        expect(displayedInProgressTasks[1].value).toBe('Task 3');

        const completedFilter = document.querySelector('input[name="taskFilter"][value="completed"]');
        completedFilter.click();
    
        const displayedCompletedTasks = document.querySelectorAll('.eachtask input[type="text"]');
        expect(displayedCompletedTasks).toHaveLength(1);
        expect(displayedCompletedTasks[0].value).toBe('Task 2');
    });

});

describe('Deleting a Task', () => {

    it('should delete a task after adding a task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be deleted';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const deleteButton = document.querySelector(`#edit-${taskId} button[title="Delete Task"]`);
        deleteButton.click();
    
        // Simulate user confirming the deletion
        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(0);
    });

    it('should cancel deletion of task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be deleted';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const deleteButton = document.querySelector(`#edit-${taskId} button[title="Delete Task"]`);
        deleteButton.click();
    
        // Simulate user confirming the deletion
        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks).toHaveLength(1);
        expect(updatedTasks[0].text).toBe('Task to be deleted');
    });







});

describe('Editing a Task', () => {


    it('should edit a task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editBox =  document.querySelector(`#onetask-${taskId}`);
        editBox.value = 'Task edited';


        //editBox.dispatchEvent(new Event('input'));
        fireEvent.input(editBox);

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
        
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task edited')

        
    });

    it('should edit and save a task using enter key', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editBox =  document.querySelector(`#onetask-${taskId}`);
        editBox.value = 'Task edited';


        fireEvent.keyDown(editBox, { key: 'Enter' });

        
    
        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();
        
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task edited')

        
    });

    it('should not do anything when other keys are pressed', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editBox =  document.querySelector(`#onetask-${taskId}`);
        editBox.value = 'Task edited';


        fireEvent.keyDown(editBox, { key: 'Space' });

        
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });

    it('should cancel edit a task after editing', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Task edited';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();


        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });

    it('should not edit a task that is empty', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = '';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task cannot be empty!!');
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });

    it('should edit a task to a task that already exists', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Existing Task';
        addButton.click();

        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[1].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Existing Task';

        const saveButton = document.querySelector(`#save-${taskId} button[title="Save Task"]`);
        saveButton.click();
    
        const notification = document.querySelector('.notification');
        expect(notification.textContent).toBe('Task already exists!');
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Existing Task')

        
    });

});

describe('Cancel editing of Task', () => {

    it('should cancel edit a task', () => {
        const inputBox = document.querySelector('#input');
        const addButton = document.querySelector('#add');
    
        inputBox.value = 'Task to be edited';
        addButton.click();
    
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;
    
        const editButton = document.querySelector(`#edit-${taskId} button[title="Edit Task"]`);
        editButton.click();

        const editbox =  document.querySelector(`#onetask-${taskId}`);
        editbox.value = 'Task edited';

        const cancelButton = document.querySelector(`#save-${taskId} button[title="Cancel Edit"]`);
        cancelButton.click();
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(updatedTasks[0].text).toBe('Task to be edited')

        
    });


});

describe('Change completed status', () => {


    it('should change completed status when clicked', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks[0].completed).toBeFalsy();
        
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()

        const tasksComplete = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksComplete[0].completed).toBeTruthy();  
    });

    it('should change completed status when clicked', () => {
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()
        checkButton.click()

        const tasksComplete = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksComplete[0].completed).toBeFalsy();  
    });

});

describe('Clear tasks', () => {

    it('should clear all tasks', () => {

        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));
        

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks).toBeNull()

    });

    it('should not clear all tasks when canceled', () => {

        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));
        

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const cancelButton = document.getElementById('cancel-button');
        cancelButton.click();

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        expect(tasks[0].text).toBe('Task 1')

    });

    it('should clear In Progress tasks', () => {

        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');

        
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        inputBox.value = 'Task 2';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()
        
        const inProgressFilter = document.querySelector('input[name="taskFilter"][value="inprogress"]');
        inProgressFilter.click();

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasksclear = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksclear).toHaveLength(1);
        expect(tasksclear[0].text).toBe('Task 1')
        
        

    });

    it('should clear Completed tasks', () => {
        
        
        
        const inputBox = document.querySelector('#input');
        const form = document.querySelector('form');
       
        inputBox.value = 'Task 1';
        form.dispatchEvent(new Event('submit'));

        inputBox.value = 'Task 2';
        form.dispatchEvent(new Event('submit'));

        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const taskId = tasks[0].id;

        const checkButton = document.querySelector(`#checkbox-${taskId}`);
        checkButton.click()

        const completedFilter = document.querySelector('input[name="taskFilter"][value="completed"]');
        completedFilter.click();

        const clearButton = document.querySelector(`#clear`);
        clearButton.click()

        const confirmButton = document.getElementById('confirm-button');
        confirmButton.click();

        const tasksclear = JSON.parse(localStorage.getItem('tasks'));
        expect(tasksclear).toHaveLength(1);
        expect(tasksclear[0].text).toBe('Task 2')
        
        

    });





});

describe('Components', () => {


});
   






