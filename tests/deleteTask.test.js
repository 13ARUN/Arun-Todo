const fs = require('fs');
const path = require('path');

const { renderTasks, deleteTask } = require('../script.js');

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