<script lang='ts'>
  import Toast from './Toast.svelte';

  import { dismissToast, toasts } from '../../stores/toast-store';
</script>

{#if $toasts}
  <div class="toaster-container d-flex flex-column">
    {#each $toasts as toast (toast.id)}
      <Toast        
        type={toast.type}
        dismissible={toast.dismissible}
        on:dismiss={() => dismissToast(toast.id)}>
        <strong class="me-auto" slot="title">
          {toast.title}
        </strong>

        <div class="toast-body text-white" slot="message">
          {toast.message}
        </div>
        </Toast
      >
    {/each}
  </div>
{/if}

<style>
  .toaster-container {
    position: fixed;
    top: 0;
    right: 12px;
    width: 50%;
    margin-top: 1rem;
    justify-content: center;
    flex-direction: column;
    align-items: flex-end;
    z-index: 1000;
  }
</style>
