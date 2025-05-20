import React from 'react';
import Editable from 'react-contenteditable';

export const EditableText = ({
    children,
    editable = false,
    onChange = () => { },
    placeholder = 'Text here...',
    ...props
}: any) => {
    const isEmpty = !children || children === '<br>' || children.trim() === '';

    return (
        <>
            {editable ? (
                <div style={{ position: 'relative' }}>
                    {/* Placeholder simulado */}
                    {isEmpty && (
                        <span
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                padding: props.style.padding ?? '4px',
                                pointerEvents: 'none',
                                color: 'var(--placeholder)',
                                opacity: 0.6,
                                ...props.placeholderStyle
                            }}
                        >
                            {placeholder}
                        </span>
                    )}
                    <Editable
                        style={{
                            border: '2px dashed var(--blue8)',
                            padding: '4px',
                            minHeight: '24px',
                        }}
                        html={children}
                        onChange={onChange}
                        {...props}
                    />
                </div>
            ) : (
                children
            )}
        </>
    );
};


export const ContentEditable = ({ ...props }: any) => <Editable
    style={{ border: '2px dashed var(--blue8)' }}
    {...props}
/>