const HanziWriter = require('./hanzi-writer');
const {TYPE, merge} = require('./default-option');
const {pickCnChar} = require('./util');
const {buildLinesStr} = require('./line');
const {stroke} = require('./stroke');
// window.w = HanziWriter.create('character-target-div', '你', {
//     width: 100,
//     height: 100,
//     padding: 5,
//     showOutline: true,
//     showCharacter: true,
//     strokeAnimationSpeed: 10
// });
// HanziWriter.loadCharacterData('是').then(function (charData) {
//     console.log(charData);
// });
let svg = (() => {
    return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
})();

{/* <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" id="grid-background-target">
  <line x1="0" y1="0" x2="100" y2="100" stroke="#DDD" />
  <line x1="100" y1="0" x2="0" y2="100" stroke="#DDD" />
  <line x1="50" y1="0" x2="50" y2="100" stroke="#DDD" />
  <line x1="0" y1="50" x2="100" y2="50" stroke="#DDD" />
</svg> */}
window.HanziWriter = HanziWriter;
class Writer {
    constructor ({
        el = 'cnchar-draw',
        text = '',
        type = TYPE.NORMAL,
        style = {},
        line = {},
        animation = {},
        stroke = {},
        test = {},
    }) {
        this.type = type;
        this.writers = [];
        this.text = text.split('');
        let opts = [style, line];
        switch (type) {
            case TYPE.ANIMATION: opts.push(animation); break;
            case TYPE.STROKE: opts.push(stroke); break;
            case TYPE.TEST: opts.push(test); break;
        }
        this.option = merge(opts);
        this.el = typeof el === 'string' ? document.getElementById(el) : el;
        if (!this.el) {
            this.el = document.createElement('div');
            document.body.appendChild(this.el);
        }
        this.init();
    }
    init () {
        let {lineHTML, border} = buildLinesStr(this.option);
        svg.setAttribute('width', this.option.width);
        svg.setAttribute('height', this.option.height);
        if (border) {
            svg.style.border = border;
        }
        let cloneSvg = () => {
            let node = svg.cloneNode();
            if (lineHTML)
                node.innerHTML = lineHTML;
            return node;
        };
        if (this.type === TYPE.STROKE) {
            stroke(this, cloneSvg);
        } else {
            this.text.forEach((v) => {
                let node = cloneSvg();
                this.writers.push(HanziWriter.create(node, v, this.option));
                this.el.appendChild(node);
            });

        }
    }
}

// eslint-disable-next-line no-unused-vars
module.exports = function draw (text = '', options = {}) {
    text = pickCnChar(text);
    if (!text) {
        throw new Error('Draw 方法text必须含有中文');
    }
    options.text = text;
    return new Writer(options);
};