const fs = require('fs');
const path = require('path');



beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        
        document.body.innerHTML = html;

        const mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => (store[key] = value.toString()),
                clear: () => (store = {}),
                removeItem: (key) => delete store[key],
            };
        })();
        Object.defineProperty(window, 'localStorage', {value: mockLocalStorage,});
        
        ({renderTasks} = require('../script.js'));

        
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

describe('renderTasks', () => {
    
    test('should render tasks from localStorage', () => {
        
        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: true }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('statusFilter', 'all');

        renderTasks();
       
        const taskElements = document.querySelectorAll('.atask');
        expect(taskElements.length).toBe(tasks.length);

        const taskTexts = Array.from(taskElements).map(el => el.querySelector('input').value);
        expect(taskTexts).toEqual(tasks.map(task => task.text));
    });

    test('should render only in-progress tasks when filter is set to "inprogress"', () => {
        
        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: true }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('statusFilter', 'inprogress');

        renderTasks();

        const taskElements = document.querySelectorAll('.atask');
        expect(taskElements.length).toBe(1);
        expect(taskElements[0].querySelector('input').value).toBe('Task 1');
    });

    test('should render only completed tasks when filter is set to "completed"', () => {

        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: true }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('statusFilter', 'completed');

        renderTasks();

        const taskElements = document.querySelectorAll('.atask');
        expect(taskElements.length).toBe(1);
        expect(taskElements[0].querySelector('input').value).toBe('Task 2');
    });

    test('should display "no tasks" message if no tasks are available', () => {
 
        localStorage.setItem('tasks', JSON.stringify([]));
        localStorage.setItem('statusFilter', 'all');

        renderTasks();

        const noTasksMessage = document.querySelector('.notasks');
        expect(noTasksMessage.style.display).toBe('flex');
        const taskList = document.querySelector('.tasklist');
        expect(taskList.style.display).toBe('none');
    });
});