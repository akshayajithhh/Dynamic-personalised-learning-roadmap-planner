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
    className = '',
    style,
    ...rest
}) => {
    const mergedClassName = `btn btn-${variant} btn-${size} ${className}`.trim();

    if (to) {
        return (
            <Link to={to} style={style} className={mergedClassName} {...rest}>
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
            className={mergedClassName}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;
