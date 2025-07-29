import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

const ThemeToggleButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme} 
            className="btn-icon"
            style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: '1000' }}
            aria-label="Toggle theme"
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
};

export default ThemeToggleButton;