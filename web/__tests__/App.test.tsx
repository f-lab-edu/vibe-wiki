import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Canvas App Toolbar', () => {
    it('renders toolbar buttons', () => {
        const { getByTitle } = render(<App />);
        expect(getByTitle('Pen')).toBeInTheDocument();
        expect(getByTitle('Eraser')).toBeInTheDocument();
        expect(getByTitle('Select')).toBeInTheDocument();
    });
    
    it('switches to pen tool', () => {
        const { getByTitle } = render(<App />);
        const penBtn = getByTitle('Pen');
        fireEvent.click(penBtn);
        expect(penBtn).toHaveStyle('background-color: #ddd');
    });

    it('switches to eraser tool', () => {
        const { getByTitle } = render(<App />);
        const eraserBtn = getByTitle('Eraser');
        fireEvent.click(eraserBtn);
        expect(eraserBtn).toHaveStyle('background-color: #ddd');
    });

    it('undo/redo buttons are clickable', () => {
        const { getByTitle } = render(<App />);
        const undoBtn = getByTitle('Undo');
        const redoBtn = getByTitle('Redo');
        expect(undoBtn).toBeInTheDocument();
        expect(redoBtn).toBeInTheDocument();
        fireEvent.click(undoBtn);
        fireEvent.click(redoBtn);
    });

    it('draws a line with pen tool', () => {
        const { getByTitle } = render(<App />);
        const penBtn = getByTitle('Pen');
        fireEvent.click(penBtn);
    
        const stage = document.querySelector('canvas');
        if (!stage) throw new Error('Stage not found');
    
        fireEvent.mouseDown(stage, { clientX: 50, clientY: 50 });
        fireEvent.mouseMove(stage, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(stage);
    });
    
    it('erases part of a line with eraser tool', () => {
        const { getByTitle } = render(<App />);
        const penBtn = getByTitle('Pen');
        fireEvent.click(penBtn);

        const stage = document.querySelector('canvas');
        if (!stage) throw new Error('Stage not found');

        // Draw first
        fireEvent.mouseDown(stage, { clientX: 60, clientY: 60 });
        fireEvent.mouseMove(stage, { clientX: 120, clientY: 120 });
        fireEvent.mouseUp(stage);

        // Erase
        const eraserBtn = getByTitle('Eraser');
        fireEvent.click(eraserBtn);
        fireEvent.mouseDown(stage, { clientX: 90, clientY: 90 });
        fireEvent.mouseMove(stage, { clientX: 100, clientY: 100 });
        fireEvent.mouseUp(stage);
    });

    it('performs undo/redo after multiple lines drawn', () => {
        const { getByTitle } = render(<App />);
        const penBtn = getByTitle('Pen');
        fireEvent.click(penBtn);
    
        const stage = document.querySelector('canvas');
        if (!stage) throw new Error('Stage not found');
    
        // Draw 3 lines
        for (let i = 0; i < 3; i++) {
          fireEvent.mouseDown(stage, { clientX: 50 + i * 10, clientY: 50 });
          fireEvent.mouseMove(stage, { clientX: 100 + i * 10, clientY: 100 });
          fireEvent.mouseUp(stage);
        }
    
        const undoBtn = getByTitle('Undo');
        fireEvent.click(undoBtn);
        fireEvent.click(undoBtn);
    
        const redoBtn = getByTitle('Redo');
        fireEvent.click(redoBtn);
        fireEvent.click(redoBtn);
    });

    it('clicks Export as Image after popup appears', () => {
        const { getByTitle, getByText } = render(<App />);
        const selectBtn = getByTitle('Select');
        fireEvent.click(selectBtn);
    
        const stage = document.querySelector('canvas');
        if (!stage) throw new Error('Stage not found');
    
        // simulate select drag area
        fireEvent.mouseDown(stage, { clientX: 100, clientY: 100 });
        fireEvent.mouseMove(stage, { clientX: 200, clientY: 200 });
        fireEvent.mouseUp(stage);
    
        const exportBtn = getByText('Export as Image');
        fireEvent.click(exportBtn);
    });
});
