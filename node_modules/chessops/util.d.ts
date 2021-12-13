import { CastlingSide, Color, Square, Role, Move, SquareName } from './types';
export declare function defined<A>(v: A | undefined): v is A;
export declare function opposite(color: Color): Color;
export declare function squareRank(square: Square): number;
export declare function squareFile(square: Square): number;
export declare function roleToChar(role: Role): string;
export declare function charToRole(ch: 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K'): Role;
export declare function charToRole(ch: string): Role | undefined;
export declare function parseSquare(str: SquareName): Square;
export declare function parseSquare(str: string): Square | undefined;
export declare function makeSquare(square: Square): SquareName;
export declare function parseUci(str: string): Move | undefined;
/**
 * Converts a move to UCI notation, like `g1f3` for a normal move,
 * `a7a8q` for promotion to a queen, and `Q@f7` for a Crazyhouse drop.
 */
export declare function makeUci(move: Move): string;
export declare function kingCastlesTo(color: Color, side: CastlingSide): Square;
