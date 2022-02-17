import { useMemo, useRef, useState } from 'react';

export function useReducers<TState, TReducers extends Reducers<TState>>(
  reducers: TReducers,
  initial: TState,
): readonly [ TState, ActionsFromReducers<TReducers, TState> ] {
  const [ state, setState ] = useState(initial);

  const reducersRef = useRef(reducers);
  reducersRef.current = reducers;

  const actions = useMemo(() => {
    // Map the "reducers" into "actions":
    return (Object.keys(reducers) as Array<keyof TReducers>).reduce((actionsResult, key) => {
      const action = (...args: unknown[]) => setState(s => reducersRef.current[key](s, ...args));

      actionsResult[key] = action as ActionFromReducer<TReducers[typeof key], TState>;
      return actionsResult;
    }, {} as ActionsFromReducers<TReducers, TState>);
  }, []);

  return [ state, actions ] as const;
}

// A reducer maps from state to state, with optional args:
export type Reducer<TState> = (prevState: TState, ...args: any[]) => TState

// An action signature omits the first 'prevState' argument from the reducer, and returns void
export type ActionFromReducer<TReducer extends Reducer<TState>, TState> =
  TReducer extends (prevState: TState, ...args: infer TArgs) => TState
    ? (...args: TArgs) => void
    : never

// An object of reducers
export type Reducers<TState> = Record<string, Reducer<TState>>
// An object of actions, mapped from an object of reducers:
export type ActionsFromReducers<TReducers extends Reducers<TState>, TState> = {
  [P in keyof TReducers]: ActionFromReducer<TReducers[P], TState>;
}

