import React from 'react';

interface HeaderProps {
    title?: string;
}

const Header = (props:HeaderProps) => {
    return (
        <header>
            <h1>Application Title</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/flights">Flights</a></li>
                    <li><a href="/about">About</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;