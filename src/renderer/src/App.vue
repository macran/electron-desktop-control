<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  const remoteCode = ref('');
  const localCode = ref('');
  const controlText = ref('');

  const login = async () => {
    let code = await window.electron.ipcRenderer.invoke('login');
    localCode.value = code;
  };
  onMounted(() => {
    login();
    window.electron.ipcRenderer.on('control-state-change', handleControlState);
  });

  onUnmounted(() => {
    window.Electron.ipcRenderer.removeListener('control-state-change', handleControlState);
  });

  const startControl = async (remoteCode) => {
    await window.electron.ipcRenderer.send('control', remoteCode);
  };
  const handleControlState = (_, name, type) => {
    console.log(name);
    let text = '';
    if (type === 1) {
      text = `正在远程控制${name}`;
    } else if (type === 2) {
      text = `被${name}远程控制中`;
    }
    controlText.value = text;
  };
</script>

<template>
  <header>

    <div class="wrapper">
      <div v-if="controlText">
        {{ controlText }}
      </div>
      <div v-else>
        <div>你的控制码是:{{ localCode }}</div>
        <input type="text" v-model="remoteCode">
        <button @click="startControl(remoteCode)">确定</button>
      </div>
    </div>
  </header>

</template>

<style scoped>
  header {
    line-height: 1.5;
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
      margin: 0 2rem 0 0;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
  }
</style>
