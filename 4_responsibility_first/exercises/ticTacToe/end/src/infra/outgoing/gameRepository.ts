
import { GameEvent } from "../../domain/types";

// Interfacing (outgoing) - 4
export interface GameRepository {
  save(events: GameEvent[]): Promise<void>;
  load(): Promise<GameEvent[]>;
  clear(): Promise<void>;
}
