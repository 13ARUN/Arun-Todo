const fs = require('fs');
const path = require('path');

const {renderTasks, cancelEdit} = require('../script.js');


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

describe('Cancel Edit Function', () => {
    
    test('should restore original task text on cancel edit', () => {

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