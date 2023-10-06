<script>
	import { createEventDispatcher } from "svelte";

	import Fa from "svelte-fa";
	import { faTrash, faTrashRestore } from "@fortawesome/free-solid-svg-icons";

	export let todo;
	export let listIndex;
	export let itemIndex;

	$: disableCondition = !todo.description || !todo.title;
	$: disableCompletedBtn = todo.isCompleted;
	$: todo.title = !!todo.title ? todo.title : "Default todo title";
	$: todo.description = !!todo.description
		? todo.description
		: "Default todo description";

	const dispatch = createEventDispatcher();

	const deleteTodo = (todo) => {
		dispatch("deleteTodoEvent", {
			todo,
			listIndex,
			itemIndex,
		});
	};

	const restoreTodo = (todo) => {
		dispatch("restoreTodoEvent", {
			todo,
			listIndex,
			itemIndex,
		});
	};

	const completeTodo = (todo) => {
		dispatch("completeTodoEvent", {
			todo,
			listIndex,
			itemIndex,
		});
	};
</script>

<div class="ms-2 me-auto">
	<div
		class:text-decoration-line-through={todo.isCompleted}
		class="todo-description"
		bind:innerHTML={todo.description}
		contenteditable
	/>
</div>

{#if todo.deleted}
	<button
		type="button"
		disabled={disableCondition}
		class="btn btn-success mx-2 align-self-center todo-action-btn p-1"
		on:click={restoreTodo(todo)}><Fa icon={faTrashRestore} /></button
	>
{/if}

{#if !todo.deleted}
	<button
		type="button"
		disabled={disableCondition}
		class="btn btn-danger mx-2 align-self-center todo-action-btn p-1"
		on:click={deleteTodo(todo)}><Fa icon={faTrash} /></button
	>
{/if}
<input
	class="form-check-input mt-0 p-3"
	name="isCompleted"
	type="checkbox"
	required
	disabled={disableCondition || disableCompletedBtn}
	on:change={completeTodo(todo)}
	bind:value={todo.isCompleted}
	bind:checked={todo.isCompleted}
	aria-label="Checkbox for following text input"
/>

<style>
	.todo-description {
		padding: 0.5em;
		border: 1px solid #eee;
		border-radius: 4px;
	}

	.todo-action-btn {
		width: 34px;
		height: 34px;
	}
</style>
