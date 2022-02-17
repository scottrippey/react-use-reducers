import { act, renderHook } from '@testing-library/react-hooks';
import { useReducers } from './use-reducers';

describe('useReducers', () => {
  const INITIAL = {
    counter1: 0,
    counter2: 0,
  };
  type TState = typeof INITIAL;
  const ACTIONS = {
    reset: () => INITIAL,
    inc1: (s: TState, inc = 1) => ({ ...s, counter1: s.counter1 + inc }),
    inc2: (s: TState, inc = 1) => ({ ...s, counter2: s.counter2 + inc })
  };

  function renderTestHook() {
    return renderHook(() => {
      const [ state, actions ] = useReducers(INITIAL, ACTIONS);
      return { state, actions };
    });
  }

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
});
