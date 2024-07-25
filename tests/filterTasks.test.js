const fs = require('fs');
const path = require('path');

const {filterTasks} = require('../script.js')



beforeEach(() => {
        // Load HTML and CSS
        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/style.css'), 'utf8');
        
        document.body.innerHTML = html;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
        
        //require('../script.js');
        
        jest.resetModules();
        
        // Mock localStorage
        
    });
    


describe('filterTasks Function', () => {

    it('should return an empty array for an empty task list', () => {
        const tasks = [];
        const filteredTasks = filterTasks(tasks, 'all');
        expect(filteredTasks).toEqual([]);
    
        const filteredInProgressTasks = filterTasks(tasks, 'inprogress');
        expect(filteredInProgressTasks).toEqual([]);
    
        const filteredCompletedTasks = filterTasks(tasks, 'completed');
        expect(filteredCompletedTasks).toEqual([]);
    });

    it('should return an empty array if no tasks match the filter', () => {
        const tasks = [
            { id: 1, text: 'Task 1', completed: true },
            { id: 2, text: 'Task 2', completed: true },
        ];
        const filteredTasks = filterTasks(tasks, 'inprogress');
        expect(filteredTasks).toEqual([]);
    });

    it('should return an empty array if no tasks match the filter', () => {
        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: false },
        ];
        const filteredTasks = filterTasks(tasks, 'completed');
        expect(filteredTasks).toEqual([]);
    });

    it('filterTasks should correctly filter tasks based on completion status', () => {
        const tasks = [
            { id: 1, text: 'Task 1', completed: false },
            { id: 2, text: 'Task 2', completed: true },
            { id: 3, text: 'Task 3', completed: false },
        ];

        const filteredAllTasks = filterTasks(tasks, 'all');
        expect(filteredAllTasks).toEqual(tasks);
    
        const filteredInProgressTasks = filterTasks(tasks, 'inprogress');
        expect(filteredInProgressTasks).toEqual([
            { id: 1, text: 'Task 1', completed: false },
            { id: 3, text: 'Task 3', completed: false },
        ]);
    
        const filteredCompletedTasks = filterTasks(tasks, 'completed');
        expect(filteredCompletedTasks).toEqual([
            { id: 2, text: 'Task 2', completed: true },
        ]);
    });
});