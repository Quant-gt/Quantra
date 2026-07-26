import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

// Quick helper to extract all text strings from the tree
const extractText = (node) => {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && node.children) return extractText(node.children);
  return '';
};

describe('App', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    const fullText = extractText(tree);
    
    expect(fullText.includes('SIGMASPIRE Mobile')).toBeTruthy();
    expect(fullText.includes('Deployment Monitor')).toBeTruthy();
    expect(fullText.includes('MASTER KILL ALL')).toBeTruthy();
    expect(fullText.includes('Nifty Options Scalper')).toBeTruthy();
  });
});
