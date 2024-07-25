const fs = require('fs');
const path = require('path');

const { clearTasks } = require('../script.js');

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