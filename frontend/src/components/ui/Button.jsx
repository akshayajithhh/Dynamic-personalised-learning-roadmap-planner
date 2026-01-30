import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    to,
    onClick,
    type = 'button',
    disabled = false,
    className = ''
}) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1,
        fontFamily: 'var(--font-heading)',
        border: 'none',
        outline: 'none',
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary-blue)',
            color: 'var(--text-white)',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
        },
        secondary: {
            backgroundColor: 'var(--secondary-black)',
            color: 'var(--text-white)',
        },
        outline: {
            backgroundColor: 'transparent',
            border: '2px solid var(--primary-blue)',
            color: 'var(--primary-blue)',
        },
        danger: {
            backgroundColor: 'var(--danger)',
            color: 'var(--text-white)',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-dark)',
        }
    };

    const sizes = {
        sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    };

    const style = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
    };

    if (to) {
        return (
            <Link to={to} style={style} className={className}>
                {children}
            </Link>
        );
    }

    return (
        <button
            type={type}
            style={style}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    );
};

export default Button;
