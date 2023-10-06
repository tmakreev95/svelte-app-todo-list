import { addToast } from '../toast/toast-store';

export const addTodoAction = (state, data) => {
  if (!data.isCompleted) {
    let activeTodoList = state.lists.find(
      (list) => list.name === "active-todos"
    );

    activeTodoList.items.push(data);
  } else {
    let completedTodoList = state.lists.find(
      (list) => list.name === "completed-todos"
    );

    completedTodoList.items.push(data);
  }

  return { ...state };
};

export const deleteTodoAction = (state, data) => {
  const [item] = state.lists[data.listIndex].items.splice(data.itemIndex, 1);
  item.deleted = true;

  const deletedTodosListIndex = state.lists.findIndex(
    (list) => list.name === "deleted-todos"
  );

  state.lists[deletedTodosListIndex].items.push(item);

  return { ...state };
};

export const deleteAllTodosAction = (state) => {
  state.lists.forEach((list) => {
    if (list.items.length) {
      list.items = [];
    }
  });

  return { ...state };
};

export const restoreTodoAction = (state, data) => {
  const [item] = state.lists[data.listIndex].items.splice(data.itemIndex, 1);

  item.deleted = false;
  item.isCompleted = false;

  const activeTodosListIndex = state.lists.findIndex(
    (list) => list.name === "active-todos"
  );

  state.lists[activeTodosListIndex].items.push(item);

  return { ...state };
};

export const completeTodoAction = (state, data) => {
  const [item] = state.lists[data.listIndex].items.splice(data.itemIndex, 1);

  item.deleted = false;
  item.isCompleted = true;

  const completedTodosListIndex = state.lists.findIndex(
    (list) => list.name === "completed-todos"
  );
  state.lists[completedTodosListIndex].items.push(item);

  return { ...state };
};

export const dragEnterTodoAction = (state, payload) => {
  return { ...state, hoveringOverList: payload }
};

export const dragLeaveTodoAction = (state) => {
  return { ...state, hoveringOverList: null }
};

export const dropTodoAction = (state, payload) => {
  payload.event.preventDefault();

  const json = payload.event.dataTransfer.getData("text/plain");
  const data = JSON.parse(json);

  const [item] = state.lists[data.listIndex].items.splice(data.itemIndex, 1);
  state.lists[payload.listIndex].items.push(item);

  switch (state.hoveringOverList) {
    case "active-todos":
      {
        item.deleted = false;
        item.isCompleted = false;

        store.dispatch({
          type: "RESTORE_TODO",
          payload: {
            listIndex,
            itemIndex
          }
        });
      }
      break;
    case "deleted-todos":
      {
        item.deleted = true;

        addToast({
          title: "Danger!",
          message: `You have deleted: ${item.description}!`,
          type: "danger",
          dismissible: true,
          timeout: 2000
        });
      }
      break;
    case "completed-todos":
      {
        item.isCompleted = true;
        item.deleted = false;

        addToast({
          title: "Primary!",
          message: `You have completed: ${item.description}!`,
          type: "primary",
          dismissible: true,
          timeout: 2000
        });
      }
      break;
    default:
  }

  return { ...state, hoveringOverList: null };
};

export const addTodoToastSuccessAction = () => {
  addToast({
    title: "Success!",
    message: `You have successfully restored: ${item.description}!`,
    type: "success",
    dismissible: true,
    timeout: 2000,
  });
};

