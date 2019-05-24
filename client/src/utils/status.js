export const checkForFleets = aliens => {
  const allFleets = aliens.map(alien => [...alien.fleets]);

  const unencountered = allFleets.some(fleet => fleet.encountered === false);

  if (unencountered) return true;

  return false;
};
