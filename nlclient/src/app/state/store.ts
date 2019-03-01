import { Injectable } from '@angular/core';
import { Subject, Observer, Observable, asyncScheduler, of, throwError } from 'rxjs';
import { observeOn, mergeMap, map, switchMap, catchError, tap } from 'rxjs/operators';
import { RouterStateSnapshot } from '@angular/router';
import { NodeItem } from '../model/nodeitem';
import { LinkItem } from '../model/linkitem';
import { State } from './reducer';

export type RollbackFunction<S, A> = (currentState: S, oldState: S, action: A) => S;
export type Reducer<S, A> = (store: Store<S,A>, state: S, action: A) => Observable<S>;

const fakeRequest$ = of().pipe(
  tap(_ => { console.log('fakeRequest');  try {    throw new RangeError("linkId " + "www" + " not found");  } catch {  throw  throwError;     }   }         ),
);


@Injectable()
export class Store<S, A> {
  private actions = new Subject<{action: A, result: Observer<boolean>}>();

  constructor(private reducer: Reducer<S, A>, public state: S) {  

    this.actions.pipe(observeOn(asyncScheduler), mergeMap(a => {
      console.log("store: before state");
      let state: Observable<S>;
      let err = null; 
      try {
        state = reducer(this, this.state, a.action);
      }
      catch (e) {
        state = of(this.state);
        err = e;
      }
      return state.pipe(map(state => ({state, result: a.result, err: err })));

    })).subscribe(pair => {
      
      console.log(this.state);
      this.state = pair.state;
      console.log(this.state);

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
}
