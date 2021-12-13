import { Color, Square } from './types';
import { SquareSet } from './squareSet';
import { Board } from './board';
export declare class MaterialSide {
    pawn: number;
    knight: number;
    bishop: number;
    rook: number;
    queen: number;
    king: number;
    private constructor();
    static empty(): MaterialSide;
    static fromBoard(board: Board, color: Color): MaterialSide;
    clone(): MaterialSide;
    equals(other: MaterialSide): boolean;
    add(other: MaterialSide): MaterialSide;
    nonEmpty(): boolean;
    isEmpty(): boolean;
    hasPawns(): boolean;
    hasNonPawns(): boolean;
    count(): number;
}
export declare class Material {
    white: MaterialSide;
    black: MaterialSide;
    constructor(white: MaterialSide, black: MaterialSide);
    static empty(): Material;
    static fromBoard(board: Board): Material;
    clone(): Material;
    equals(other: Material): boolean;
    add(other: Material): Material;
    count(): number;
    isEmpty(): boolean;
    nonEmpty(): boolean;
    hasPawns(): boolean;
    hasNonPawns(): boolean;
}
export declare class RemainingChecks {
    white: number;
    black: number;
    constructor(white: number, black: number);
    static default(): RemainingChecks;
    clone(): RemainingChecks;
    equals(other: RemainingChecks): boolean;
}
export interface Setup {
    board: Board;
    pockets: Material | undefined;
    turn: Color;
    unmovedRooks: SquareSet;
    epSquare: Square | undefined;
    remainingChecks: RemainingChecks | undefined;
    halfmoves: number;
    fullmoves: number;
}
export declare function defaultSetup(): Setup;
