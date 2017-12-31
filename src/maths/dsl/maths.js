import ohm from 'ohm-js';
import fs from 'fs';

const grammar = ohm.grammar(
  fs.readFileSync(__dirname + '/maths.ohm')
);

const semantics = grammar.createSemantics()
  .addAttribute('js', {
    ExpList: function (es) {
      return es.children.map(e => e.js).join(';\n') + ';';
    },
    Exp: function (e) {
      return e.js;
    },
    Assign_func: function (name, args, _, right) {
      return `const ${name.js} = (${args.js}) => ${right.js}`;
    },
    Assign_const: function (name, _, val) {
      return `const ${name.js} = ${val.js}`;
    },
    LVar: function (e) {
      return e.js;
    },
    LVar_func: function (name, args) {
      return `${name.js}(${args.js})`;
    },
    LVar_name: function (name) {
      return name.js;
    },
    ArgList: function (_lparen, head, _commas, tail, _rparen) {
      return `${[head, ...tail.children].map(e => e.js).join(', ')}`;
    },
    Vect: function (_lparen, head, _commas, tail, _rparen) {
      return `[${[head, ...tail.children].map(e => e.js).join(', ')}]`;
    },
    Add: function (e) {
      return e.js;
    },
    Add_plus: function (left, op, right) {
      return `${left.js} + ${right.js}`;
    },
    Add_minus: function (left, op, right) {
      return `${left.js} - ${right.js}`;
    },
    Mul: function (e) {
      return e.js;
    },
    Mul_times: function (left, op, right) {
      return `${left.js} * ${right.js}`;
    },
    Mul_divide: function (left, op, right) {
      return `${left.js} / ${right.js}`;
    },
    Pow: function (left, op, right) {
      return `Math.pow(${left.js}, ${right.js})`;
    },
    Paren_paren: function (open, exp, close) {
      return exp.js;
    },
    ident: function (firstChar, restChars) {
      return this.sourceString;
    },
    number: function (chars) {
      return this.sourceString;
    },
  });

const app = fs.readFileSync(__dirname + '/../app/circle.maths');

const match = grammar.match(app);
const js = semantics(match).js;
console.log(js);