'use client';

import { useEffect, useRef, useState } from 'react';
import ForceGraph2D, { ForceGraphMethods } from 'react-force-graph-2d';

interface Node {
    id: string;
    label: string;
    type: 'person' | 'council' | 'document' | 'concept';
    era: string;
    description?: string;
    // d3 simulation properties
    x?: number;
    y?: number;
    val?: number; // Relative importance/size
    color?: string;
}

interface Link {
    source: string | Node;
    target: string | Node;
    type?: 'supports' | 'opposes' | 'evolves_into';
    value?: number;
}

interface GenealogyGraphProps {
    data: {
        nodes: any[];
        links: any[];
    };
    onNodeClick?: (node: Node) => void;
}

export default function GenealogyGraph({ data, onNodeClick }: GenealogyGraphProps) {
    const graphRef = useRef<ForceGraphMethods>();
    const [mountDimensions, setMountDimensions] = useState({ w: 800, h: 600 });

    // Resize handler
    useEffect(() => {
        const updateDims = () => {
            setMountDimensions({
                w: window.innerWidth,
                h: window.innerHeight
            });
        };

        window.addEventListener('resize', updateDims);
        updateDims(); // Initial

        return () => window.removeEventListener('resize', updateDims);
    }, []);

    // Custom Node Painting
    const paintNode = (node: Node, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const { x, y } = node;
        if (x === undefined || y === undefined) return;

        // Base size logic
        const baseR = 6;
        const radius = node.val ? baseR + node.val : baseR;

        // Draw "Manuscript Seal" background
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#fffaf5'; // Paper white
        ctx.fill();

        // Draw Border
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1.5 / globalScale;
        ctx.strokeStyle = getTypeColor(node.type);
        ctx.stroke();

        // Draw Inner Ring (Seal effect)
        ctx.beginPath();
        ctx.arc(x, y, radius - (2 / globalScale), 0, 2 * Math.PI, false);
        ctx.lineWidth = 0.5 / globalScale;
        ctx.strokeStyle = getTypeColor(node.type);
        ctx.stroke();

        // Draw Label (only if zoomed in or hovered - simple logic for now: always draw if specific scal)
        if (globalScale > 1.2) {
            const label = node.label;
            const fontSize = 12 / globalScale;
            ctx.font = `600 ${fontSize}px Serif`; // Manuscript font
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#2c261e';
            ctx.fillText(label, x, y + radius + (8 / globalScale));
        }
    };

    // Helper for colors
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'person': return '#8b7355'; // Brown/Gold
            case 'council': return '#7c3aed'; // Purple
            case 'document': return '#0288d1'; // Blue
            case 'concept': return '#d97706'; // Dark Gold
            default: return '#9a9285'; // Grey
        }
    };

    return (
        <ForceGraph2D
            ref={graphRef}
            width={mountDimensions.w}
            height={mountDimensions.h}
            graphData={data}
            nodeLabel="label"
            nodeRelSize={6}
            nodeCanvasObject={paintNode as any} // Typing fix for custom painter
            nodeCanvasObjectMode={() => "after"} // Draw custom on top of default collision circle if needed, or replace

            // Link styling
            linkColor={(link: any) => link.type === 'opposes' ? '#ef4444' : '#d4af37'} // Red for conflict, Gold for support
            linkWidth={link => link.type === 'major' ? 2 : 1}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.005}
            linkDirectionalParticleWidth={2}

            // Interaction
            onNodeClick={(node: any) => {
                graphRef.current?.centerAt(node.x, node.y, 1000);
                graphRef.current?.zoom(4, 2000);
                onNodeClick && onNodeClick(node);
            }}

            // Physics
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}

            // Container style
            extraRenderers={[]} // Empty array to satisfy type if needed
        />
    );
}
