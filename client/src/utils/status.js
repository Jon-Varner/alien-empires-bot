export const checkForFleets = aliens => {
  const allFleets = [];

  aliens.forEach(alien => {
    const fleets = [...alien.fleets];

    allFleets.push(...fleets);
  });

  const unencountered = allFleets.some(fleet => fleet.encountered === false);

  if (unencountered) return true;

  return false;
};
