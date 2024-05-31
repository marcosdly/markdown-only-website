import hyperlink from "bootstrap-icons/icons/box-arrow-up-right.svg";
import { Component, RefObject, createRef } from "preact";
import { type CSSProperties } from "preact/compat";
import { default as Victor } from "victor";
import { Circle } from "../lib/circle";
import { Point2d } from "../lib/point2d";
import { Square } from "../lib/square";
import { State } from "../lib/state";
import { PositionCSS } from "../lib/style";

const { assign, values, is } = Object;

interface CharOptions {
  letter: string;
  iconPath: string | null;
  href: string | null;
  index: number;
  length: number;
}

export interface RedirectingCSS {
  left: string | undefined;
  top: string;
}

interface CharState {
  positionCSS: PositionCSS;
  redirectingPositionCSS: RedirectingCSS;
  showSecondary: boolean;
}

export enum CharAnimation {
  GATTER = "char-gatter-animation",
  SPREAD = "char-spread-animation",
  OUTOFBOUNDS = "char-outofbounds-animation",
  NONE = "char-no-animation",
}

export namespace CharOperations {
  export function randomValidPosition(squareSideSize: number): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;
    let randomSquare: Square, anyOverlap: boolean;
    do {
      randomSquare = new Square(Point2d.random(w, h, squareSideSize), squareSideSize);
      anyOverlap = State.instance.chars.some((char) =>
        randomSquare.overlap(new Square(char.current, squareSideSize)),
      );
    } while (anyOverlap);
    return randomSquare.center;
  }

  export function spread(ignore: number) {
    State.instance.chars.forEach((char) => {
      char.setAnimation(CharAnimation.SPREAD);
      if (char.props.index === ignore) return;
      const p = randomValidPosition(char.squareSideSize);
      char.setPosition(p, char.inactiveZIndex);
    });
  }

  export function gatter() {
    State.instance.chars.forEach((char) => {
      char.resetPosition();
      char.setAnimation(CharAnimation.GATTER);
    });
  }
}

export class Char extends Component<CharOptions, CharState> {
  private center: Point2d;
  private charBox: RefObject<HTMLDivElement> = createRef();
  private redirectingBox: RefObject<HTMLDivElement> = createRef();
  public beingDragged: boolean;
  public repositioning: boolean;
  public current: Point2d;
  public redirectingZIndex: number = 4;
  public activeZIndex: number = 3;
  public inactiveZIndex: number = 2;
  /** Number in pixels */
  public squareSideSize: number = 32; // placeholder
  public auraRadius: number = this.squareSideSize * 2; // placeholder

  constructor(props: CharOptions) {
    super(props);
    State.instance.add(this.props.index, this);
    this.center = this.getCenterPoint();
    this.current = this.center;
    this.state = {
      positionCSS: this.center.toStyle().toInlineCSS(this.inactiveZIndex),
      redirectingPositionCSS: { left: "0px", top: "0px" },
      showSecondary: false,
    };
    this.beingDragged = false;
    this.repositioning = false;
  }

  public usePrimaryIcon() {
    this.setState(assign(this.state, { showSecondary: false }));
  }

  public useSecondaryIcon() {
    this.setState(assign(this.state, { showSecondary: true }));
  }

  public resetPosition() {
    this.beingDragged = false;
    this.setPosition(this.center, this.inactiveZIndex);
  }

  private getCenterPoint(): Point2d {
    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    return new Point2d((w / (this.props.length + 1)) * (this.props.index + 1), h / 2);
  }

  private getRedirectingPosition() {
    const w = document.documentElement.offsetWidth,
      y = this.squareSideSize * 1.5,
      halfBox = this.redirectingBox.current!.getBoundingClientRect().width / 2,
      borderOffset = this.squareSideSize;

    let x: number;

    if (this.center.x - halfBox < borderOffset) x = -halfBox + borderOffset;
    else if (this.center.x + halfBox > w - borderOffset) x = -halfBox - borderOffset;
    else x = 0;

    return new Point2d(x, -y);
  }

  public updateRedirectingPosition() {
    const p = this.getRedirectingPosition();
    this.setState(
      assign(this.state, {
        redirectingPositionCSS: {
          left: p.x !== 0 ? `${p.x}px` : undefined,
          top: `${p.y}px`,
        },
      }),
    );
  }

  public showRedirecting() {
    if (!this.props.href) return;
    this.redirectingBox.current!.classList.add("char-redirecting-show");
    this.redirectingBox.current!.classList.remove("char-redirecting-hide");
  }

  public hideRedirecting() {
    if (!this.props.href) return;
    this.redirectingBox.current!.classList.add("char-redirecting-hide");
    this.redirectingBox.current!.classList.remove("char-redirecting-show");
  }

  public setPosition(p: Point2d, zIndex: number) {
    const style = p.toStyle().toInlineCSS(zIndex);
    this.current = p;
    this.setState(assign(this.state, { positionCSS: style }));
  }

  public updateCenter() {
    this.center = this.getCenterPoint();
  }

  public updateSize() {
    if (!this.charBox.current) return;
    const box = this.charBox.current.getBoundingClientRect();
    this.squareSideSize = box.width;
    this.auraRadius = this.squareSideSize * 2;
  }

  public redirectToHyperlink(ev: TransitionEvent) {
    if (!this.props.href || ev.propertyName !== "color") return;
    document.location = this.props.href;
  }

  private start() {
    if (this.props.iconPath === null && this.state.showSecondary) return;
    if (State.instance.chars.some((char) => char.beingDragged)) return;
    const elemBox = this.charBox.current!.getBoundingClientRect();
    const current: Point2d = new Point2d(
      this.squareSideSize / 2 + elemBox.x,
      this.squareSideSize / 2 + elemBox.y,
    );
    this.setPosition(current, this.activeZIndex);
    CharOperations.spread(this.props.index);
    if (this.props.iconPath !== null) this.useSecondaryIcon();
    State.instance.chars.forEach((char) => {
      if (char.props.index === this.props.index) return;
      char.usePrimaryIcon();
    });
    this.showRedirecting();
  }

  private interrupt() {
    if (State.instance.chars.some((char) => char.beingDragged)) return;
    CharOperations.gatter();
    this.hideRedirecting();
  }

  private startDragging() {
    if (this.props.iconPath === null && this.state.showSecondary) return;
    this.beingDragged = true;
    State.instance.setActive(this.props.index);
    State.instance.canvas.rise();
    this.setAnimation(CharAnimation.NONE);
  }

  private stopAndReset() {
    this.beingDragged = false;
    State.instance.inactive();
    State.instance.canvas.reset();
  }

  private releaseAnimationLock() {
    this.repositioning = false;
  }

  private acquireAnimationLock() {
    this.repositioning = true;
  }

  public setAnimation(type: CharAnimation) {
    if (!this.charBox.current) return;
    this.charBox.current.classList.remove(...values(CharAnimation));
    this.charBox.current.classList.add(type);
  }

  public repel(from: Point2d) {
    if (this.beingDragged || this.repositioning) return;
    const avoid = new Circle(from, this.auraRadius);
    if (!avoid.containsPoint(this.current)) return;

    const relative = Victor.fromObject(from);
    const final = Victor.fromObject(this.current)
      .subtract(relative)
      .normalize()
      .multiplyScalar(this.auraRadius);

    // prevent out of bounds ...
    {
      const w = document.documentElement.offsetWidth,
        h = document.documentElement.offsetHeight,
        tmpFinal = final.clone().add(relative),
        burstedX =
          tmpFinal.x <= this.squareSideSize || tmpFinal.x >= w - this.squareSideSize,
        burstedY =
          tmpFinal.y <= this.squareSideSize || tmpFinal.y >= h - this.squareSideSize;

      if (burstedX || burstedY) {
        const p = CharOperations.randomValidPosition(this.squareSideSize);
        this.setAnimation(CharAnimation.OUTOFBOUNDS);
        this.setPosition(p, this.inactiveZIndex);
        return;
      }
    }

    final.add(relative);
    this.setAnimation(CharAnimation.NONE);
    this.setPosition(Point2d.fromObject(final), this.inactiveZIndex);
  }

  public drag(ev: MouseEvent | Point2d) {
    if (!this.beingDragged) return;

    const w = document.documentElement.offsetWidth,
      h = document.documentElement.offsetHeight;

    let x: number, y: number;

    if (ev.x >= w - this.squareSideSize) x = w - this.squareSideSize;
    else if (ev.x <= this.squareSideSize) x = this.squareSideSize;
    else x = ev.x;

    if (ev.y >= h - this.squareSideSize) y = h - this.squareSideSize;
    else if (ev.y <= this.squareSideSize) y = this.squareSideSize;
    else y = ev.y;

    this.setPosition(new Point2d(x, y), this.activeZIndex);
    State.instance.chars.forEach((char) => char.repel(this.current));
  }

  render() {
    const redirectPopup = (
      <div
        style={this.state.redirectingPositionCSS as CSSProperties}
        ref={this.redirectingBox}
        className="char-redirecting char-redirecting-hide"
      >
        <p onTransitionEnd={(ev) => this.redirectToHyperlink(ev)}>Redirecting</p>
        <img src={hyperlink} alt="link icon" />
      </div>
    );

    return (
      <div
        className="char"
        onMouseEnter={() => this.start()}
        onMouseLeave={() => this.interrupt()}
        onMouseDown={() => this.startDragging()}
        onMouseUp={() => this.stopAndReset()}
        onTransitionStart={() => this.acquireAnimationLock()}
        onTransitionEnd={() => this.releaseAnimationLock()}
        onTransitionCancel={() => this.releaseAnimationLock()}
        // onMouseMove={(ev) => this.drag(ev)}
        ref={this.charBox}
        style={this.state.positionCSS as CSSProperties}
      >
        {redirectPopup}
        <a className="char-link" href={this.props.href || ""}>
          <span
            style={{ opacity: this.state.showSecondary ? 0 : 1 }}
            className="char-primary char-content-item"
          >
            {this.props.letter}
          </span>
          <img
            style={{
              opacity:
                is(this.props.iconPath, null) || !this.state.showSecondary ? 0 : 1,
            }}
            className="char-secondary char-content-item"
            src={this.props.iconPath || ""}
          />
        </a>
      </div>
    );
  }

  componentDidMount() {
    this.updateSize();
    this.updateRedirectingPosition();
  }
}
