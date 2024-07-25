const fs = require('fs');
const path = require('path');

const { toggleToast } = require('../script.js');

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

describe('toggleToast Function', () => {


    it('should show the toast container when visible is true', () => {

        const toastContainer = document.querySelector("#toast-container");
        toggleToast(true);

        expect(toastContainer.style.display).toBe('flex');
    });



    it('should hide the toast container when visible is false', () => {

        const toastContainer = document.querySelector("#toast-container");
        toggleToast(false);

        expect(toastContainer.style.display).toBe('none');
    });

    it('should handle toggling between visible and hidden states correctly', () => {

        const toastContainer = document.querySelector("#toast-container");
        toggleToast(true);
        expect(toastContainer.style.display).toBe('flex');

        toggleToast(false);
        expect(toastContainer.style.display).toBe('none');

        toggleToast(true);
        expect(toastContainer.style.display).toBe('flex');
    });

});