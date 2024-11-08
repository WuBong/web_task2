<template>
    <div>
      <button @click="toggleForm" class="toggle-button">
        {{ isLogin ? '회원가입으로 전환' : '로그인으로 전환' }}
      </button>
  
      <!-- Vue transition 사용 -->
      <transition name="fade">
        <div v-if="isLogin" key="login">
          <LoginForm />
        </div>
      </transition>
  
      <transition name="fade">
        <div v-if="!isLogin" key="login">
          <SignupForm />
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  import LoginForm from '../components/LoginForm.vue';
  import SignupForm from '../components/SignupForm.vue';
  
  export default {
    components: {
      LoginForm,
      SignupForm,
    },
    data() {
      return {
        isLogin: true,
      };
    },
    methods: {
      toggleForm() {
        this.isLogin = !this.isLogin;
      },
    },
  };
  </script>
  
  <style scoped>
  /* fade 애니메이션 정의 */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  
  /* 추가적인 스타일 */
  .toggle-button {
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    cursor: pointer;
  }
  </style>
  