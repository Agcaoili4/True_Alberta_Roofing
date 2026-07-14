import type {ReactNode} from 'react';

// Chip component to display a small label or tag
export function Chip ({ children }: { children: ReactNode}){
    return (
        <span className ="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-mist border border-line rounded-full px-3 py-1">
            {children}
        </span>
    );
}