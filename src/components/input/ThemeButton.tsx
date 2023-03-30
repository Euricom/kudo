import React, { useEffect, useState, type ChangeEvent } from "react";


const ThemeButton = () => {
    const [theme, setTheme] = useState(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches? 'euricomDark' : 'euricom');
    const toggleTheme = (e: ChangeEvent<HTMLInputElement>) => {
        setTheme(e.target?.checked ? 'euricomDark' : 'euricom');
    };
    // initially set the theme and "listen" for changes to apply them to the HTML tag
    useEffect(() => {
        document.querySelector('html')?.setAttribute('data-theme', theme);
        document.querySelector('html')?.setAttribute('class', theme === 'euricomDark' ? 'dark' : '');
    }, [theme]);

    return (
        <>
            <label className="label cursor-pointer">
                <span className="label-text">Darkmode</span>
                <input type="checkbox" className="toggle" onChange={toggleTheme} checked={theme === 'euricomDark'}/>
            </label>
        </>
    );
}

export default ThemeButton;