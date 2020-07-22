const config = require('config');
const dbConfig = require('../dbConfig.js');
const knex = require('knex')(dbConfig);
const trianglify = require('trianglify')
const fs = require('fs')
const { registerFont, createCanvas } = require('canvas');

/*
 * Generate thumbnails used in metadata for mediaSession
 */
exports.genThumbnails = async function () {
  registerFont( './../frontend/src/assets/fonts/GrenadierNF/Grenadier-NF.ttf', { family: "GrenadierNF" } );

  const moods = await getMoods();

  for (let i = 0; i < moods.length; i++) {
    await thumbnail(moods[i], 512, 512);
  }

  console.log("Thumbnails generated");
  process.exit(); // Giving back prompt to user
}

/*
 * DB query to get moods
 */
function getMoods () {
  return knex.select('genres.name').from('genres');
}

/*
 * Create thumbnail image with background images and mood name
 */
async function thumbnail (mood, width, height) {
  return new Promise (resolve => {
    // Exporting to canvas thumbnail background
    const canvas = trianglify({
      seed: mood.name,
      width: width,
      height: height,
    }).toCanvas();

    // Writing mood name on background
    const fontSize = 140;
    const context = canvas.getContext('2d');
    context.font = `${fontSize}px "GrenadierNF"`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = "white";
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    wrapText(
      context,
      mood.name,
      width / 2,
      height / 2,
      width,
      fontSize,
      height
    );

    // Writing file and resolving promise
    const filename = `tmp/thumbnails/${mood.name}-${height}x${width}.png`;
    const file = fs.createWriteStream(filename);
    canvas.createPNGStream().pipe(file);
    file.on('finish', resolve);
  })
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

  return true;
}

require('make-runnable/custom')({ printOutputFrame: false });
