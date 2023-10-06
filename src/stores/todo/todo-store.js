import { createStore } from 'redux';
import {
	addTodoAction,
	deleteTodoAction,
	restoreTodoAction,
	deleteAllTodosAction,
	completeTodoAction,
	dragEnterTodoAction,
	dragLeaveTodoAction,
	dropTodoAction
} from './todo-store-actions';



const initialState = {
	hoveringOverList: '',
	lists: [
		{
			id: 1,
			title: "Active Todo Items",
			name: "active-todos",
			items: []
		},
		{
			id: 2,
			title: "Completed Todo Items",
			name: "completed-todos",
			items: []
		},
		{
			id: 3,
			title: "Deleted Todo Items",
			name: "deleted-todos",
			items: []
		},

	]

};



function reducer(state = initialState, action) {
	switch (action.type) {
		case 'ADD_TODO':
			return addTodoAction(state, action.payload);
		case 'DELETE_TODO':
			return deleteTodoAction(state, action.payload);
		case 'DELETE_ALL_TODOS':
			return deleteAllTodosAction(state);
		case 'RESTORE_TODO':
			return restoreTodoAction(state, action.payload);
		case 'COMPLETE_TODO':
			return completeTodoAction(state, action.payload);
		case 'DRAG_ENTER_TODO':
			return dragEnterTodoAction(state, action.payload);
		case 'DRAG_LEAVE_TODO':
			return dragLeaveTodoAction(state);
		case 'DROP_TODO':
			return dropTodoAction(state, action.payload);
		default:
			return state
	}
}

function svelteStoreEnhancer(createStoreApi) {
	return function (reducer, initialState) {
		const reduxStore = createStoreApi(
			reducer, initialState
		);

		return {
			...reduxStore,

			subscribe(fn) {
				fn(reduxStore.getState());

				return reduxStore.subscribe(() => {
					fn(reduxStore.getState());
				});
			}
		}
	}
}

export default createStore(reducer, svelteStoreEnhancer);