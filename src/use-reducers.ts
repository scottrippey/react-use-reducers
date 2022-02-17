import { useState, useMemo } from 'react';

export function useReducers<
  TState,
  TReducers extends Reducers<TState>
>(
  initial: TState,
  reducers: TReducers,
): readonly [ TState, TActions<TReducers, TState> ] {
  const [ state, setState ] = useState(initial);

  const actions = useMemo(() => {
    return mapObject(reducers, (value: Reducer<TState>) => {
      return (...args: unknown[]) => setState(s => value(s, ...args));
    }) as TActions<TReducers, TState>;
  }, [ reducers ]);

  return [ state, actions ] as const;
}


function mapObject<
  TObj,
  TMapped
>(
  obj: TObj,
  mapper: (value: TObj[keyof TObj], key: keyof TObj) => TMapped,
) {
  return (Object.keys(obj) as Array<keyof TObj>).reduce((mapped, key) => {
    mapped[key] = mapper(obj[key], key);
    return mapped;
  }, {} as {
    [P in keyof TObj]: TMapped
  });
}





type Reducer<TState> = (prevState: TState, ...args: any[]) => TState
type Reducers<TState> = Record<string, Reducer<TState>>

type TActions<TReducers extends Reducers<TState>, TState> = {
  [P in keyof TReducers]: TReducers[P] extends (prevState: TState, ...args: infer TArgs) => TState
    ? (...args: TArgs) => TState
    : never;
}


