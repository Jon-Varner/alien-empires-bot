/* the game always uses a single 10-sided die */
export const rollDie = (sides = 10) => {
  return Math.floor(Math.random() * sides) + 1;
};

export const pluralize = (word, count) => {
  /* No need for a full-featured library at this point, 
     since we know every word passed is a regular noun */

  if (count > 1) {
    return word + 's';
  } else {
    return word;
  }
};
