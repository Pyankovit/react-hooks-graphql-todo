import React, { useState } from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

function Todo({ todo, index, completeTodo, removeTodo }) {
  console.log(todo, index)
  return (
    <div
      className="todo"
      style={{ textDecoration: todo.completed ? "line-through" : "" }}
    >
      {todo.title}
      <div>
        <button onClick={() => completeTodo(index)}>Complete</button>
        <button onClick={() => removeTodo(index)}>x</button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="title"
        className="input"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

function App() {
  const [data, setTodos] = useState([
    {
      title: "Learn about React",
      completed: false
    },
    {
      title: "Meet friend for lunch",
      completed: false
    },
    {
      title: "Build really cool todo app",
      completed: false
    }
  ]);

  const addTodo = title => {
    const newTodos = [...data, { title, completed: false }];
    console.log(newTodos);
    console.log(data);
    setTodos(newTodos);
  };

  const completeTodo = index => {
    const newTodos = [...data];
    newTodos[index].completed = true;
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...data];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div className="app">
      <div className="todo-list">
        {data.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

export default App;