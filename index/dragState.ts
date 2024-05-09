import { type Char } from "./components/Char";
import { type DragCanvas } from "./components/DragCanvas";

/**
 * Making things deliberately verbose so I don't mess up.
 * Bare assignments are missleading when access is assynchronous
 * or when you should assume it is because it's safer.
 * I'm not the brightest.
 */
export class DragState {
  private static _instance: DragState = new this();

  public static get instance() {
    return this._instance;
  }

  private constructor() { }

  private _char: Char | null = null;
  private _dragCanvas: DragCanvas | null = null;

  public get char() {
    return this._char;
  }

  public get dragCanvas() {
    return this._dragCanvas;
  }

  public get isCharInitialized(): boolean {
    return Boolean(this._char);
  }

  public get isDragCanvasInitialized(): boolean {
    return Boolean(this._dragCanvas);
  }

  public setCharInstance(instance: Char) {
    this._char = instance;
  }

  public resetCharInstance() {
    this._char = null;
  }

  public setDragCanvasInstance(instance: DragCanvas) {
    if (this._dragCanvas) throw new SyntaxError("More than one instance is not allowed");
    this._dragCanvas = instance;
  }
}
