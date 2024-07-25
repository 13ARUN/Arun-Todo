const fs = require('fs');
const path = require('path');

const { renderTasks, toggleEdit } = require('../script.js');

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