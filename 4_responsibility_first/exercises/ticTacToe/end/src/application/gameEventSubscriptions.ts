
import { GameState } from '../domain/gameState';
import { GameEvent } from '../domain/types';
import { GameEventCoordinator } from './gameEventCoordinator';

export interface GameEventSubscription {
  onEvent(event: GameEvent): void;
}

// Controller (event-based) - level 3 (because it's pure)
export class GameEventSubscriptions implements GameEventSubscription {

  constructor(private state: GameState, private eventBus: GameEventCoordinator) {
    // We can just subscribe to all events
    this.eventBus.addObserver(this);
  }

  // On any event that occurred, let's apply it to the game state
  onEvent(event: GameEvent): void {
    this.state.applyEvent(event);
  }
} 