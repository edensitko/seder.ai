declare module 'react-tagcloud' {
  import React from 'react';
  
  export interface TagCloudProps {
    tags: Array<{ value: string; count: number; color?: string }>;
    minSize: number;
    maxSize: number;
    onClick?: (tag: { value: string }) => void;
    renderer?: (tag: { value: string }, size: number) => React.ReactNode;
  }

  export const TagCloud: React.ComponentType<TagCloudProps>;
}
