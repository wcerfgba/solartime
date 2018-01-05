const point = (theta) => [cos(theta), sin(theta)];
const theta = (i, n) => tau * i / n;

console.log(`The first point is ${point(0)}`);