const fs = require('fs');
const path = require('path');

const { addTask } = require('../script.js');



describe('Add Task Function', () => {

    beforeEach(() => {
        // Load HTML and CSS
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/style.css'), 'utf8');
        
        document.body.innerHTML = html;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
        
        
        
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
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
        });

        const taskList = document.querySelector('#listtask');
        taskList.innerHTML = '';
        
        // Clear any previous tasks
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

it('should increment the taskIdCounter correctly', () => {

    document.querySelector('#input').value = 'First Task';
    addTask();

    document.querySelector('#input').value = 'Second Task';
    addTask();
    

    const tasks = JSON.parse(localStorage.getItem('tasks'));
    expect(tasks[0].id).toBe(0);
    expect(tasks[1].id).toBe(1);
});

it('should add two new tasks', () => {
    const inputBox = document.querySelector('#input');
    const form = document.querySelector('form');

    inputBox.value = 'Task 1';
    form.dispatchEvent(new Event('submit'));

    inputBox.value = 'Task 2';
    form.dispatchEvent(new Event('submit'));

    const tasks = JSON.parse(localStorage.getItem('tasks'));
    
    expect(tasks[0].text).toBe('Task 1');
    expect(tasks[1].text).toBe('Task 2');

});





it('should add a task and update localStorage', () => {

    localStorage.setItem('taskIdCounter', '1');

    document.querySelector('#input').value = 'Test Task';
    

    addTask();

    const tasks = JSON.parse(localStorage.getItem('tasks'));

    expect(tasks).toHaveLength(1);
    expect(tasks[0].text).toBe('Test Task');
    expect(tasks[0].completed).toBe(false);
    

    const notification = document.querySelector('.notification');
    
    expect(notification.textContent).toBe("Task added sucessfully");
    const style = window.getComputedStyle(notification);
    expect(style.backgroundColor).toBe('green');
});

it('should handle tasks with special characters correctly', () => {
    document.querySelector('#input').value = 'Task with @special #characters!';
    addTask();

    const tasks = JSON.parse(localStorage.getItem('tasks'));
    expect(tasks).toHaveLength(1);
    expect(tasks[0].text).toBe('Task with @special #characters!');
});

it('should not add a duplicate task', () => {

    document.querySelector('#input').value = 'Duplicate Task';
    addTask(); 

    document.querySelector('#input').value = 'Duplicate Task'; // Set to duplicate task
    addTask(); 

    const tasks = JSON.parse(localStorage.getItem('tasks'));

    expect(tasks).toHaveLength(1); 

    const notification = document.querySelector('.notification');

    expect(notification.textContent).toBe("Task already exists!");
    const style = window.getComputedStyle(notification);
    expect(style.backgroundColor).toBe('rgb(184, 13, 13)');
});

it('should treat tasks with different cases as duplicates', () => {

    document.querySelector('#input').value = 'Case Insensitive Task';
    addTask(); 
    
    document.querySelector('#input').value = 'case insensitive task'; // Set to duplicate with different case
    addTask();
    
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    expect(tasks).toHaveLength(1);

    const notification = document.querySelector('.notification');
    
    expect(notification.textContent).toBe("Task already exists!");
    const style = window.getComputedStyle(notification);
    expect(style.backgroundColor).toBe('rgb(184, 13, 13)');
});

it('should not add a task if input is empty', () => {

    document.querySelector('#input').value = '';

    addTask();

    const tasks = JSON.parse(localStorage.getItem('tasks'));
    expect(tasks).toBeNull();

    const notification = document.querySelector('.notification');

    expect(notification.textContent).toBe("Task cannot be empty!!");
    const style = window.getComputedStyle(notification);
    expect(style.backgroundColor).toBe('rgb(184, 13, 13)');
    
});

it('should not add a task if input contains only spaces', () => {

    document.querySelector('#input').value = '   ';

    addTask();

    const tasks = JSON.parse(localStorage.getItem('tasks'));
    expect(tasks).toBeNull();

    const notification = document.querySelector('.notification');

    expect(notification.textContent).toBe("Task cannot contain only spaces!");
    const style = window.getComputedStyle(notification);
    expect(style.backgroundColor).toBe('rgb(184, 13, 13)');
    
});




it('should clear input field and focus after adding a task', () => {

    const input = document.querySelector('#input');
    input.value = 'Task to Clear';

    addTask();

    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
});

});