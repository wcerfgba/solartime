import fs from 'fs';
import transpile from '../../../tool/transpile.js';

describe('drawing.module/circle.maths -> js', () => {
  it('matches the fixture', () => {
    const expected = 
`const point = (theta) => [cos(theta), sin(theta)];
const theta = (i, n) => tau * i / n;`
    ;
    const actual = transpile('js', 'src/drawing.module/circle.maths');
    expect(expected).toEqual(actual);
  });
});
