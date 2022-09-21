<template>
  <div id="app">
    <router-view />
    <loginForm></loginForm>
    <registerForm></registerForm>
  </div>
</template>
<script>
  import loginForm from '@/components/LoginForm';
  import registerForm from '@/components/RegisterForm';

  export default  {
    data() {
      return {
      }
    },
    components: {
      loginForm,
	  registerForm
    },
    computed: {
    }
  }
</script>
<style>
.header {
  margin: 1.5em;
  text-align: center;
  a {
    margin: 0 0.3em;
    color: inherit;
    font-weight: bold;
  }
}
</style>
