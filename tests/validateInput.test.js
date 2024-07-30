const fs = require('fs');
const path = require('path');




beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        
        document.body.innerHTML = html;


        const mockLocalStorage = (() => {
            let store = {};
            return {
                getItem: (key) => store[key] || null,
                setItem: (key, value) => (store[key] = value.toString()),
                clear: () => (store = {}),
                removeItem: (key) => delete store[key],
            };
        })();
        Object.defineProperty(window, 'localStorage', {value: mockLocalStorage,});
        
        ({validateInput} = require('../script.js'));

        
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

describe('validateInput function', () => {

        
    
    it('should return false if input is empty', () => {
        const inputValue = '';
        const existingTasks = [];


        const result = validateInput(inputValue, existingTasks);

        expect(result).toBe(false);
        
    });

    it('should return false  if input is only whitespace', () => {
        const inputValue = '   ';
        const existingTasks = [];

        const result = validateInput(inputValue, existingTasks);

        expect(result).toBe(false);
        
    });


    it('should return true if input is valid and unique', () => {
        const inputValue = 'Unique Task';
        const existingTasks = [{ text: 'Other Task' }];

        const result = validateInput(inputValue, existingTasks);

        expect(result).toBe(true);
        
    });

});