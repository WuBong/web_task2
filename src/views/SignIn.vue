<template>
    <div class="d-flex justify-content-center align-items-center flex-column" style="height: 100vh;">

      <!-- 부트스트랩 스타일 적용된 토글 버튼 -->
      <button @click="toggleForm" class="btn btn-dark mb-4">
        {{ isLogin ? '회원가입' : '로그인' }}
      </button>
  
      <!-- Vue transition 사용 -->
      <transition name="fade">
        <div v-if="isLogin" key="login">
          <LoginForm />
        </div>
      </transition>
  
      <transition name="fade">
        <div v-if="!isLogin" key="signup">
          <SignupForm @signup-success="onSignupSuccess" />
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
        isLogin: true, // 로그인 폼이 기본적으로 표시되도록 설정
      };
    },
    methods: {
      toggleForm() {
        this.isLogin = !this.isLogin; // 폼을 전환
      },
      onSignupSuccess() {
        // 회원가입 성공 시 로그인 폼으로 전환
        this.isLogin = true;
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
  