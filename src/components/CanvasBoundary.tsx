import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };
type State = { failed: boolean };

/** Shows a static fallback if WebGL is unavailable or a 3D scene throws. */
export class CanvasBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
