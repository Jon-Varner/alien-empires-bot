export const checkForFleets = aliens => {
  const allFleets = [];

  aliens.forEach(alien => {
    const fleets = [...alien.fleets];

    fleets.forEach(fleet => {
      if (fleet.encountered === false) {
        allFleets.push({
          color: alien.color,
          alienId: alien.id,
          fleetId: fleet.id
        });
      }
    });
  });

  if (allFleets.length > 0) {
    return true;
  }

  return false;
};
