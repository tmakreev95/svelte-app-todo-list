<script>
	import ToDoItemComponent from "./ToDoItemComponent.svelte";
	import Toasts from "./components/toast/Toasts.svelte";
	import { addToast } from "./stores/toast-store";

	import { scale } from "svelte/transition";
	import { flip } from "svelte/animate";

	import Fa from "svelte-fa";
	import { faPlus, faDumpster } from "@fortawesome/free-solid-svg-icons";

	let descriptionInputValue;

	$: disableCheckbox = !descriptionInputValue;

	let todosLists = [
		{
			id: 1,
			title: "Active Todo Items",
			name: "active-todos",
			items: [],
		},
		{
			id: 2,
			title: "Completed Todo Items",
			name: "completed-todos",
			items: [],
		},
		{
			id: 3,
			title: "Deleted Todo Items",
			name: "deleted-todos",
			items: [],
		},
	];

	let formEl;
	let hoveringOverList = "";

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

			if (!todo.isCompleted) {
				let activeTodoList = todosLists.find(
					(list) => list.name === "active-todos"
				);
				activeTodoList.items.push(todo);
			} else {
				let completedTodoList = todosLists.find(
					(list) => list.name === "completed-todos"
				);
				completedTodoList.items.push(todo);
			}

			todosLists = todosLists;
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
		const todo = event.detail.todo;
		const listIndex = event.detail.listIndex;
		const itemIndex = event.detail.itemIndex;

		todo.deleted = true;

		const [item] = todosLists[listIndex].items.splice(itemIndex, 1);
		const deletedTodosListIndex = todosLists.findIndex(
			(list) => list.name === "deleted-todos"
		);
		todosLists[deletedTodosListIndex].items.push(item);
		todosLists = todosLists;

		addToast({
			title: "Danger!",
			message: `You have deleted: '${todo.description}'!`,
			type: "danger",
			dismissible: true,
			timeout: 2000,
		});
	};

	const restoreTodo = (event) => {
		const todo = event.detail.todo;
		const listIndex = event.detail.listIndex;
		const itemIndex = event.detail.itemIndex;

		todo.deleted = false;
		todo.isCompleted = false;

		console.log(todosLists[listIndex]);

		const [item] = todosLists[listIndex].items.splice(itemIndex, 1);
		const activeTodosListIndex = todosLists.findIndex(
			(list) => list.name === "active-todos"
		);
		todosLists[activeTodosListIndex].items.push(item);
		todosLists = todosLists;

		addToast({
			title: "Success!",
			message: `You have successfully restored: '${todo.description}'!`,
			type: "success",
			dismissible: true,
			timeout: 2000,
		});
	};

	const completeTodo = (event) => {
		const todo = event.detail.todo;
		const listIndex = event.detail.listIndex;
		const itemIndex = event.detail.itemIndex;

		todo.deleted = false;
		todo.isCompleted = true;

		const [item] = todosLists[listIndex].items.splice(itemIndex, 1);
		const completedTodosListIndex = todosLists.findIndex(
			(list) => list.name === "completed-todos"
		);
		todosLists[completedTodosListIndex].items.push(item);
		todosLists = todosLists;

		addToast({
			title: "Primary!",
			message: `You have completed: '${todo.description}'!`,
			type: "primary",
			dismissible: true,
			timeout: 2000,
		});
	};

	const deleteAllTodos = () => {
		if (todosLists.some((list) => list.items.length)) {
		}

		todosLists.forEach((list) => {
			if (list.items.length) {
				list.items = [];
			}
		});

		todosLists = todosLists;

		addToast({
			title: "Danger!",
			message: "You have deleted all todos!",
			type: "danger",
			dismissible: true,
			timeout: 2000,
		});
	};

	function dragStart(event, listIndex, itemIndex) {
		const data = { listIndex, itemIndex };
		event.dataTransfer.setData("text/plain", JSON.stringify(data));
	}

	function drop(event, listIndex) {
		event.preventDefault();
		const json = event.dataTransfer.getData("text/plain");
		const data = JSON.parse(json);

		const [item] = todosLists[data.listIndex].items.splice(data.itemIndex, 1);

		todosLists[listIndex].items.push(item);
		todosLists = todosLists;

		switch (hoveringOverList) {
			case "active-todos":
				{
					item.deleted = false;
					item.isCompleted = false;

					addToast({
						title: "Success!",
						message: `You have successfully restored: ${item.description}!`,
						type: "success",
						dismissible: true,
						timeout: 2000,
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
						timeout: 2000,
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
						timeout: 2000,
					});
				}
				break;
			default:
		}

		hoveringOverList = null;
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
							on:click={addTodo}><Fa icon={faPlus} size="1.5x"/></button
						>
					</div>
					<div class="flex-grow-0">
						<button
							type="button"
							class="btn btn-danger mb-3 form-action-elements"
							on:click={deleteAllTodos}><Fa icon={faDumpster} size="1.5x" /></button
						>
					</div>
				</div>
			</form>
		</div>
	</div>
	<hr class="mb-2 mt-0" />
	<div class="row">
		{#each todosLists as list, listIndex (list)}
			<div class="col-12 col-sm-6 col-lg-4">
				<h4>{list.title}</h4>
				<hr />
				<ol
					class="list-group list-group-numbered mt-2 h-100"
					on:dragenter={() => (hoveringOverList = list.name)}
					on:dragleave={() => (hoveringOverList = null)}
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
							on:dragstart={(event) => dragStart(event, listIndex, itemIndex)}
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
