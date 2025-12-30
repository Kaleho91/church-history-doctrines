'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchContent } from '@/lib/data';
import Link from 'next/link';

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ claims: any[], nodes: any[] }>({ claims: [], nodes: [] });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (query.length > 1) {
            const res = searchContent(query);
            setResults(res);
            setIsOpen(true);
        } else {
            setResults({ claims: [], nodes: [] });
            setIsOpen(false);
        }
    }, [query]);

    return (
        <div className="relative w-full max-w-xl">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all"
                    placeholder="Search doctrines, claims, or historical figures..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setIsOpen(true)}
                />
            </div>

            {isOpen && (results.claims.length > 0 || results.nodes.length > 0) && (
                <div
                    className="absolute mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-100 max-h-96 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    {results.claims.length > 0 && (
                        <div className="p-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Claims</h4>
                            <ul>
                                {results.claims.map(claim => (
                                    <li key={claim.id}>
                                        <Link
                                            href={`/claim/${claim.id}`}
                                            className="block px-3 py-2 hover:bg-slate-50 rounded-lg group"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="font-semibold text-slate-800 group-hover:text-blue-600">{claim.short_label}</div>
                                            <div className="text-xs text-slate-500 truncate">{claim.cluster}</div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {results.nodes.length > 0 && (
                        <div className="p-2 border-t border-slate-100">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Historical Nodes</h4>
                            <ul>
                                {results.nodes.map(node => (
                                    <li key={node.id} className="px-3 py-2 text-sm text-slate-600">
                                        <span className="font-medium text-slate-800">{node.title}</span> <span className="text-slate-400">• {node.date_range}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
