import { GameState, GameStateData } from '../domain/gameState';
import { GameEvent, Position } from '../domain/types';
import { GameRepository } from '../infra/outgoing/gameRepository';
import { GameEventCoordinator } from './gameEventCoordinator';
import { GameEvents } from '../domain/gameEvents';
import { GameEventSubscriptions } from './gameEventSubscriptions';

// Application / Controller (command-based) - Level 3
export class TicTacToe {
  private state: GameState;
  private gameEvents: GameEvents;
  private eventBus: GameEventCoordinator;
  private subscriber: GameEventSubscriptions;

  constructor(
    initialEvents: GameEvent[] = [], 
    private repository: GameRepository
  ) {
    this.state = new GameState();
    this.gameEvents = new GameEvents(initialEvents);

    this.eventBus = new GameEventCoordinator(this.gameEvents);
    this.subscriber = new GameEventSubscriptions(this.state, this.eventBus);

    this.replayEvents(initialEvents);
  }

  private replayEvents(events: GameEvent[]) {
    events.forEach(event => this.eventBus.publishEvent(event));
  }

  makeMove(position: Position): boolean {
    if (!this.state.canMakeMove(position)) {
      return false;
    }

    this.eventBus.publishEvent({
      type: 'MOVE',
      player: this.state.currentPlayer,
      position,
      timestamp: Date.now()
    });
    return true;
  }

  async saveGame() {
    const events = this.gameEvents.getAll()
    await this.repository.save(events);
  }

  async clearGame() {
    await this.repository.clear();
  }

  getState(): GameStateData {
    return this.state.getSnapshot();
  }

  printBoard() {
    console.log('\nCurrent Board:');
    console.log(this.state.getBoard().toString());
    console.log();
  }
}