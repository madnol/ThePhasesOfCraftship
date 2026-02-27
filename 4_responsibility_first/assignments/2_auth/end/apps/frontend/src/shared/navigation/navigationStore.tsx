import { makeAutoObservable } from "mobx";
import { NavigateFunction } from "react-router-dom";

type Options = { inSeconds: number }

export class NavigationStore {
  public currentPath: string;
  private _navigate: NavigateFunction | null = null;

  constructor() {
    makeAutoObservable(this);
    this.currentPath = window.location.pathname;
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  setNavigateFunction(navigate: NavigateFunction) {
    this._navigate = navigate;
  }

  updateCurrentPath (newPath: string) {
    this.currentPath = newPath;
  }

  navigate(to: string, opts?: Options) {
    if (this._navigate) {
      if (opts && opts.inSeconds) {
        setTimeout(() => {
          this._navigate!(to);
          this.currentPath = to;
        }, opts.inSeconds);
      } else {
        this._navigate(to);
        this.currentPath = to;
      }
    } else {
      console.warn('Navigation function not set. Make sure to use NavigationProvider.');
    }
  }
} 