<script>
	import ToDoItemComponent from "./components/todo-item/ToDoItemComponent.svelte";
	import Toasts from "./components/toast/Toasts.svelte";
	import { addToast } from "./stores/toast/toast-store";

	import { scale } from "svelte/transition";
	import { flip } from "svelte/animate";

	import Fa from "svelte-fa";
	import { faPlus, faDumpster } from "@fortawesome/free-solid-svg-icons";
	import store from "./stores/todo/todo-store";

	let descriptionInputValue;
	$: disableCheckbox = !descriptionInputValue;
	let formEl;

	const addTodo = () => {
		if (formEl.checkValidity()) {
			const formData = new FormData(formEl);

			const todo = {};

			for (let [key, value] of formData.entries()) {
				todo[key] = value;
			}

			todo.isCompleted = !!todo["isCompleted"];
			todo.deleted = !!todo["deleted"];

			todo.id = Math.floor(Math.random() * 10000);

			store.dispatch({ type: "ADD_TODO", payload: todo });

			formEl.reset();

			addToast({
				title: "Success!",
				message: `You have successfully added: '${todo.description}'!`,
				type: "success",
				dismissible: true,
				timeout: 2000,
			});
		}
	};

	const deleteTodo = (event) => {
		const listIndex = event.detail.listIndex;
		const itemIndex = event.detail.itemIndex;

		store.dispatch({
			type: "DELETE_TODO",
			payload: {
				listIndex,
				itemIndex,
			},
		});

		addToast({
			title: "Danger!",
			message: `You have deleted: '${event.detail.todo.description}'!`,
			type: "danger",
			dismissible: true,
			timeout: 2000,
		});
	};

	const restoreTodo = (event) => {
		const listIndex = event.detail.listIndex;
		const itemIndex = event.detail.itemIndex;

		store.dispatch({
			type: "RESTORE_TODO",
			payload: {
				listIndex,
				itemIndex,
			},
		});

		addToast({
			title: "Success!",
			message: `You have successfully restored: '${event.detail.todo.description}'!`,
			type: "success",
			dismissible: true,
			timeout: 2000,
		});
	};

	const completeTodo = (event) => {
		const listIndex = event.detail.listIndex;
		const itemIndex = event.detail.itemIndex;

		store.dispatch({
			type: "COMPLETE_TODO",
			payload: {
				listIndex,
				itemIndex,
			},
		});

		addToast({
			title: "Primary!",
			message: `You have completed: '${event.detail.todo.description}'!`,
			type: "primary",
			dismissible: true,
			timeout: 2000,
		});
	};

	const deleteAllTodos = () => {
		store.dispatch({
			type: "DELETE_ALL_TODOS",
		});

		addToast({
			title: "Danger!",
			message: "You have deleted all todos!",
			type: "danger",
			dismissible: true,
			timeout: 2000,
		});
	};

	const dragEnter = (listName) => {
		store.dispatch({ type: "DRAG_ENTER_TODO", payload: listName });
	};

	const dragLeave = () => {
		store.dispatch({ type: "DRAG_LEAVE_TODO" });
	};

	function dragStart(event, listIndex, itemIndex) {
		const data = { listIndex, itemIndex };

		event.dataTransfer.setData("text/plain", JSON.stringify(data));
	}

	function drop(event, listIndex) {
		store.dispatch({
			type: "DROP_TODO",
			payload: {
				event,
				listIndex,
			},
		});
	}
</script>

<Toasts />

<h1 class="text-center">Todo List App</h1>

<div class="container-fluid mt-3">
	<div class="row d-flex">
		<div class="col-12 col-sm-6">
			<form on:submit|preventDefault bind:this={formEl}>
				<input type="hidden" id="deleted" name="deleted" value="" />

				<div class="d-flex align-items-center">
					<div class="flex-grow-1 me-3 w-100">
						<div class="form-floating mb-3 w-100">
							<input
								bind:value={descriptionInputValue}
								type="text"
								required
								id="description"
								name="description"
								class="form-control"
								placeholder="Enter description..."
							/>

							<label for="description">Description</label>
						</div>
					</div>

					<div class="flex-grow-0 me-3">
						<div class="input-group mb-3">
							<input
								class="form-check-input form-control mt-0 form-action-elements"
								name="isCompleted"
								type="checkbox"
								disabled={disableCheckbox}
								aria-label="Checkbox for following text input"
								data-bs-toggle="tooltip"
								data-bs-placement="top"
								title="Select it if the todo is completed"
							/>
						</div>
					</div>

					<div class="flex-grow-0 me-3">
						<button
							type="button"
							class="btn btn-success mb-3 form-action-elements"
							on:click={addTodo}
							><Fa icon={faPlus} size="1.5x" /></button
						>
					</div>

					<div class="flex-grow-0">
						<button
							type="button"
							class="btn btn-danger mb-3 form-action-elements"
							on:click={deleteAllTodos}
							><Fa icon={faDumpster} size="1.5x" /></button
						>
					</div>
				</div>
			</form>
		</div>
	</div>

	<hr class="mb-2 mt-0" />

	<div class="row">
		{#each $store.lists as list, listIndex (list)}
			<div class="col-12 col-sm-6 col-lg-4">
				<h4>{list.title}</h4>

				<hr />

				<ol
					class="list-group list-group-numbered mt-2 h-100"
					on:dragenter={dragEnter(list.name)}
					on:dragleave={dragLeave}
					on:drop={(event) => drop(event, listIndex)}
					ondragover="return false"
				>
					{#each list.items as todo, itemIndex (todo)}
						<li
							animate:flip={{ duration: 300 }}
							out:scale={{ duration: 250 }}
							in:scale={{ duration: 250 }}
							class="list-group-item d-flex justify-content-between align-items-center draggable"
							draggable={true}
							on:dragstart={(event) =>
								dragStart(event, listIndex, itemIndex)}
						>
							<ToDoItemComponent
								{todo}
								{listIndex}
								{itemIndex}
								on:deleteTodoEvent={deleteTodo}
								on:restoreTodoEvent={restoreTodo}
								on:completeTodoEvent={completeTodo}
							/>
						</li>
					{:else}
						<li>
							<h5>No todo items added in the list!</h5>
						</li>
					{/each}
				</ol>
			</div>
		{/each}
	</div>
</div>

<style>
	.form-action-elements {
		height: 58px;

		width: 58px;
	}

	.list-group-numbered > .list-group-item::before {
		font-size: 1.5rem;

		border-right: 1px solid #dee2e6;

		padding-right: 15px;

		margin-right: 15px;
	}

	.draggable {
		cursor: move;
	}
</style>
