import React, { useState } from "react";
import "./App.css";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_TODOS = gql`query {  
  todos {
    id,
    title,
    completed
  }
}`;

const client = new ApolloClient({
  uri: "https://todo-mongo-graphql-server.herokuapp.com"
});

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

function App() {
  
  const { loading, error, data } = useQuery(GET_TODOS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const addTodo = title => {
    const newTodos = [...data, { title, completed: false }];
    console.log(newTodos);
    console.log(data);
    //setTodos(newTodos);
  };

  const completeTodo = index => {
    const newTodos = [...data];
    newTodos[index].completed = true;
    //setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...data];
    newTodos.splice(index, 1);
    //setTodos(newTodos);
  };

  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo app 🚀</h2>
        {data.todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
      </div>
    </ApolloProvider>
  );
}

export default App;