const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { layersOrder, format, rarity } = require("./config.js");
const fs = require("fs");
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

var edition = process.argv.slice(2);
var editionan = Number.parseInt(edition);

const buildDir = `${process.env.PWD}/testy`;
const metDataFile = edition +'.json';
const layersDir = `${process.env.PWD}/testy`;
const next = editionan + 1;
const blankMetDataFile = next + '.json';
const namelist = require('./names.json');


let metadata = [];
let attributes = [];
let hash = [];
let decodedHash = [];

const addRarity = _str => {
  let itemRarity;

  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });

  return itemRarity;
};

const cleanName = _str => {
  let name = _str.slice(0, -4).replace(/[0-9]/g, '');
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const getElements = path => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });
};

const layersSetup = layersOrder => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    number: layerObj.number
  }));

  return layers;
};

const buildSetup = () => {

};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(`${buildDir}/${_edition}.png`, _canvas.toBuffer("image/png"), { mode: 0o755 });
};

const addMetadata = _edition => {
  var rarityForEdition = [];
  var hashrate = [];
  var bonds = [];
  var randoname = namelist[Math.floor(Math.random() * namelist.length)];
  const randobando = Math.round(Math.random() * 100);
      if (randobando <= 100){rarityForEdition = "Common"; var hashrate = 2;}
      if (randobando <= 30){rarityForEdition = "Rare"; var hashrate = 4;}
      if (randobando <= 8){rarityForEdition = "Epic"; var hashrate = 8;}
      if (randobando <= 2){rarityForEdition = "Legendary"; var hashrate = 24;}
         console.log(randobando)
  let dateTime = Date.now();
  let tempMetadata = {
    name: randoname,
    description: 'A ' + rarityForEdition + ' EnergyWeb DOGE NFT.',
    external_url: "https://nft.ewd.green/" + _edition + ".png",
    image: "https://nft.ewd.green/" + _edition + ".png",
    booster: "50%",
    dice_roll: 'You rolled a ' + randobando + ' out of 100!',
    rarity: rarityForEdition,
    hashrate: hashrate,
    birthdate: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
  console.log("50% boost mint initiated with " + rarityForEdition + " rarity (#" + _edition + ")");
};

let blankmeta = {
  name: next,
  image: "https://nft.ewd.green/" + next + ".png",
};

const addAttributes = (_element, _layer) => {
  let tempAttr = {
    feature: _layer.name,
    genetics: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
};

const drawLayer = async (_layer, _edition) => {
  const rand = Math.random();
  let element =
    _layer.elements[Math.floor(rand * _layer.number)] ? _layer.elements[Math.floor(rand * _layer.number)] : null;
  if (element) {
    addAttributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);

    ctx.drawImage(
      image,
      _layer.position.x,
      _layer.position.y,
      _layer.size.width,
      _layer.size.height
    );
    saveLayer(canvas, _edition);
  }
};

const createFiles = edition => {
  const layers = layersSetup(layersOrder);

  for (let i = edition; i <= edition; i++) {
    layers.forEach((layer) => {
      drawLayer(layer, i);
    });
    addMetadata(i);
  }
};

const createMetaData = () => {
  fs.stat(`${buildDir}/${metDataFile}`, (err) => {
    if(err == null || err.code === 'ENOENT') {
		var newmeta = JSON.stringify(metadata,null, 2).slice(1,-1)
      fs.writeFileSync(`${buildDir}/${metDataFile}`, newmeta , { mode: 0o755 });
    } else {
        console.log('Oh no, error: ', err.code);
    }
  });
};

module.exports = { buildSetup, createFiles, createMetaData};
