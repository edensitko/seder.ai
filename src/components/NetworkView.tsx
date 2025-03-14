import React, { useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { SavedThought } from './ThoughtTabs';

interface NetworkViewProps {
  thoughts: SavedThought[];
  onSelectThought: (id: string) => void;
}

interface Node {
  id: string;
  name: string;
  val: number;
  type: 'thought' | 'theme';
  color?: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

export default function NetworkView({ thoughts, onSelectThought }: NetworkViewProps) {
  // יצירת נודים וקישורים לגרף
  const nodes: Node[] = [];
  const links: Link[] = [];
  const themes = new Set<string>();

  // הוסף נודים עבור כל המחשבות
  thoughts.forEach(thought => {
    nodes.push({
      id: thought.id,
      name: thought.text.substring(0, 30) + (thought.text.length > 30 ? '...' : ''),
      val: 1,
      type: 'thought',
      color: '#7c3aed'
    });

    // הוסף נודים וקישורים עבור התגיות
    thought.analysis.themes.forEach(theme => {
      if (!themes.has(theme)) {
        themes.add(theme);
        nodes.push({
          id: `theme-${theme}`,
          name: theme,
          val: 2,
          type: 'theme',
          color: '#a78bfa'
        });
      }

      links.push({
        source: thought.id,
        target: `theme-${theme}`,
        value: 1
      });
    });
  });

  const handleNodeClick = useCallback((node: Node) => {
    if (node.type === 'thought') {
      onSelectThought(node.id);
    }
  }, [onSelectThought]);

  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-medium mb-6 text-center">רשת קשרים בין מחשבות ונושאים</h3>
      <div className="h-[600px] border rounded-lg overflow-hidden">
        <ForceGraph2D
          graphData={{ nodes, links }}
          nodeLabel="name"
          nodeColor={(node: any) => node.color}
          nodeVal={(node: any) => node.val * 2}
          linkColor={() => '#e5e7eb'}
          linkWidth={1}
          onNodeClick={handleNodeClick}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 14 / globalScale;
            ctx.font = `${fontSize}px Arial`;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#374151';
            ctx.fillText(label, node.x, node.y + 10);
          }}
        />
      </div>
    </div>
  );
}
