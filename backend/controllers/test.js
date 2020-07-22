const trianglify = require('trianglify')
const fs = require('fs')

exports.genThumbnails = () => {
  image('patate', 512, 512);
}

function image (mood, width, height) {
  const canvas = trianglify({
    seed: mood,
    width,
    height
  }).toCanvas()

  const file = fs.createWriteStream('trianglify.png')
  canvas.createPNGStream().pipe(file)
}

/*
 * Write a potentially long text centered on a canvas 2d context
 */
function wrapText(context, text, x, y, lineWidth, desiredLineHeight, totalHeight) {
  const lines = [];
  const words = text.split(' ');

  // Generating displayed lines
  for (let n = 0; n < words.length; n++) {
    const line = words[n];

    let metrics = context.measureText(line);
    if (metrics.width > lineWidth) {
      const middle = line.length / 2
      lines.push(line.slice(0, middle) + '-');
      lines.push(line.slice(middle));
    } else {
      let multiLine = line + ' ' + words[n + 1];
      metrics = context.measureText(multiLine);
      if (metrics.width < lineWidth && n < words.length) {
        lines.push(multiLine);
        n++;
      } else {
        lines.push(line);
      }
    }
  }

  // Drawing text on canvas
  const isTooBig = lines.length * desiredLineHeight > totalHeight;
  const lineHeight = isTooBig ? lineWidth / lines.length : desiredLineHeight;
  context.font = `${lineHeight}px "GrenadierNF"`;

  for (let u = 0; u < lines.length; u++) {
    if (u === 0) {
      y -= (lineHeight / 2) * (lines.length - 1);
    } else if (u > 0) {
      y += lineHeight;
    }

    context.fillText(lines[u], x, y);
    context.strokeText(lines[u], x, y);
  }
}

require('make-runnable/custom')({ printOutputFrame: false });
