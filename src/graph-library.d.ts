declare module 'react-d3-graph' {
  import type { ComponentType } from 'react';
  export const Graph: ComponentType<{
    id: string;
    data: { nodes: Array<{id: string; name: string; x: number; y: number; color: string; symbolType: string}>; links: Array<{source:string;target:string;color:string}> };
    config: Record<string, unknown>;
  }>;
}
