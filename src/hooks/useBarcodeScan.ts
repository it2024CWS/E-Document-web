import { useEffect, useRef } from 'react';

interface UseBarcodeScanOptions {
    onScan: (code: string) => void;
    minLength?: number;
    // Barcode scanners emit chars much faster than humans type (~10ms/char).
    // maxGapMs is the threshold above which we treat input as a new sequence.
    maxGapMs?: number;
    enabled?: boolean;
}

export const useBarcodeScan = ({
    onScan,
    minLength = 4,
    maxGapMs = 50,
    enabled = true,
}: UseBarcodeScanOptions) => {
    const bufferRef = useRef('');
    const lastKeyTimeRef = useRef(0);
    const onScanRef = useRef(onScan);
    onScanRef.current = onScan;

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const tag = target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable) return;

            const now = Date.now();
            if (now - lastKeyTimeRef.current > maxGapMs && bufferRef.current.length > 0) {
                bufferRef.current = '';
            }
            lastKeyTimeRef.current = now;

            if (e.key === 'Enter') {
                const code = bufferRef.current.trim();
                if (code.length >= minLength) {
                    onScanRef.current(code);
                }
                bufferRef.current = '';
                return;
            }

            if (e.key.length === 1) {
                bufferRef.current += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [enabled, minLength, maxGapMs]);
};
