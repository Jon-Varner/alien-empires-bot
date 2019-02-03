export function checkForFleets(aliens) {
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
}

export function checkForInvaded(aliens) {
  let invaded = false;

  aliens.forEach(alien => {
    if (alien.invaded) {
      invaded = true;
    }
  });

  return invaded;
}

export function checkForUninvaded(aliens) {
  let uninvaded = false;

  aliens.forEach(alien => {
    if (!alien.invaded) {
      uninvaded = true;
    }
  });

  return uninvaded;
}
