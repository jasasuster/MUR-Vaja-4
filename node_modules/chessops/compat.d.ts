import { Rules, SquareName, Move } from './types';
import { Position } from './chess';
export interface ChessgroundDestsOpts {
    chess960?: boolean;
}
export declare function chessgroundDests(pos: Position, opts?: ChessgroundDestsOpts): Map<SquareName, SquareName[]>;
export declare function chessgroundMove(move: Move): SquareName[];
export declare function scalachessCharPair(move: Move): string;
export declare function lichessRules(variant: 'standard' | 'chess960' | 'antichess' | 'fromPosition' | 'kingOfTheHill' | 'threeCheck' | 'atomic' | 'horde' | 'racingKings' | 'crazyhouse'): Rules;
export declare function lichessVariant(rules: Rules): 'standard' | 'antichess' | 'kingOfTheHill' | 'threeCheck' | 'atomic' | 'horde' | 'racingKings' | 'crazyhouse';
