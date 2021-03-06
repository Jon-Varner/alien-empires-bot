import React from 'react';
import { rollDie } from './utils';

/* This giant functions are clearly ripe for refactoring. 
   It's long and imperative because it's a direct application 
   of instructions written out in a printed rule book. */
export const calculateAlienEconomy = (turn, player, aliens, cp) => {
  let instructions = [];
  let step = '';
  let fleetLaunchTarget = 0;
  let launchModifier = 0;
  let fleetLaunched = false;
  let raider = false;
  let currentRoll = 0;

  /* For each alien: */
  for (const alien of aliens) {
    /* Reset invasions */
    alien.invaded = false;
    alien.defended = false;

    /* Always add an econ roll on these turns */
    const addedRolls = [3, 6, 10, 15];
    if (addedRolls.includes(turn)) {
      alien.econRolls += 1;
    }

    /* See if an extra roll was added for this turn */
    if (alien.extraRollOnTurn.includes(turn)) {
      alien.econRolls += 1;
    }

    /* For each econ roll, allocate CPs according to the rules schedule */

    for (let i = 0; i < alien.econRolls; i++) {
      currentRoll = rollDie();

      switch (turn) {
        case 1:
          if (currentRoll < 3) {
            alien.extraRollOnTurn.push(4);
          } else {
            alien.techcp += cp;
          }
          break;
        case 2:
          if (currentRoll < 2) {
            alien.extraRollOnTurn.push(5);
          } else if (currentRoll < 4) {
            alien.fleetcp += cp;
          } else {
            alien.techcp += cp;
          }
          break;
        case 3:
          if (currentRoll < 2) {
            alien.extraRollOnTurn.push(6);
          } else if (currentRoll < 5) {
            alien.fleetcp += cp;
          } else if (currentRoll < 9) {
            alien.techcp += cp;
          } else {
            alien.defensecp += 2 * cp;
          }
          break;
        case 4:
          if (currentRoll < 2) {
            alien.extraRollOnTurn.push(7);
          } else if (currentRoll < 6) {
            alien.fleetcp += cp;
          } else if (currentRoll < 9) {
            alien.techcp += cp;
          } else {
            alien.defensecp += 2 * cp;
          }
          break;
        case 5:
          if (currentRoll < 2) {
            alien.extraRollOnTurn.push(8);
          } else if (currentRoll < 6) {
            alien.fleetcp += cp;
          } else if (currentRoll < 10) {
            alien.techcp += cp;
          } else {
            alien.defensecp += 2 * cp;
          }
          break;
        case 6:
          if (currentRoll < 2) {
            alien.extraRollOnTurn.push(9);
          } else if (currentRoll < 7) {
            alien.fleetcp += cp;
          } else if (currentRoll < 10) {
            alien.techcp += cp;
          } else {
            alien.defensecp += 2 * cp;
          }
          break;
        case 7:
        case 8:
        case 9:
          if (currentRoll < 6) {
            alien.fleetcp += cp;
          } else if (currentRoll < 10) {
            alien.techcp += cp;
          } else {
            alien.defensecp += 2 * cp;
          }
          break;
        case 10:
        case 11:
        case 12:
          if (currentRoll < 7) {
            alien.fleetcp += cp;
          } else if (currentRoll < 10) {
            alien.techcp += cp;
          } else {
            alien.defensecp += 2 * cp;
          }
          break;
        case 13:
        case 14:
          if (currentRoll < 7) {
            alien.fleetcp += cp;
          } else {
            alien.techcp += cp;
          }
          break;
        case 15:
        case 16:
          if (currentRoll < 8) {
            alien.fleetcp += cp;
          } else {
            alien.techcp += cp;
          }
          break;
        case 17:
        case 18:
          if (currentRoll < 9) {
            alien.fleetcp += cp;
          } else {
            alien.techcp += cp;
          }
          break;
        default:
          if (currentRoll < 10) {
            alien.fleetcp += cp;
          } else {
            alien.techcp += cp;
          }
      }
    }

    /* Don't attempt to launch a fleet unless the minimum CPs are available */

    if (alien.fleetcp > 5) {
      if (
        player.fighters > 0 &&
        player.pointDefense > alien.fighters &&
        alien.fleetcp > 24
      ) {
        launchModifier = 2;
      }

      if (
        alien.cloaking > 0 &&
        player.scanners < alien.cloaking &&
        alien.fleetcp > 11
      ) {
        launchModifier += 2;
        raider = true;
      }

      /* Find the target roll based on the current turn # */
      /* Past Turn 12, alternate between 3 and 10 */
      if (turn === 4 || turn === 9 || turn === 10) {
        fleetLaunchTarget = 5;
      } else if (turn > 5 && turn < 9) {
        fleetLaunchTarget = 4;
      } else if (turn === 5 || turn === 11 || turn === 12) {
        fleetLaunchTarget = 3;
      } else if (turn === 3 || turn % 2 === 0) {
        fleetLaunchTarget = 10;
      } else {
        fleetLaunchTarget = 3;
      }

      /* Subtract roll modifier */

      currentRoll = rollDie();
      currentRoll -= launchModifier;

      if (currentRoll <= fleetLaunchTarget) {
        /* Build a fleet of all affordable raiders or make the fleet's CP for later */

        const fleetID = alien.fleets.length + 1;

        if (raider) {
          let targetRaiders = Math.floor(alien.fleetcp / 12);
          let actualRaiders = 0;

          while (alien.fleetcp > 11 && targetRaiders > 0) {
            actualRaiders += 1;
            targetRaiders -= 1;
            alien.fleetcp -= 12;
          }

          alien.fleets.push({
            id: fleetID,
            cp: 0,
            encountered: false,
            raiders: actualRaiders
          });

          instructions.push(
            <li>
              <span className={alien.color}>{alien.color}</span> alien launches
              Fleet #{fleetID} of {actualRaiders} raiders.
            </li>
          );
        } else {
          alien.fleets.push({
            id: fleetID,
            cp: alien.fleetcp,
            encountered: false,
            raiders: 0,
            scouts: 0,
            destroyers: 0,
            cruisers: 0,
            battlecruisers: 0,
            battleships: 0,
            dreadnaughts: 0,
            carriers: 0,
            fighters: 0
          });

          alien.fleetcp = 0;

          instructions.push(
            <li>
              <span className={alien.color}>{alien.color}</span> alien launches
              Fleet #{fleetID}.
            </li>
          );
        }
        fleetLaunched = true;
      } else {
        instructions.push(
          <li>
            <span className={alien.color}>{alien.color}</span> alien does not
            launch a fleet.
          </li>
        );
      }
    } else {
      instructions.push(
        <li>
          <span className={alien.color}>{alien.color}</span> alien does not
          launch a fleet.
        </li>
      );
    }

    /* See if the alien will research movement tech */
    if (fleetLaunched) {
      if (alien.movement < 7) {
        currentRoll = rollDie();

        if (currentRoll < 5) {
          let targetMoveCP = 0;

          if (
            alien.movement === 1 ||
            alien.movement === 5 ||
            alien.movement === 6
          ) {
            targetMoveCP = 20;
          } else {
            targetMoveCP = 25;
          }

          if (alien.techcp > targetMoveCP) {
            alien.movement += 1;
            alien.techcp -= targetMoveCP;
          }
        }
      }
    }
  }

  if (fleetLaunched) {
    step = 'fleet encounters';
  } else {
    step = 'check for fleets';
  }

  return {
    instructions: instructions,
    aliens: aliens,
    step: step
  };
};
