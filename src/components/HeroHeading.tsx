import type { CSSProperties } from 'react';

export function HeroHeading({ title, level = 1, style }: { title: string; level?: 1 | 2; style?: CSSProperties }) {
  const words = title.trim().split(/\s+/);
  const accent = words.length > 1 ? words.pop() : '';
  const lead = words.join(' ') || title;
  const content = <>{lead}{accent && <><br /><em>{accent}</em></>}</>;

  return level === 1 ? <h1 style={style}>{content}</h1> : <h2 style={style}>{content}</h2>;
}
