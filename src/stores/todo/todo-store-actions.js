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