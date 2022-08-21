<script type="ts">
    import AddServer from "../components/AddServer.svelte";
    import Modal from "../lib/modal/Modal.svelte";
    import TopBar from "../components/TopBar.svelte";
    import TableMonitor from "../components/TableMonitor.svelte";
   import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let showAddServerModal = false;


    // Functions

    function handleShowAddServer() {
        showAddServerModal = true;
    }




</script>




<TopBar on:showAddServerClick={handleShowAddServer}/>
<TableMonitor/>
<Modal bind:show={showAddServerModal}>
    <AddServer on:submit={() => {showAddServerModal = false}}/>
</Modal>

