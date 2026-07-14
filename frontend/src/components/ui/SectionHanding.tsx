import type { ReactNode} from 'react';

// SectionHeading component to display a section with a heading and optional content
// Type handles eyebrow, title, sub, and center alignment for the section
type SectionHeadingProps = {
    eyebrow?: string;
    title: ReactNode;
    sub?: string;
    center?: boolean;
};

export function SectionHeading({ eyebrow, title, sub, center  = false }: SectionHeadingProps){
    return (
        <div className ={center ? 'text-center msc-w-2xl mx-auto' : ''}>
            { eyebrow && (
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-steel mb-3">{eyebrow}</p>
            )}
            <h2 className="text-3xl md:text-4xl font-extrabold text-ink">{title}</h2>
            { sub && <p className="mt-3 text-body">{sub}</p> }
        </div>
    );
}