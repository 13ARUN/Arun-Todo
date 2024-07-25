const fs = require('fs');
const path = require('path');

const { checkBox } = require('../script.js');


beforeEach(() => {
        // Load HTML and CSS
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
        Object.defineProperty(window, 'localStorage', {
            value: mockLocalStorage,
        });
        
        // Clear any previous tasks
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

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