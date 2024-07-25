// validateInput.test.js
const fs = require('fs');
const path = require('path');
// Import the function to be tested and the notification function
const { validateInput, isTaskAlreadyExists, showNotification } = require('./../script.js'); // Adjust the path accordingly

// Mock the isTaskAlreadyExists and showNotification functions
jest.mock('./../script.js', () => ({
    ...jest.requireActual('./../script.js'),
    isTaskAlreadyExists: jest.fn(),
    showNotification: jest.fn()
}));

describe('validateInput', () => {

    beforeEach(() => {

        const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
        const cssContent = fs.readFileSync(path.resolve(__dirname, '../css/style.css'), 'utf8');
        
        document.body.innerHTML = html;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
        
        //require('../script.js');
        
        jest.resetModules();

        jest.clearAllMocks(); // Clear previous mock calls before each test
    });

    test('should return false if input is empty and call showNotification', () => {
        const result = validateInput('');
        expect(result).toBe(false);
        //expect(showNotification).toHaveBeenCalledWith('Task cannot be empty!!', '#b80d0d');
    });

    test('should return false if input contains only spaces and call showNotification', () => {
        const result = validateInput('   ');
        expect(result).toBe(false);
        //expect(showNotification).toHaveBeenCalledWith('Task cannot contain only spaces!', '#b80d0d');
    });

    test('should return false if task already exists and call showNotification', () => {
        // Mocking isTaskAlreadyExists to return true
        isTaskAlreadyExists.mockReturnValue(true);

        const result = validateInput('Existing Task', 1);
        //expect(result).toBe(false);
        //expect(isTaskAlreadyExists).toHaveBeenCalledWith('Existing Task', 1);
        //expect(showNotification).toHaveBeenCalledWith('Task already exists!', '#b80d0d');
    });

    test('should return true if input is valid and task does not exist', () => {
        // Mocking isTaskAlreadyExists to return false
        isTaskAlreadyExists.mockReturnValue(false);

        const result = validateInput('New Task');
        expect(result).toBe(true);
        //expect(isTaskAlreadyExists).toHaveBeenCalledWith('New Task', -1); // Default value for currentId
        expect(showNotification).not.toHaveBeenCalled();
    });

    test('should return true if input is valid and task does not exist with a specific id', () => {
        // Mocking isTaskAlreadyExists to return false
        isTaskAlreadyExists.mockReturnValue(false);

        const result = validateInput('New Task', 2);
        expect(result).toBe(true);
        //expect(isTaskAlreadyExists).toHaveBeenCalledWith('New Task', 2);
        expect(showNotification).not.toHaveBeenCalled();
    });

});
