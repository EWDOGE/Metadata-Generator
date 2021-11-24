const layersOrder = [
    { name: 'Background', number: 4 },
    { name: 'Fur', number:27 },
    { name: 'Body', number: 1 },
    { name: 'Mouth', number: 23 },
    { name: 'Eyes', number: 35 },
    { name: 'Suit', number: 50 },
    { name: 'Headwear', number: 28 },
];
  
const format = {
    width: 3000,
    height: 3000
};

const rarity = [
    { key: "", val: "Common" },
    { key: "_r", val: "Rare" },
    { key: "_sr", val: "Super Rare" },
];

const defaultEdition = 0;

module.exports = { layersOrder, format, rarity, defaultEdition };