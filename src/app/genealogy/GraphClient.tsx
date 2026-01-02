'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import GenealogyGraph from '@/components/viz/GenealogyGraph';

// Import data directly (in a real app, this might come from an API or Context)
import nodesData from '@/content/nodes.json';
import edgesData from '@/content/edges.json';

export default function GraphClient() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    // Memoize data to prevent re-parsing
    const graphData = useMemo(() => {
        // We need to clone to avoid mutating the original JSON during d3 simulation
        return {
            nodes: nodesData.map(node => ({ ...node })),
            links: edgesData.map(edge => ({ ...edge }))
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-[#faf8f5] overflow-hidden">
            {/* Header overlay */}
            <header className="absolute top-0 left-0 right-0 z-10 p-6 pointer-events-none">
                <div className="max-w-7xl mx-auto flex items-start justify-between">
                    <div className="pointer-events-auto">
                        <Link href="/" className="group flex items-center gap-2 text-[#8b7355] hover:text-[#5c4d3c] transition-colors mb-2">
                            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                            <span className="font-serif font-medium">Return to Library</span>
                        </Link>
                        <h1 className="text-4xl font-serif text-[#2c261e]">Genealogy of Belief</h1>
                        <p className="text-[#6b6358] max-w-md mt-2 text-sm leading-relaxed">
                            Trace the intellectual and spiritual lineage of the church.
                            <span className="block mt-1 text-[#8b7355]">Drag nodes to explore connections.</span>
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Graph Visualization */}
            <div className="absolute inset-0 z-0">
                <GenealogyGraph
                    data={graphData}
                    onNodeClick={(node) => setSelectedNode(node.id)}
                />
            </div>

            {/* Selected Node Inspector (Overlay) */}
            {selectedNode && (
                <div className="absolute right-6 top-6 bottom-6 w-96 bg-white/95 backdrop-blur-md border-l border-[#e8e4dc] shadow-2xl z-20 p-8 overflow-y-auto transform transition-transform duration-300 ease-out animate-fade-in-right rounded-2xl">
                    <button
                        onClick={() => setSelectedNode(null)}
                        className="absolute top-4 right-4 text-[#9a9285] hover:text-[#5c5346]"
                    >
                        ✕
                    </button>
                    <div className="mt-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#9a9285] mb-2 block">
                            Selected Node
                        </span>
                        <h2 className="text-3xl font-serif text-[#2c261e] mb-4">
                            {nodesData.find(n => n.id === selectedNode)?.label || selectedNode}
                        </h2>
                        <div className="prose prose-stone prose-sm">
                            <p>
                                {nodesData.find(n => n.id === selectedNode)?.description || "No description available."}
                            </p>
                        </div>

                        <Link
                            href={`/node/${selectedNode}`} // Assuming we have node pages or trace rail integration
                            className="mt-8 block w-full text-center py-3 border border-[#8b7355] text-[#8b7355] font-medium hover:bg-[#8b7355] hover:text-white transition-all rounded-lg uppercase tracking-widest text-xs"
                        >
                            View Full Trace
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
