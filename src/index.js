import React, { useState, useEffect } from "react";
import { render } from "react-dom";
//import App from './App.js'
import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://todo-mongo-graphql-server.herokuapp.com"
});

const GET_TODOS = gql`query {  
  todos {
    id,
    title,
    completed
  }
}`;

const ADD_TODO = gql`mutation{
  add (title: "Testing graphql") {
    id,
    title,
    completed
  }
}`;

function Todo(completeTodo) {
  const { loading, error, data } = useQuery(GET_TODOS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return data.todos.map((todo, index) => (
    <div key={index}>
    <div
      className="todo"
      style={{ textDecoration: todo.completed ? "line-through" : "" }}
    >
      {todo.title}
            <div>
        <button onClick={() => completeTodo(index)}>Complete</button>
        <button>x</button>
      </div>
      </div>
    </div>
  ));
}

function App() {

  // const addTodo = title => {
  //   const newTodos = [...data, { title, completed: false }];
  //   console.log(newTodos);
  //   console.log(data);
  //   //setTodos(newTodos);
  // };

  const completeTodo = index => {
  //   const newTodos = [...data];
  //   newTodos[index].completed = true;
  //   //setTodos(newTodos);
  console.log(index);
  };

  // const removeTodo = index => {
  //   const newTodos = [...data];
  //   newTodos.splice(index, 1);
  //   //setTodos(newTodos);
  // };
  
  return (
  <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app 🚀</h2>
      <Todo
        
      />
    </div>
  </ApolloProvider>
  )}

render(<App />, document.getElementById("root"));
