import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import CSS file for styling

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }
    }, []);

    const capitalizeName = (name) => {
        return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    return (
        <div className='profile-container'>
            <h1 className='profile-heading'>Name: {capitalizeName(user.name)}</h1>
            <h1 className='profile-heading'>Email : {user.email}</h1>
            <h1 className='profile-heading'>Location: USA</h1>
        </div>
    );
}

export default Profilescreen;
