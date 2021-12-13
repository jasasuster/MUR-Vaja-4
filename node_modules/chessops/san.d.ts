import { Move } from './types';
import { Position } from './chess';
export declare function makeSanAndPlay(pos: Position, move: Move): string;
export declare function makeSanVariation(pos: Position, variation: Move[]): string;
export declare function makeSan(pos: Position, move: Move): string;
export declare function parseSan(pos: Position, san: string): Move | undefined;
