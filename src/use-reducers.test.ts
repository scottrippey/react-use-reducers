import { act, renderHook } from '@testing-library/react-hooks';
import { useReducers } from './use-reducers';

describe('useReducers', () => {
  const INITIAL = {
    counter1: 0,
    counter2: 0,
  };
  type TState = typeof INITIAL;
  const REDUCERS = {
    reset: () => INITIAL,
    inc1: (s: TState, inc = 1) => ({ ...s, counter1: s.counter1 + inc }),
    inc2: (s: TState, inc = 1) => ({ ...s, counter2: s.counter2 + inc })
  };

  function renderTestHook() {
    return renderHook(() => {
      const [ state, actions ] = useReducers(REDUCERS, INITIAL);
      return { state, actions };
    });
  }

  describe('initial param', () => {
    it('can be a constant value', () => {
      const { result } = renderHook(() => useReducers(REDUCERS, ({ counter1: 5, counter2: 5 })))
      expect(result.current[0]).toEqual({ counter1: 5, counter2: 5 })
    });

    it('can be a callback function', () => {
      const { result } = renderHook(() => useReducers(REDUCERS, () => ({ counter1: 5, counter2: 5 })))
      expect(result.current[0]).toEqual({ counter1: 5, counter2: 5 })
    });
  });

  it('should return the state and mapped actions', () => {
    const { result } = renderTestHook();

    expect(result.current).toMatchInlineSnapshot(`
      Object {
        "actions": Object {
          "inc1": [Function],
          "inc2": [Function],
          "reset": [Function],
        },
        "state": Object {
          "counter1": 0,
          "counter2": 0,
        },
      }
    `);
  });

  it('calling actions should update the state', () => {
    const { result } = renderTestHook();

    act(() => {
      result.current.actions.inc1();
    });

    expect(result.current.state).toMatchInlineSnapshot(`
      Object {
        "counter1": 1,
        "counter2": 0,
      }
    `);

    act(() => {
      result.current.actions.inc2();
      result.current.actions.inc2();
    });

    expect(result.current.state).toMatchInlineSnapshot(`
      Object {
        "counter1": 1,
        "counter2": 2,
      }
    `);

    act(() => {
      result.current.actions.reset();
    });

    expect(result.current.state).toMatchInlineSnapshot(`
      Object {
        "counter1": 0,
        "counter2": 0,
      }
    `);
  });

  it('actions should accept parameters', () => {
    const { result } = renderTestHook();

    act(() => {
      result.current.actions.inc1(5);
      result.current.actions.inc1(10);
      result.current.actions.inc2(20);
    });

    expect(result.current.state).toMatchInlineSnapshot(`
      Object {
        "counter1": 15,
        "counter2": 20,
      }
    `);
  });

  it('reducers can be inline; actions will be memoized', () => {
    const { result, rerender } = renderHook((props: { howMany: number }) => {
      const [ state, actions ] = useReducers({
        skipAFew: (s) => ({ ...s, counter1: s.counter1 + props.howMany })
      }, INITIAL);
      return { state, actions };
    }, { initialProps: { howMany: 1 } });

    expect(result.current.state).toEqual(INITIAL);

    const skipAFewReference = result.current.actions.skipAFew;

    act(() => {
      result.current.actions.skipAFew();
    });
    expect(result.current.state).toMatchInlineSnapshot(`
      Object {
        "counter1": 1,
        "counter2": 0,
      }
    `);

    rerender({ howMany: 99 });
    expect(result.current.state).toMatchInlineSnapshot(`
      Object {
        "counter1": 1,
        "counter2": 0,
      }
    `);

    act(() => {
      result.current.actions.skipAFew();
    });
    expect(result.current.state).toMatchInlineSnapshot(`
      Object {
        "counter1": 100,
        "counter2": 0,
      }
    `);

    // Ensure the actions keep the same reference always:
    expect(skipAFewReference).toBe(result.current.actions.skipAFew);
  });
});
