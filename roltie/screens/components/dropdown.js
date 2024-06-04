import React, { useState } from 'react';
import {StyleSheet} from "react-native";
export default function Dropdown() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={styles.dropdown}>
            <button onClick={toggleDropdown} style={styles.toggle}>
                Select an option
            </button>
            {isOpen && (
                <ul style={styles.menu}>
                    <li style={styles.item}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = styles.itemHover.backgroundColor}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>
                        Option 1
                    </li>
                    <li style={styles.item}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = styles.itemHover.backgroundColor}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>
                        Option 2
                    </li>
                    <li style={styles.item}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = styles.itemHover.backgroundColor}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = ''}>
                        Option 3
                    </li>
                </ul>
            )}
        </div>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        position: 'relative',
        display: 'inline-block',
        width: '75%',
    },
    toggle: {
        backgroundColor: 'white',
        color: 'grey',
        cursor: 'pointer',
        fontSize: '16px',
        border: '1px solid #00C720',
        borderRadius: '5px',
        width: '100%',
        padding: '25px',
    },
    menu: {
        display: 'block',
        position: 'absolute',
        backgroundColor: 'white',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        zIndex: '1',
        marginTop: '5px',
        width: '100%',
        padding: '0',
        listStyleType: 'none',
        border: '1px solid #00C720',
        borderRadius: '5px',
    },
    item: {
        padding: '10px 20px',
        cursor: 'pointer',
        color: 'grey',
    },
    itemHover: {
        backgroundColor: '#00C720',
    },
});