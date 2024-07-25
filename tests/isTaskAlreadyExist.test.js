const fs = require('fs');
const path = require('path');

const { isTaskAlreadyExists } = require('../script.js');

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

describe('isTaskAlreadyExists Function', () => {

    it('should return false when there are no tasks', () => {
        // Arrange
        localStorage.setItem('tasks', JSON.stringify([]));
        
        // Act
        const result = isTaskAlreadyExists('New Task', -1);
        
        // Assert
        expect(result).toBe(false);
      });
    
      it('should return false when task does not exist', () => {
        // Arrange
        const tasks = [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Act
        const result = isTaskAlreadyExists('New Task', -1);
        
        // Assert
        expect(result).toBe(false);
      });
    
      it('should return true when task already exists', () => {
        // Arrange
        const tasks = [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Act
        const result = isTaskAlreadyExists('Task 1', -1);
        
        // Assert
        expect(result).toBe(true);
      });

      it('should return true when task already exists but in different case', () => {
        // Arrange
        const tasks = [
          { id: 1, text: 'tAsK 1' },
          { id: 2, text: 'Task 2' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Act
        const result = isTaskAlreadyExists('Task 1', -1);
        
        // Assert
        expect(result).toBe(true);
      });
    
      it('should return false when task exists but has the same id', () => {
        // Arrange
        const tasks = [
          { id: 1, text: 'Task 1' },
          { id: 2, text: 'Task 2' }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        
        // Act
        const result = isTaskAlreadyExists('Task 1', 1);
        
        // Assert
        expect(result).toBe(false);
      });

    

});