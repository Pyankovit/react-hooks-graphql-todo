import React from "react";
import { render } from "react-dom";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, useQuery, useMutation } from "@apollo/react-hooks";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import gql from "graphql-tag";

import "./index.css"
import Button from "@material-ui/core/Button"
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import Input from "@material-ui/core/Input"

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://todo-mongo-graphql-server.herokuapp.com"
  }),
  cache: new InMemoryCache()
});

const GET_TODOS=gql`
query Todo{  
  todos {
    id
    title
    completed
  }
}`;

const TOGGLE = gql`
  mutation Todo($id: String!) {
    toggle(id: $id) {
      id
      title
      completed
    }
  }`;

  const DESTROY = gql`
  mutation Todo($id: String!) {
    destroy(id: $id) {
      id
      title
      completed
    }
  }`;

  const EDIT = gql`
  mutation Todo($id: String!, $title: String!) {
    save(id: $id, title: $title) {
      id
      title
      completed
    }
  }`;
  
function Todo() {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [updateTodo,
    { loading: mutationLoading, error: mutationError }
  ] = useMutation(TOGGLE);

  const [destroyTodo] = useMutation(DESTROY);
  const [editTodo] = useMutation(EDIT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.todos.map((todo, index) => {
    index++;
    let input;
    let {id, title, completed}=todo;
    return (
    <ListItem key={id}  dense button> 
    <div
      className="todo"
      style={{ textDecoration: completed ? "line-through" : "" }}>
         <IconButton 
          arial-label="Complete"
                onClick={e => {e.preventDefault();
                updateTodo({ variables:{ id: id} });
        }}
          ><CheckCircleIcon/></IconButton>
                <h2>
                {index}{". "}{title}
                </h2>
        <form onSubmit={e => {e.preventDefault();
                              if (input.value){editTodo({ variables: { id: id, title: input.value, completed: false } })} else alert("Поле не должно быть пустым!")
                              input.value = "";
                              }}>
        <TextField
          variant="outlined"
          placeholder={title}
          margin="normal"
          inputProps={{
            ref:(node) => {
              input = node;
            }
          }}
          />                
        <IconButton type="submit">
          <EditIcon/>
        </IconButton>
        </form>                            
        <IconButton arial-label="Delete" 
                              onClick={e => {e.preventDefault();
                              destroyTodo({ variables:{ id: id},
                                refetchQueries:[{query: GET_TODOS}]
                              });
                              }}>
          <DeleteIcon/>
        </IconButton>
        {/* {mutationLoading && <p>Loading...</p>}
        {mutationError && <p>Error :( Please try again</p>} */}
      </div>
    </ListItem>
  )});
}


const TODOS=gql`
{  
  todos {
    id
    title
    completed
  }
}`;

const ADD_TODO=gql`
mutation AddTodo($title: String!){
  add (title: $title) {
     id
     title
     completed
     }
   }`;

function AddTodo() {
  let input;
  const [addTodo] = useMutation(ADD_TODO); 
  return (
    <div className="footer">
      <div>
      <Typography component="h1" variant="h2">
      ToDo List
      </Typography>

      <form onSubmit={e => {
          e.preventDefault();
          if (input.value){addTodo({ variables:{ title: input.value},
            refetchQueries:[{query: TODOS}]
          })}else alert("Поле не должно быть пустым!");
          input.value = "";
        }}>
        <TextField
          variant="outlined"
          placeholder="Please Add some todo"
          margin="normal"
          inputProps={{
            ref:(node) => {
              input = node;
            }
          }}
          />
        <Button size='large' variant="contained" color="primary" type="submit">+ Add Todo</Button>
      </form>
    </div>
    </div>
  );
}

function App() {
  return (
  <ApolloProvider client={client}>
      <AddTodo/>
      <Todo/>
  </ApolloProvider>
  )}

render(<App />, document.getElementById("root"));
