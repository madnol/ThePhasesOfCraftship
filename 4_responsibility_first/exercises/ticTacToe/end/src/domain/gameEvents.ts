
import { GameEvent } from './types';

// Information Holder  - Level 2
export class GameEvents {
  constructor(
    private events: GameEvent[] = []
  ) {}

  getAll(): GameEvent[] {
    return [...this.events];
  }

  add(event: GameEvent) {
    this.events.push(event);
  }
} 