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
        
        ({clearTaskList} = require('../script.js'));
        
        localStorage.clear();
    });
    
afterEach(() => {
    localStorage.clear();
});

describe('clearTaskList Function', () => {

    it('should clear all tasks from the task list', () => {

        const taskList = document.querySelector('#listtask');
        taskList.innerHTML = `
            <li>Task 1</li>
            <li>Task 2</li>
            <li>Task 3</li>
        `;

        clearTaskList();

        expect(taskList.innerHTML).toBe('');
    });

    it('should not affect other elements on the page', () => {
        document.body.innerHTML = `
            <ul id="listtask">
                <li>Task 1</li>
            </ul>
            <div id="other-element">This should not be cleared</div>
        `;

        clearTaskList();

        expect(document.querySelector('#other-element').textContent).toBe('This should not be cleared');
    });

    it('should handle an empty task list gracefully', () => {
        const taskList = document.querySelector('#listtask');
        taskList.innerHTML = '';

        clearTaskList();

        expect(taskList.innerHTML).toBe('');
    });

});