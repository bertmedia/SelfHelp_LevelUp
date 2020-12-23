import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const LoginForm = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const submit = e => {
        e.preventDefault();

        Meteor.loginWithPassword(userName, password);
    };

    return(
        <form onSubmit={submit} className="login-form">
            <label htmlFor="username">Username</label>
            <input type="text" placeholder="Username"
                name="username" required onChange={e => setUserName(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type="password" placeholder="***" 
                name="password" required onChange={e => setPassword(e.target.value)} />

            <button type="submit">Sign In</button>
        </form>
    );
};