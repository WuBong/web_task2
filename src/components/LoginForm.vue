<!-- components/LoginForm.vue-->
<template>
    <div class="container mt-5">
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="id" class="form-label">아이디 (이메일 형식)</label>
          <input 
            type="text" 
            class="form-control" 
            id="id" 
            v-model="id" 
            required 
            :class="{ 'is-invalid': !isEmailValid && id }"
          />
          <div class="invalid-feedback">
            유효한 이메일 주소를 입력해주세요.
          </div>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">비밀번호</label>
          <input 
            type="password" 
            class="form-control" 
            id="password" 
            v-model="password" 
            required 
          />
        </div>
        <div class="form-check mb-3">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="rememberMe" 
            v-model="rememberMe" 
          />
          <label class="form-check-label" for="rememberMe">Remember me</label>
        </div>
        <button type="submit" class="btn btn-primary">로그인</button>
      </form>
  
      <!-- Toast 메시지 -->
      <div 
        class="toast-container position-fixed bottom-0 end-0 p-3" 
        style="z-index: 11">
        <div 
          class="toast" 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true" 
          :class="{ 'show': showToast }"
          data-bs-autohide="true">
          <div class="toast-header">
            <strong class="me-auto">알림</strong>
            <button 
              type="button" 
              class="btn-close" 
              @click="showToast = false" 
              aria-label="Close"></button>
          </div>
          <div class="toast-body">
            {{ toastMessage }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        id: "",
        password: "",
        rememberMe: false,
        showToast: false,
        toastMessage: "",
      };
    },
    computed: {
      isEmailValid() {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(this.id);
      },
    },
    created() {
      // 페이지 로드 시 로컬 스토리지의 Remember me 설정 확인
      const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
      if (rememberedUser && rememberedUser.rememberMe) {
        this.id = rememberedUser.id;
        this.password = rememberedUser.password;
        this.rememberMe = true;
        this.handleLogin(); // 자동 로그인 시도
      }
    },
    methods: {
      showToastMessage(message) {
        this.toastMessage = message;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      },
      handleLogin() {
        if (!this.isEmailValid) {
          this.showToastMessage("아이디는 이메일 형식이어야 합니다.");
          return;
        }
        
        const storedUser = JSON.parse(localStorage.getItem("user"));
        
        if (storedUser && storedUser.id === this.id && storedUser.password === this.password) {
          storedUser.isLoggedIn = true;
          localStorage.setItem("user", JSON.stringify(storedUser));
  
          // Remember me 설정 저장
          if (this.rememberMe) {
            localStorage.setItem("rememberedUser", JSON.stringify({
              id: this.id,
              password: this.password,
              rememberMe: this.rememberMe,
            }));
          } else {
            localStorage.removeItem("rememberedUser");
          }
            // 페이지 이동
          window.location.href = '/';
          this.showToastMessage("로그인 성공!");
  

        } else {
          this.showToastMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
  }
  </style>
  