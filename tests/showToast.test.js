const fs = require('fs');
const path = require('path');

const {showToast} = require('../script.js');


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

describe('showToast', () => {
    it('should display toast with correct message and handle confirm and cancel actions', () => {

      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
  
      showToast('Test message', mockOnConfirm, mockOnCancel);
  
      const toastContainer = document.getElementById('toast-container');
      expect(toastContainer.style.display).toBe('flex');
  
      const messageText = document.getElementById('message-text');
      expect(messageText.textContent).toBe('Test message');
  
      const confirmButton = document.getElementById('confirm-button');
      confirmButton.click();
      expect(mockOnConfirm).toHaveBeenCalled();
  
      const cancelButton = document.getElementById('cancel-button');
      cancelButton.click();
      expect(mockOnCancel).toHaveBeenCalled();
  
      expect(toastContainer.style.display).toBe('none');
    });
});