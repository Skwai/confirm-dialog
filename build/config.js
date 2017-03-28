import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const { name, version, author, license } = require('../package.json');

const banner = 
`/*!
  * ${name} 
  * @version v${version} 
  * @author ${author}
  * @license ${license}
  */`;

export default {
  intro: '/* swag */',
  moduleName: 'plow',
  entry: 'src/index.js',
  plugins: [
    babel(),
    uglify({
      output: {
        comments(node, { value, type }) {
          if (type === "comment2") {
            return /@preserve|@license|@cc_on/i.test(value);
          }
        }
      }
    })
  ],
  format: 'cjs',
  dest: 'dist/index.min.js',
  banner
};