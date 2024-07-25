const fs = require('fs');
const path = require('path');

const { renderTasks, saveTask } = require('../script.js');

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

    test('should not allow saving a task with text that already exists', () => {
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

    // it('should call showToast with confirmation dialog', () => {
    //     // Arrange
    //     const sampleTasks = [
    //         { id: '1', text: 'Task for Toast Confirmation', completed: false }
    //     ];
    //     localStorage.setItem('tasks', JSON.stringify(sampleTasks));
    //     localStorage.setItem('taskIdCounter', '1');

    //     // Mock showToast to call the confirmation callback immediately
    //     //const showToastSpy = jest.spyOn(window, 'showToast').mockImplementation((message, onConfirm) => {
    //         onConfirm();
    //     });

    //     // Render tasks to the UI
    //     renderTasks();

    //     // Act
    //     const taskInput = document.querySelector('#onetask-1');
    //     taskInput.value = 'Updated Task Text';
    //     saveTask('1'); // Save changes
    //     const confirmButton = document.getElementById('confirm-button');
    //     confirmButton.click();

    //     // Assert
    //     //expect(showToastSpy).toHaveBeenCalledWith('Are you sure you want to save changes to this task?', expect.any(Function), expect.any(Function));
    //     expect(JSON.parse(localStorage.getItem('tasks'))[0].text).toBe('Updated Task Text');

    //     showToastSpy.mockRestore();
    // });

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

    
