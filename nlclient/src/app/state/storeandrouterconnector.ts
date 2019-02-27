import { Injectable } from '@angular/core';
import { CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from './store';

@Injectable()
export class StoreAndRouterConnector implements CanActivateChild {
  private lastState: RouterStateSnapshot = null;
  constructor(private store: Store<any, any>) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log("canActivateChild");
    if (this.lastState === state) {
      return of(true);
    } else {
      this.lastState = state;
      return this.store.sendAction({type: 'ROUTER_NAVIGATION', state});
    }
  }
}

export function connectToStore(routes: Routes): Routes {
    return [
      {
        path: '',
        canActivateChild: [StoreAndRouterConnector],
        children: routes
      }
    ];
  }