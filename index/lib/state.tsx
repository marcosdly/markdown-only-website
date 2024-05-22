import { Char } from "../components/Char";
import { DragCanvas } from "../components/DragCanvas";

export class State {
  public static instance = new this();

  private constructor() {}

  private _chars: Char[] = [];
  private _canvas: DragCanvas | null = null;
  private _active: number | null = null;

  public get chars() {
    return this._chars;
  }

  public get canvas() {
    return this._canvas;
  }

  public get active() {
    return this._active;
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

  public getActive(): Char | undefined {
    if (!this._active) return undefined;
    return this._chars[this._active];
  }

  public setCanvas(component: DragCanvas) {
    if (this._canvas) return;
    this._canvas = component;
  }
}
