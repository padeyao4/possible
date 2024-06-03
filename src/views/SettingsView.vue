<script setup lang="ts">
import { useRoute } from '@/stores/route'

const { back } = useRoute()
</script>
<template>
  <div class="settings">
    <header>
      <my-icon icon="solar:arrow-left-linear" class="back-button" @click="back()" /> 设置
    </header>
    <main>
      <div class="container"></div>
    </main>
  </div>
</template>
<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-bottom-color);

  header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 64px;
    margin-top: 12px;
    font-size: 24px;
    border-bottom: var(--border-default-style);

    .back-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      margin: 8px;
      padding: 4px;

      &:hover {
        background-color: var(--background-top-color);
      }
    }
  }

  main {
    display: flex;
    justify-content: center;
    width: 100%;
    height: calc(100vh - 64px);
    overflow-y: auto;

    .container {
      display: flex;
      flex-direction: column;
      width: 550px;
      height: 100%;

      & > *:first-child {
        margin-top: 12px;
      }

      .item {
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-right: 0;
        margin-bottom: 12px;
        margin-left: 0;
        padding: 0 0 24px 0;
        border-bottom: var(--border-default-style);

        & > * {
          margin: 4px 0;
          padding: 4px 0;
        }

        input {
          padding: 8px;
          background-color: var(--background-middle-color);
          border: var(--border-default-style);
          border-radius: 4px;
          outline-style: none;
        }

        select {
          padding: 5px;
          background-color: var(--background-middle-color);
          border: var(--border-default-style);
          border-radius: 4px;

          & option {
            padding: 5px;
            background-color: var(--background-middle-color);
            border: var(--border-default-style);

            &:hover {
              background-color: var(--background-top-color);
            }
          }
          &:focus {
            outline: none;
          }
        }

        .description {
          padding: 8px;
          background-color: var(--background-middle-color);
          border: var(--border-default-style);
          border-radius: 4px;
          user-select: text;
        }

        button {
          width: fit-content;
          padding: 8px 12px;
          background-color: var(--primary-color);
          border: var(--border-default-style);
          border-radius: 3px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          /* 较深的边框 */
          cursor: pointer;

          &:hover {
            background-color: var(--primary-color-dark);
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
          }
        }
      }
    }
  }
}
</style>
