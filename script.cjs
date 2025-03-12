const { JOKERS } = require("./src/jokers.ts");

const fs = require("fs");

const newJokers = JOKERS.map((joker) => {
  const { Name, Appearance, Type, Rarity, Cost, Effect } = joker;

  return {
    name: Name,
    url: `/jokers-wiki-fandom/${Name.split(" ").join("_")}.png`,
    rarity: Rarity,
    cost: Cost,
    effect: Effect,
  };
});

fs.writeFile(
  "./src/newJokers.json",
  JSON.stringify(newJokers, null, 2),
  (err) => {
    if (err) throw err;
    console.log("newJokers.json has been saved!");
  },
);
