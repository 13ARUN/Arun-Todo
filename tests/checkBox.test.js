const fs = require('fs');
const path = require('path');


beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        
        document.body.innerHTML = html;

        require('../script.js');

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
        
       
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

describe('checkBox function', () => {

    
    it('should toggle the completion status of a task and re-render tasks', () => {
        const taskId = 1;
        const initialTasks = [
            { id: taskId, text: 'Sample Task', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(initialTasks));

        checkBox(taskId);

        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        const updatedTask = updatedTasks.find(task => task.id === taskId);
        expect(updatedTask.completed).toBe(true); 
    
    });

    it('should toggle the completion status of a task and re-render tasks', () => {
        const taskId = 1;
        const initialTasks = [
            { id: taskId, text: 'Sample Task', completed: true }
        ];
        localStorage.setItem('tasks', JSON.stringify(initialTasks));

        checkBox(taskId);

        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        const updatedTask = updatedTasks.find(task => task.id === taskId);
        expect(updatedTask.completed).toBe(false); 
    
    });

    it('should toggle the completion status of the correct task when multiple tasks exist', () => {
        const taskId = 2;
        const initialTasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: taskId, text: 'Task 2', completed: false },
            { id: 3, text: 'Task 3', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(initialTasks));
    
        checkBox(taskId);
    
        const updatedTasks = JSON.parse(localStorage.getItem('tasks'));
        const updatedTask = updatedTasks.find(task => task.id === taskId);
        expect(updatedTask.completed).toBe(true); 
    });
});

