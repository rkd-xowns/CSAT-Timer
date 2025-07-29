import React from 'react';
import { Link } from 'react-router-dom';
import ThemeSwitch from './ThemeSwitch.jsx';
import FeedbackButton from './FeedbackButton.jsx';

const GlobalControls = () => {
    return (
        <div className="global-controls-container">
            <ThemeSwitch />
        </div>
    );
};


export default GlobalControls;