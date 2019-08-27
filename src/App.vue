<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
  body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overscroll-behavior: none;
    margin: 0;
    padding: 0;
  }

  #app {
    text-align: center;
    min-width: 1000px;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 20px;
    line-height: 24px;
    padding: 30px 40px;
    min-width: 180px;
    max-width: 400px;
    color: white;
    background-color: #ff3871;
    z-index: 150;
    border-radius: 16px;
  }
</style>
