export declare const FILE_NAMES: readonly ["a", "b", "c", "d", "e", "f", "g", "h"];
export declare type FileName = typeof FILE_NAMES[number];
export declare const RANK_NAMES: readonly ["1", "2", "3", "4", "5", "6", "7", "8"];
export declare type RankName = typeof RANK_NAMES[number];
export declare type Square = number;
export declare type SquareName = `${FileName}${RankName}`;
/**
 * Indexable by square indices.
 */
export declare type BySquare<T> = T[];
export declare const COLORS: readonly ["white", "black"];
export declare type Color = typeof COLORS[number];
/**
 * Indexable by `white` and `black`.
 */
export declare type ByColor<T> = {
    [color in Color]: T;
};
export declare const ROLES: readonly ["pawn", "knight", "bishop", "rook", "queen", "king"];
export declare type Role = typeof ROLES[number];
/**
 * Indexable by `pawn`, `knight`, `bishop`, `rook`, `queen`, and `king`.
 */
export declare type ByRole<T> = {
    [role in Role]: T;
};
export declare const CASTLING_SIDES: readonly ["a", "h"];
export declare type CastlingSide = typeof CASTLING_SIDES[number];
/**
 * Indexable by `a` and `h`.
 */
export declare type ByCastlingSide<T> = {
    [side in CastlingSide]: T;
};
export interface Piece {
    role: Role;
    color: Color;
    promoted?: boolean;
}
export interface NormalMove {
    from: Square;
    to: Square;
    promotion?: Role;
}
export interface DropMove {
    role: Role;
    to: Square;
}
export declare type Move = NormalMove | DropMove;
export declare function isDrop(v: Move): v is DropMove;
export declare function isNormal(v: Move): v is NormalMove;
export declare const RULES: readonly ["chess", "antichess", "kingofthehill", "3check", "atomic", "horde", "racingkings", "crazyhouse"];
export declare type Rules = typeof RULES[number];
export interface Outcome {
    winner: Color | undefined;
}
