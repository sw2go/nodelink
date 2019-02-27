import { Injectable } from '@angular/core';
import { Subject, Observer, Observable, asyncScheduler, of } from 'rxjs';
import { observeOn, mergeMap, map, switchMap, catchError } from 'rxjs/operators';
import { RouterStateSnapshot } from '@angular/router';
import { NodeItem } from '../model/nodeitem';
import { LinkItem } from '../model/linkitem';

export type RollbackFunction<S, A> = (currentState: S, oldState: S, action: A) => S;
export type Reducer<S, A> = (store: Store<S,A>, state: S, action: A) => S|Observable<S>;

@Injectable()
export class Store<S, A> {
  private actions = new Subject<{action: A, result: Observer<boolean>}>();

  constructor(private reducer: Reducer<S, A>, public state: S) {
    this.actions.pipe(observeOn(asyncScheduler), mergeMap(a => {
      console.log("store: before state");
      const state = reducer(this, this.state, a.action);
      const obs = state instanceof Observable ? state : of(state);
      return obs.pipe(map(state => ({state, result: a.result})));

    })).subscribe(pair => {
      console.log(this.state);

      this.state = pair.state;
      console.log(this.state);

      pair.result.next(true);
      pair.result.complete();
    });
  }

  sendAction(action: A): Observable<boolean> {
    const res = new Subject<boolean>();
    console.log("store: before sendAction");
    this.actions.next({action, result: res});
    console.log("store: after sendAction");
    return res;
  }
}
