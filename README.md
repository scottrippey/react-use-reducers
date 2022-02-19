# `react-use-reducers`

A simple, tiny, type-safe way to manage state, without any of the boilerplate of typical reducers.

Install via `npm install react-use-reducers`

Import via `import { useReducers } from 'react-use-reducers';`

# Simple "Counter" Example

No better documentation than an example:

```tsx
import { useReducers } from 'react-use-reducers';

const INITIAL = { count: 0 };
type TState = typeof INITIAL;
const REDUCERS = {
  increment: (state: TState, amount = 1) => ({ count: state.count + amount }),
  reset: (state: TState) => INITIAL,
};

function App() {
  const [ state, actions ] = useReducers(REDUCERS, INITIAL);
  // state === { count: 0 }
  // actions === { 
  //               increment(amount?: number): void, 
  //               reset(): void, 
  //             }

  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={() => actions.increment()}> +1 </button>
      <button onClick={() => actions.increment(99)}> +99 </button>
      <button onClick={actions.reset}> Reset </button>
    </div>
  );
}
```

# `useReducers` API

```
const [ state, actions ] = useReducers(reducers, initial);
```

### Parameters

`initial` - the initial state. Can be a value or a callback that returns a value.

`reducers` - an object with named reducers. In the above example, there are 2 reducers (`increment` and `reset`).

Each reducer takes the previous state, and returns the new state.

Reducers can have additional parameters, like how `increment` has an optional `amount` parameter.

### Returns

`state` - the current state

`actions` - an object with the same shape as the `reducers` (except without the `state` parameter)

Each action can be called (along with any additional parameters) to update the state.

For example, `actions.reset()` or `actions.increment(99)`.

> The `actions` object and methods will ALWAYS be the same reference, so it's safe to omit it from dependency lists.
> Example:
> ```
> useEffect(() => {
>   const t = setInterval(() => actions.increment(), 1000);
>   return () => clearInterval(t);
> }, []); // Empty dependency list, because `actions` doesn't change
> ```

### Things to Note

- Multiple actions can be called sequentially, and will be applied sequentially. So if you
  called `actions.reset(); actions.increment(5)` you'd end up with `{ count: 5 }`
- Reducers can be "inline" inside the component. They can access properties or other state, if needed. Example:
  ```
  function Counter(props) {
    const [ state, actions ] = useReducers({
      increment: (prev) => prev + props.size,
      reset: () => 0
    }, 0);
    // ... 
  }
  ```

# Advanced "To Do App" Example

```tsx
import { useReducers } from 'react-use-reducers';

const INITIAL = { todos: [] };
const REDUCERS = {
  addTodo(prev, title) {
    return ({
      todos: [
        ...s.todos,
        { title, complete: false }
      ]
    });
  },
  updateTodo(prev, title, complete) {
    return ({
      todos: prev.todos.map(todo => {
        if (todo.title === title) {
          return { ...todo, complete };
        }
        return todo;
      })
    });
  },
  removeTodo(prev, title) {
    return ({
      todos: prev.todos.filter(todo => todo.title !== title),
    });
  },
  reset: (prev) => INITIAL,
};

function TodoApp() {
  const [ state, actions ] = useReducers(REDUCERS, INITIAL);

  // state === {
  //             todos: [ ... ]
  //           }
  // typeof actions === { 
  //                      addTodo(title): void; 
  //                      updateTodo(title, complete): void;
  //                      removeTodo(title): void;  
  //                      reset(): void  
  //                    }

  return <>TODO</>;
}

```
