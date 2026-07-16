import type { ReactNode } from 'react';

type ContainerProps ={
    children: ReactNode;
    className?: string;
};

// Container component to wrap content with max width and padding
export function Container({ children, className = ''}: ContainerProps){
    return (
        <div className={`mx-auto max-w-content px-6 md:px-10 ${className}`.trim()}>
            {children}
        </div>
    );
}