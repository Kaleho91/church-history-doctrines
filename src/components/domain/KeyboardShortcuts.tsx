'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X } from 'lucide-react';

const shortcuts = [
    { key: '?', description: 'Show keyboard shortcuts' },
    { key: 'ESC', description: 'Close drawer or modal' },
    { key: '1-6', description: 'Switch theological lenses' },
    { key: '/', description: 'Focus search' },
    { key: '←/→', description: 'Navigate between claims' },
];

export function KeyboardShortcuts() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Show shortcuts with ?
            if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setIsOpen(true);
            }
            // Close with ESC
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <>
            {/* Floating hint button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-stone-200 hover:shadow-xl transition-all hover:scale-105"
                aria-label="Show keyboard shortcuts"
            >
                <Command className="w-5 h-5 text-stone-700" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900">Keyboard Shortcuts</h3>
                                    <p className="text-sm text-stone-500 mt-1">Navigate faster with these commands</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-stone-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-stone-500" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {shortcuts.map((shortcut, i) => (
                                    <div key={i} className="flex items-center justify-between py-2">
                                        <span className="text-sm text-stone-600">{shortcut.description}</span>
                                        <kbd className="px-2 py-1 text-xs font-mono font-bold bg-stone-100 border border-stone-300 rounded shadow-sm">
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-stone-100">
                                <p className="text-xs text-stone-400 text-center">
                                    Press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] font-mono">?</kbd> anytime to toggle
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
