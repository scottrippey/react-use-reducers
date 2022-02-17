# `react-use-reducers`

A cleaner, better version of the `useReducer` hook.

You define an object with several reducers, and `useReducers` returns a matching object of actions for manipulating the
state.

# Simple "Counter" Example

```tsx
import { useReducers } from 'react-use-reducers';

const INITIAL = { count: 0 };
const REDUCERS = {
  increment: (state) => ({ count: state.count + 1 }),
  skipAFew: (state, howMany) => ({ count: state.count + howMany }),
  reset: (state) => INITIAL,
};

function App() {
  const [ state, actions ] = useReducers(REDUCERS, INITIAL);
  // state === { count: 0 }
  // actions === { 
  //               increment(): void, 
  //               skipAFew(howMany: number): void, 
  //               reset(): void, 
  //             }

  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={actions.increment}> +1 </button>
      <button onClick={() => actions.skipAFew(99)}> +99 </button>
      <button onClick={actions.reset}> Reset </button>
    </div>
  );
}

```

# "To Do App" Example

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
}

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
