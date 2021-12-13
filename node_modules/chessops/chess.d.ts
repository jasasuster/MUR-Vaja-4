import { Result } from '@badrap/result';
import { Rules, CastlingSide, Color, Square, ByColor, ByCastlingSide, Move, Piece, Outcome } from './types';
import { SquareSet } from './squareSet';
import { Board } from './board';
import { Setup, Material, RemainingChecks } from './setup';
export declare enum IllegalSetup {
    Empty = "ERR_EMPTY",
    OppositeCheck = "ERR_OPPOSITE_CHECK",
    ImpossibleCheck = "ERR_IMPOSSIBLE_CHECK",
    PawnsOnBackrank = "ERR_PAWNS_ON_BACKRANK",
    Kings = "ERR_KINGS",
    Variant = "ERR_VARIANT"
}
export declare class PositionError extends Error {
}
export declare class Castles {
    unmovedRooks: SquareSet;
    rook: ByColor<ByCastlingSide<Square | undefined>>;
    path: ByColor<ByCastlingSide<SquareSet>>;
    private constructor();
    static default(): Castles;
    static empty(): Castles;
    clone(): Castles;
    private add;
    static fromSetup(setup: Setup): Castles;
    discardRook(square: Square): void;
    discardSide(color: Color): void;
}
export interface Context {
    king: Square | undefined;
    blockers: SquareSet;
    checkers: SquareSet;
    variantEnd: boolean;
    mustCapture: boolean;
}
export declare abstract class Position {
    readonly rules: Rules;
    board: Board;
    pockets: Material | undefined;
    turn: Color;
    castles: Castles;
    epSquare: Square | undefined;
    remainingChecks: RemainingChecks | undefined;
    halfmoves: number;
    fullmoves: number;
    protected constructor(rules: Rules);
    abstract dests(square: Square, ctx?: Context): SquareSet;
    abstract isVariantEnd(): boolean;
    abstract variantOutcome(ctx?: Context): Outcome | undefined;
    abstract hasInsufficientMaterial(color: Color): boolean;
    protected kingAttackers(square: Square, attacker: Color, occupied: SquareSet): SquareSet;
    dropDests(_ctx?: Context): SquareSet;
    protected playCaptureAt(square: Square, captured: Piece): void;
    ctx(): Context;
    clone(): Position;
    equalsIgnoreMoves(other: Position): boolean;
    toSetup(): Setup;
    isInsufficientMaterial(): boolean;
    hasDests(ctx?: Context): boolean;
    isLegal(move: Move, ctx?: Context): boolean;
    isCheck(): boolean;
    isEnd(ctx?: Context): boolean;
    isCheckmate(ctx?: Context): boolean;
    isStalemate(ctx?: Context): boolean;
    outcome(ctx?: Context): Outcome | undefined;
    allDests(ctx?: Context): Map<Square, SquareSet>;
    castlingSide(move: Move): CastlingSide | undefined;
    normalizeMove(move: Move): Move;
    play(move: Move): void;
    private legalEpSquare;
}
export declare class Chess extends Position {
    protected constructor(rules?: Rules);
    static default(): Chess;
    static fromSetup(setup: Setup): Result<Chess, PositionError>;
    clone(): Chess;
    protected validate(): Result<undefined, PositionError>;
    protected validateCheckers(): Result<undefined, PositionError>;
    private validEpSquare;
    private castlingDest;
    private canCaptureEp;
    protected pseudoDests(square: Square, ctx: Context): SquareSet;
    dests(square: Square, ctx?: Context): SquareSet;
    isVariantEnd(): boolean;
    variantOutcome(_ctx?: Context): Outcome | undefined;
    hasInsufficientMaterial(color: Color): boolean;
}
