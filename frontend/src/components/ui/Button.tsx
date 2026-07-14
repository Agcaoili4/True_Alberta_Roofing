import type { ReactNode, HTMLAttributes} from 'react';

type ButtonProps ={
    // ? for optional
    href?: string;
    variant?: 'primary' | 'ghost';
    className?: string;
    children: ReactNode;
} & HTMLAttributes<HTMLElement>;

const base = 'inline-flex items-center gap-2 font-head font-bold rounded-lg px-5 py-3 min-h-[44px] cursor-pointer transition-colors';
const variants ={
    primary: 'bg-steel text-white hover:bg-steel-dark',
    ghost: 'border border-line text-ink hover:bg-mist',
};

export function Button({ href, variant = 'primary', className ='', children, ...rest}: ButtonProps) {
    const classes = `${base} ${variants[variant]} ${className}`.trim();
    // If href is set, return an <a href={href} className={classes} {...rest}>{children}</a>
    if (href) {
        return <a href={href} className={classes} {...rest}>{children}</a>
    }else{
        return <button className={classes} {...rest}>{children}</button>
    }
}