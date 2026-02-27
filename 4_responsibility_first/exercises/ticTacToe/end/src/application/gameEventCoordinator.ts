import { GameEvent } from '../domain/types';
import { GameEvents } from '../domain/gameEvents';
import { GameEventSubscription } from './gameEventSubscriptions';

// Coordinator (coordinates) - level 3 (because it's pure)
export class GameEventCoordinator {
  private observers: GameEventSubscription[] = [];

  constructor(private gameEvents: GameEvents) {}

  addObserver(observer: GameEventSubscription) {
    this.observers.push(observer);
  }

  publishEvent(event: GameEvent) {
    this.gameEvents.add(event);
    this.observers.forEach(observer => observer.onEvent(event));
  }

  getAll(): GameEvent[] {
    return this.gameEvents.getAll();
  }
} 