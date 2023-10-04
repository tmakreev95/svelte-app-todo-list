<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher();

  export let type = "info";
  export let dismissible = true;
</script>

<div class="toast show mb-2 bg-{type}" transition:fade class:type>
  <div class="toast-header">
    <slot name="title"/>   
    {#if dismissible}
    <button type="button" class="btn-close" data-bs-dismiss="toast" on:click={() => dispatch("dismiss")}></button>
    {/if}
  </div>
  <slot name="message"/>  
</div>