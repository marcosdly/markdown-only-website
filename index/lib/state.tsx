import { Char } from "../components/Char";
import { DragCanvas } from "../components/DragCanvas";

export class StateNotInitializedError extends TypeError {}
export class StateUnsetError extends TypeError {}

export class State {
  public static instance = new this();

  private constructor() {}

  private _chars: Char[] = [];
  private _canvas: DragCanvas | null = null;
  private _active: number | null = null;

  public get chars() {
    return this._chars;
  }

  public get canvas(): DragCanvas {
    if (!this._canvas) throw new StateNotInitializedError("DragCanvas is not set.");
    return this._canvas!;
  }

  public get active(): number {
    if (!this._active) throw new StateUnsetError("There isn't a Char object active.");
    return this._active!;
  }

  public add(index: number, component: Char) {
    if (this._chars[index]) return;
    this._chars.push(component);
  }

  public setActive(index: number) {
    this._active = index;
  }

  public inactive() {
    this._active = null;
  }

  public isActive() {
    return !Object.is(this._active, null);
  }

  public getActive(): Char | undefined {
    if (!this.isActive()) return undefined;
    return this._chars[this._active!];
  }

  public setCanvas(component: DragCanvas) {
    if (this._canvas) return;
    this._canvas = component;
  }
}
