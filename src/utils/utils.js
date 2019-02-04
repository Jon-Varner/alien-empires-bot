/* the game always uses a single 10-sided die */
export function rollDie() {
  return Math.floor(Math.random() * Math.floor(11)) + 1;
}

export function pluralize(word, count) {
  if (count > 1) {
    return word + 's';
  } else {
    return word;
  }
}
