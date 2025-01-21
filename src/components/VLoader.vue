
<template>
  <span class="loader"></span>
</template>

<style scoped>
  .loader {
    width: max(2vw, 30px);
    height: max(2vw, 30px);
    border: 5px solid #849FB1;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
