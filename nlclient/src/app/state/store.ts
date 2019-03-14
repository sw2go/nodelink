import { Injectable } from '@angular/core';
import { Subject, Observer, Observable, asyncScheduler, of, throwError, BehaviorSubject } from 'rxjs';
import { observeOn, mergeMap, map, switchMap, catchError, tap } from 'rxjs/operators';

export type RollbackFunction<S, A> = (currentState: S, oldState: S, action: A) => S;
export type Reducer<S, A> = (store: Store<S,A>, state: S, action: A) => Observable<S>;

@Injectable()
export class Store<S, A> {
  private actions = new Subject<{action: A, result: Observer<boolean>}>();
  private state$ = new BehaviorSubject<S>(null);

  constructor(private reducer: Reducer<S, A>, public state: S) {  

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
      
      console.log(this.state);
      this.state = pair.state;
      console.log(this.state);

      this.state$.next(this.state);

      if (pair.err)
        pair.result.error(pair.err);
      else
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

  select(): Observable<S> {
    return this.state$;
  }
}
