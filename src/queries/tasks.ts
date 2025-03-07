import { gql } from "urql";

export const getAllTasks = gql`
  query getAllTasks {
    task {
      id
      title
      dueDate
      description
      status
      user
    }
  }
`;

export const addNewTask = gql`
  mutation addNewTask($values: [TaskInsertInput!]!) {
    insertIntoTask(values: $values) {
      id
      title
      description
      dueDate
      status
      user
    }
  }
`;

export const updateSingleTask = gql`
  mutation updateTask($set: TaskUpdateInput!, $where: TaskFilters) {
    updateTask(set: $set, where: $where) {
      id
      title
      description
      dueDate
      status
      user
    }
  }
`;

export const deleteSingleTask = gql`
  mutation deleteFromTask($where: TaskFilters!) {
    deleteFromTask(where: $where) {
      id
    }
  }
`;
