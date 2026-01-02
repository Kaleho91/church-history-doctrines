'use client';

import dynamic from 'next/dynamic';

// Dynamic imports with ssr: false are allowed in Client Components
const FontSizeControl = dynamic(
    () => import('@/components/FontSizeControl').then(mod => mod.FontSizeControl),
    { ssr: false }
);

const AskFAB = dynamic(
    () => import('@/components/ask/AskFAB'),
    { ssr: false }
);

export default function ClientControls() {
    return (
        <>
            <FontSizeControl />
            <AskFAB />
        </>
    );
}
