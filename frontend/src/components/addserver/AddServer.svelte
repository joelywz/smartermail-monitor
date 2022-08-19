<script type="ts">
  import { createEventDispatcher } from "svelte";
  import InputField from "./InputField.svelte";
  import type { ServerInfo } from '../../smartermail'

  const dispatch = createEventDispatcher();

  let host = "";
  let username = "";
  let password = "";
  let online: boolean | null = null;
  let isTestingConnection: boolean = false;
  export let handleTest: (info: ServerInfo) => Promise<boolean> | undefined = undefined;

  $: canSubmit = host != "" && username != "" && password != "";
  $: connectionColor = getConnectionColor(online);

  function getConnectionColor(x: boolean | null) {
    if (x == null) {
      return "bg-neutral-300";
    } else if (x) {
      return "bg-green-500";
    } else {
      return "bg-red-500";
    }
  }

  async function testConnection() {
    online = null;
    isTestingConnection = true;

    if (handleTest == undefined) {
      online = null;
      isTestingConnection = false;
      return;
    }

    let success = await handleTest({
      host,
      username,
      password,
    })

    console.log("Success")

    if (success) {
      online = true;
    } else {
      online = false;
    }

    isTestingConnection = false;
  }

  function handleSubmit() {
    dispatch("submit", {
      host,
      username,
      password,
    });
  }
</script>

<div class="p-8 max-w-sm w-full overflow-scroll" style="width: 400px;">
  <h1 class="text-lg font-semibold mb-4">Add Server</h1>
  <form
    class="text-sm flex flex-col gap-5"
    autocomplete="off"
    spellcheck="false"
    on:submit={handleSubmit}
    on:submit|preventDefault={() => console.log("submit")}
  >
    <InputField
      id="host-input"
      label="Host"
      bind:value={host}
      disabled={isTestingConnection}
    />
    <InputField
      id="username-input"
      label="Username"
      bind:value={username}
      disabled={isTestingConnection}
    />
    <InputField
      id="password-input"
      type="password"
      label="Password"
      bind:value={password}
      disabled={isTestingConnection}
    />

    <div class="flex flex-row items-center gap-2">
      <div
        class={`w-2 h-2 rounded-full transition-colors duration-200 ${connectionColor} ${
          isTestingConnection ? "animate-ping" : null
        }`}
      />
      <button
        on:click={testConnection}
        type="button"
        class={`text-blue-500 disabled:text-neutral-500 transition-all duration-200`}
        disabled={isTestingConnection || !canSubmit}>Test Connection</button
      >
    </div>

    <button
      type="submit"
      class="bg-blue-500 px-2 py-2 text-white rounded-sm"
      disabled={!canSubmit}>Add Server</button
    >
  </form>
</div>
