const fs = require('fs');
const path = require('path');

const { renderTasks,toggleEdit,toggleSave } = require('../script.js');

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