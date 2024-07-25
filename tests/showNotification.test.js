const fs = require('fs');
const path = require('path');

const {showNotification} = require('../script.js')



beforeEach(() => {
        // Load HTML and CSS
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/style.css'), 'utf8');
        
        document.body.innerHTML = html;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
        
        // require('../script.js');
        
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

describe('showNotification', () => {
    let notification;

    beforeEach(() => {
        
        notification = document.querySelector('.notification');
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should display the notification with the correct text and color', () => {
        // Arrange
        const text = 'Test notification';
        const color = 'red';
        
        // Act
        showNotification(text, color);

        
        
        // Assert
        expect(notification.textContent).toBe(text);
        expect(notification.style.backgroundColor).toBe(color);
        expect(notification.style.visibility).toBe('visible');
        expect(notification.classList.contains('notification')).toBe(true);
      });
    
      it('should hide the notification after the timeout', () => {
        jest.useFakeTimers();
    
        // Arrange
        const text = 'Test notification';
        const color = 'red';
        
        // Act
        showNotification(text, color);
        
        // Fast-forward until all timers have been executed
        jest.runAllTimers();
        
        // Assert
        expect(notification.textContent).toBe('');
        expect(notification.style.visibility).toBe('hidden');
      });
});