import { Injectable } from '@angular/core';
import { Subject, Observer, Observable, asyncScheduler, of, BehaviorSubject } from 'rxjs';
import { observeOn, mergeMap, map, startWith, pairwise } from 'rxjs/operators';
import { State } from '../model/state';

export type RollbackFunction<S, A> = (currentState: S, oldState: S, action: A) => S;
export type Reducer<S, A> = (store: Store<S,A>, state: S, action: A) => Observable<S>;
export type StateChange<S> = { actual: S, last: S };

@Injectable()
export class Store<S, A> {
  private actions = new Subject<{action: A, result: Observer<boolean>}>();
  private stateSubject = new BehaviorSubject<S>(null);
  private initState: S;

  constructor(private reducer: Reducer<S, A>, public state: S) {  
    
    this.initState = state;

    this.actions.pipe(observeOn(asyncScheduler), mergeMap(a => {
      let obs: Observable<S>;
      let err = null; 
      try {
        obs = reducer(this, this.state, a.action);
      }
      catch (e) {
        obs = of(this.state);
        err = e;
        console.log("store: state (error)");
      }
      return obs.pipe(map(state => ({state, result: a.result, err: err })));

    })).subscribe(pair => {          
      if(this.state === pair.state) {
        console.log("store: state unchanged");
        // we don't update stateSubject
      }
      else {
        console.log(this.state);  // alter Zustand
        this.state = pair.state;
        console.log(this.state);  // neuer Zustand
        this.stateSubject.next(this.state);
      }

      if (pair.err)
        pair.result.error(pair.err);
      else
        pair.result.next(true);

      pair.result.complete();
    });
  }

  sendAction(action: A): Observable<boolean> {
    const res = new Subject<boolean>();
    console.log(action);
    this.actions.next({action, result: res});
    return res;
  }

  get state$(): Observable<StateChange<S>> {
    return this.stateSubject.pipe(
      startWith(this.initState),
      pairwise(),
      map(pair => { return { actual: pair[1], last: pair[0]}; })
  )}
}
