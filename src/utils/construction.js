import React from 'react';
import { rollDie, pluralize } from './utils';

export function constructFleet(
  fleetType,
  currentAliens,
  currentAlien,
  currentPlayer,
  currentFleet,
  defenseInstructions
) {
  const aliens = currentAliens;
  const alien = currentAlien;
  const player = currentPlayer;

  let fleet = {};
  let instructions = [];
  let currentRoll = 0;
  let defensive = false;
  let step = '';

  if (fleetType === 'defensive') {
    defensive = true;

    const fleetID = alien.fleets.length + 1;

    fleet = {
      id: fleetID,
      cp: alien.fleetcp,
      encountered: true,
      raiders: 0,
      scouts: 0,
      destroyers: 0,
      cruisers: 0,
      battlecruisers: 0,
      battleships: 0,
      dreadnaughts: 0,
      carriers: 0,
      fighters: 0
    };

    alien.fleets.push(fleet);

    instructions = [...defenseInstructions];
  } else {
    fleet = currentFleet;
  }

  /* The following calculations and priorities are implementations of the scenario rules */
  if (player.fighters > 0 && alien.pointDefense === 0 && alien.techcp > 19) {
    alien.pointDefense += 1;
    alien.techcp -= 20;
  }

  if (player.mines > 0 && alien.minesweeper === 0 && alien.techcp > 9) {
    alien.minesweeper += 1;
    alien.techcp -= 10;
  }

  currentRoll = rollDie();

  while (
    player.cloaking > alien.scanners &&
    alien.techcp > 19 &&
    currentRoll < 5
  ) {
    alien.scanners += 1;
    alien.techcp -= 20;
  }

  currentRoll = rollDie();

  switch (alien.shipSize) {
    case 1:
      if (alien.techcp > 9) {
        alien.shipSize = 2;
        alien.techcp -= 10;
      }
      break;
    case 2:
      if (alien.techcp > 14 && currentRoll < 8) {
        alien.shipSize = 3;
        alien.techcp -= 15;
      }
      break;
    case 3:
      if (alien.techcp > 19 && currentRoll < 7) {
        alien.shipSize = 4;
        alien.techcp -= 20;
      }
      break;
    case 4:
      if (alien.techcp > 19 && currentRoll < 6) {
        alien.shipSize = 5;
        alien.techcp -= 20;
      }
      break;
    case 5:
      if (alien.techcp > 19 && currentRoll < 4) {
        alien.shipSize = 6;
        alien.techcp -= 20;
      }
      break;
    default:
    /* This should be impossible to reach */
  }

  currentRoll = rollDie();

  if (
    alien.fighters > 0 &&
    alien.techcp > 24 &&
    player.pointDefense === 0 &&
    currentRoll < 7
  ) {
    alien.fighters += 1;
    alien.techcp -= 25;
  }

  currentRoll = rollDie();

  if (
    fleet.raiders > 0 &&
    alien.cloaking < 2 &&
    alien.techcp > 29 &&
    currentRoll < 7
  ) {
    alien.cloaking = 2;
    alien.techcp -= 30;
  }

  if (alien.techcp > 9) {
    if (alien.techcp < 15 && alien.minesweeper < 2) {
      alien.minesweeper += 1;
      alien.techcp -= 10;
    } else if (alien.techcp < 20 && alien.attack > 1 && alien.defense > 1) {
      alien.tactics += 1;
      alien.techcp -= 15;
    } else {
      let techSelected = false;

      while (!techSelected) {
        currentRoll = rollDie();

        switch (currentRoll) {
          case 1:
          case 2:
            /* upgrade attack */
            if (alien.attack < 3) {
              let attackCost = 20;

              if (alien.attack === 1) {
                attackCost = 30;
              } else if (alien.attack === 2) {
                attackCost = 25;
              }

              if (alien.techcp >= attackCost) {
                alien.attack += 1;
                alien.techcp -= attackCost;
                techSelected = true;
              }
            }
            break;
          case 3:
          case 4:
            /* upgrade defense */
            if (alien.defense < 3) {
              let defenseCost = 20;

              if (alien.defense === 1) {
                defenseCost = 30;
              } else if (alien.defense === 2) {
                defenseCost = 25;
              }

              if (alien.techcp >= defenseCost) {
                alien.defense += 1;
                alien.techcp -= defenseCost;
                techSelected = true;
              }
            }
            break;
          case 5:
            /* upgrade attack to 2, then defense to 2, then tactics */
            if (alien.attack < 2) {
              let attackCost = 20;

              if (alien.attack === 1) {
                attackCost = 30;
              }

              if (alien.techcp >= attackCost) {
                alien.attack += 1;
                alien.techcp -= attackCost;
                techSelected = true;
              }
            } else if (alien.defense < 2) {
              let defenseCost = 20;

              if (alien.defense === 1) {
                defenseCost = 30;
              }

              if (alien.techcp >= defenseCost) {
                alien.defense += 1;
                alien.techcp -= defenseCost;
                techSelected = true;
              }
            } else if (alien.tactics < 3 && alien.techcp > 14) {
              alien.tactics += 1;
              alien.techcp -= 15;
              techSelected = true;
            }
            break;
          case 6:
            /* upgrade cloaking */
            if (
              alien.cloaking < 2 &&
              player.scanners < 2 &&
              alien.techcp > 29
            ) {
              alien.cloaking += 1;
              alien.techcp -= 30;
              techSelected = true;
            }
            break;
          case 7:
            /* upgrade scanners */
            if (alien.scanners < 2 && alien.techcp > 19) {
              alien.scanners += 1;
              alien.techcp -= 20;
              techSelected = true;
            }
            break;
          case 8:
            /* upgrade fighters */
            if (alien.fighters < 3 && alien.techcp > 24) {
              alien.fighters += 1;
              alien.techcp -= 25;
              techSelected = true;
            }
            break;
          case 9:
            /* upgrade point defense */
            if (alien.pointDefense < 3 && alien.techcp > 19) {
              alien.pointDefense += 1;
              alien.techcp -= 20;
              techSelected = true;
            }
            break;
          case 10:
            /* upgrade minesweeper */
            if (alien.minesweeper === 0 && alien.techcp > 9) {
              alien.minesweeper += 1;
              alien.techcp -= 10;
              techSelected = true;
            } else if (alien.minesweeper === 1 && alien.techcp > 14) {
              alien.minesweeper += 1;
              alien.techcp -= 15;
              techSelected = true;
            }
            break;
          default:
            /* This should be impossible to reach */
            techSelected = true;
        }
      }
    }
  }

  /* First attempt to build a fleet of carriers and fighters */
  currentRoll = rollDie();

  while (
    defensive === false &&
    fleet.cp > 27 &&
    alien.fighters > 0 &&
    (player.pointDefense === 0 || currentRoll < 5)
  ) {
    fleet.cp -= 27;
    fleet.carriers += 1;
    fleet.fighters += 3;
  }

  /* Next attempt to build a fleet of raiders */
  if (
    defensive === false &&
    fleet.carrier === false &&
    fleet.cp > 11 &&
    alien.cloaking > player.scanners
  ) {
    let targetRaiders = Math.floor(fleet.cp / 12);
    let actualRaiders = 0;

    while (fleet.cp > 11 && targetRaiders > 0) {
      actualRaiders += 1;
      targetRaiders -= 1;
      fleet.cp -= 12;
    }

    fleet.raiders += actualRaiders;

    /* Otherwise build a mixed fleet */
  } else if (fleet.raiders === 0) {
    /* Build the largest ship possible */
    if (alien.shipSize > 5 && fleet.cp > 23) {
      fleet.cp -= 24;
      fleet.dreadnaughts += 1;
    } else if (alien.shipSize > 4 && fleet.cp > 19) {
      fleet.cp -= 20;
      fleet.battleships += 1;
    } else if (alien.shipSize > 3 && fleet.cp > 14) {
      fleet.cp -= 15;
      fleet.battlecruisers += 1;
    } else if (alien.shipSize > 2 && fleet.cp > 11) {
      fleet.cp -= 12;
      fleet.cruisers += 1;
    } else if (alien.shipSize > 1 && fleet.cp > 8) {
      fleet.cp -= 9;
      fleet.destroyerBuilt = true;
      fleet.destroyers += 1;
    } else if (fleet.cp > 5) {
      fleet.cp -= 6;
      fleet.scouts += 1;
    }
  }

  if (fleet.raiders === 0) {
    /* Build a Destroyer, if needed */
    if (
      alien.scanners >= player.cloaking &&
      fleet.destroyerBuilt === false &&
      alien.shipSize > 1 &&
      fleet.cp > 8
    ) {
      fleet.cp -= 9;
      fleet.destroyerBuilt = true;
      fleet.destroyers += 1;
    }

    currentRoll = rollDie();

    /* Get minimal number of Scouts needed */
    if (
      player.fighters > 0 &&
      alien.pointDefense > 0 &&
      currentRoll - 2 > 3 &&
      fleet.carriers === 0 &&
      fleet.cp > 11
    ) {
      fleet.cp -= 12;
      fleet.scouts += 2;
    }

    if (currentRoll < 4) {
      /* Build the largest fleet possible */
      while (fleet.cp > 9) {
        fleet.cp -= 6;
        fleet.scouts += 1;
      }

      if (fleet.cp === 9) {
        fleet.cp -= 9;
        fleet.destroyers += 1;
      } else if (fleet.cp > 5) {
        fleet.cp -= 6;
        fleet.scouts += 1;
      }
    } else if (currentRoll < 7 && alien.attack < 3 && alien.defense < 3) {
      /* Build a "balanced" fleet. */
      if (alien.attack > 1 || alien.defense > 1) {
        /* Build the most cruisers but buy battlecruisers if affordable */
        if (alien.shipSize > 3) {
          while (fleet.cp > 14 && fleet.cp % 12 > 2) {
            fleet.cp -= 15;
            fleet.battlecruisers += 1;
          }
        }

        if (alien.shipSize > 2) {
          while (fleet.cp > 11) {
            fleet.cp -= 12;
            fleet.cruisers += 1;
          }
        }

        if (alien.shipSize > 1) {
          while (fleet.cp > 8) {
            fleet.cp -= 9;
            fleet.destroyerBuilt = true;
            fleet.destroyers += 1;
          }
        }

        while (fleet.cp > 5) {
          fleet.cp -= 6;
          fleet.scouts += 1;
        }
      } else {
        /* Build the most ships but buy destroyers if affordable */
        if (alien.shipSize > 1) {
          while (fleet.cp > 8 && fleet.cp % 6 > 2) {
            fleet.cp -= 9;
            fleet.destroyerBuilt = true;
            fleet.destroyers += 1;
          }
        }

        while (fleet.cp > 5) {
          fleet.cp -= 6;
          fleet.scouts += 1;
        }
      }
    } else {
      /* Build the largest ships possible */
      while (fleet.cp > 5) {
        if (alien.shipSize > 5 && fleet.cp > 23) {
          fleet.cp -= 24;
          fleet.dreadnaughts += 1;
        } else if (alien.shipSize > 4 && fleet.cp > 19) {
          fleet.cp -= 20;
          fleet.battleships += 1;
        } else if (alien.shipSize > 3 && fleet.cp > 14) {
          fleet.cp -= 15;
          fleet.battlecruisers += 1;
        } else if (alien.shipSize > 2 && fleet.cp > 11) {
          fleet.cp -= 12;
          fleet.cruisers += 1;
        } else if (alien.shipSize > 1 && fleet.cp > 8) {
          fleet.cp -= 9;
          fleet.destroyerBuilt = true;
          fleet.destroyers += 1;
        } else {
          fleet.cp -= 6;
          fleet.scouts += 1;
        }
      }
    }
  }

  /* Return any remaining fleet CP */
  alien.fleetcp += fleet.cp;
  fleet.cp = 0;

  /* Update alien with revised fleet info */
  const fleets = [...alien.fleets];
  let index = fleets.findIndex(item => item.id === fleet.id);
  fleets.splice(index, 1, fleet);
  alien.fleets = fleets;

  /* Update the alien in the aliens array and push it to Redux */
  index = aliens.findIndex(item => item.id === alien.id);
  aliens.splice(index, 1, alien);

  /* Collate the fleet construction instructions */
  if (fleet.raiders > 0) {
    instructions.push(
      <li>
        This is a fleet of {fleet.raiders} {pluralize('raider', fleet.raiders)}
      </li>
    );
  }

  if (fleet.carriers > 0) {
    instructions.push(
      <li>
        Add {fleet.carriers} {pluralize('carrier', fleet.carriers)}
      </li>
    );
  }

  if (fleet.fighters > 0) {
    instructions.push(
      <li>
        Add {fleet.fighters} {pluralize('fighter', fleet.fighters)}
      </li>
    );
  }

  if (fleet.dreadnaughts > 0) {
    instructions.push(
      <li>
        Add {fleet.dreadnaughts} {pluralize('dreadnaught', fleet.dreadnaughts)}
      </li>
    );
  }

  if (fleet.battleships > 0) {
    instructions.push(
      <li>
        Add {fleet.battleships} {pluralize('battleship', fleet.battleships)}
      </li>
    );
  }

  if (fleet.battlecruisers > 0) {
    instructions.push(
      <li>
        Add {fleet.battlecruisers}{' '}
        {pluralize('battlecruiser', fleet.battlecruisers)}
      </li>
    );
  }

  if (fleet.cruisers > 0) {
    instructions.push(
      <li>
        Add {fleet.cruisers} {pluralize('cruiser', fleet.cruisers)}
      </li>
    );
  }

  if (fleet.destroyers > 0) {
    instructions.push(
      <li>
        Add {fleet.destroyers} {pluralize('destroyer', fleet.destroyers)}
      </li>
    );
  }

  if (fleet.scouts > 0) {
    instructions.push(
      <li>
        Add {fleet.scouts} {pluralize('scout', fleet.scouts)}
      </li>
    );

    if (alien.minesweeper > 0) {
      instructions.push(<li>All Scouts in this fleet have minesweeping</li>);
    }
  }

  if (defensive) {
    step = 'homeworld defense construction';
  } else {
    step = 'fleet construction';
  }

  return {
    aliens: aliens,
    alien: alien,
    fleet: fleet,
    step: step,
    instructions: instructions
  };
}

export function constructDefenses(currentAliens, alienId) {
  const aliens = currentAliens;
  const instructions = [];
  let currentRoll = 0;

  /* Look up this alien ID and get its defensecp */
  const alien = aliens.find(alien => alien.id === alienId);

  alien.invaded = true;

  /* Only report new mines and bases to be added */
  alien.mines = 0;
  alien.bases = 0;

  /* Calculate defenses */
  currentRoll = rollDie();

  if (currentRoll < 4) {
    /* Just buy mines */
    while (alien.defensecp > 4) {
      alien.mines += 1;
      alien.defensecp -= 5;
    }
  } else if (currentRoll > 7) {
    /* Buy as many bases as possible, then mines */
    while (alien.defensecp > 11) {
      alien.bases += 1;
      alien.defensecp -= 12;
    }

    while (alien.defensecp > 4) {
      alien.mines += 1;
      alien.defensecp -= 5;
    }
  } else {
    /* Alternate bases and mines, then get mines until broke */
    let purchased = '';

    while (alien.defensecp > 11) {
      if (purchased === 'base') {
        alien.mines += 1;
        alien.defensecp -= 5;
        purchased = 'mine';
      } else {
        alien.bases += 1;
        alien.defensecp -= 12;
        purchased = 'base';
      }
    }

    while (alien.defensecp > 4) {
      alien.mines += 1;
      alien.defensecp -= 5;
    }
  }

  instructions.push(
    <li>
      Add {alien.bases} bases and {alien.mines} mines to the{' '}
      <span className={alien.color}>{alien.color}</span> homeworld.
    </li>
  );

  return {
    alien: alien,
    instructions: instructions
  };
}
