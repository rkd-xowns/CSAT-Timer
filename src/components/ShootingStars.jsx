import React from 'react';

const ShootingStars = () => {
    return (
        <div className="shooting-stars-container">
            {[...Array(7)].map((_, i) => (
                <span key={i}></span>
            ))}
        </div>
    );
};

export default ShootingStars;