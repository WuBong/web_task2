<!--components/SignupForm.vue-->
<template>
    <div class="container mt-5">
      <h2>회원가입</h2>
      <form @submit.prevent="handleSignUp">
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
          <input type="password" class="form-control" id="password" v-model="password" required />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">비밀번호 확인</label>
          <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        <div class="form-check mb-3">
          <input 
            type="checkbox" 
            class="form-check-input" 
            id="termsCheckbox" 
            v-model="termsAgreed" 
            required 
          />
          <label class="form-check-label" for="termsCheckbox">
            <span :class="{ 'text-danger': !termsAgreed }">약관에 동의합니다.</span>
          </label>
        </div>
        <button type="submit" class="btn btn-primary">회원가입</button>
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
        confirmPassword: "",
        termsAgreed: false,
        wishlist: [],
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
    methods: {
      showToastMessage(message) {
        this.toastMessage = message;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      },
      handleSignUp() {
        if (!this.isEmailValid) {
          this.showToastMessage("아이디는 이메일 형식이어야 합니다.");
          return;
        }
        if (this.password !== this.confirmPassword) {
          this.showToastMessage("비밀번호가 일치하지 않습니다.");
          return;
        }
        if (!this.termsAgreed) {
          this.showToastMessage("약관에 동의해야 회원가입이 가능합니다.");
          return;
        }
        const userData = {
          id: this.id,
          password: this.password,
          isLoggedIn: false,
          wishlist: this.wishlist,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        this.showToastMessage("회원가입이 완료되었습니다!");
        
        // 부모 컴포넌트에 회원가입 성공 이벤트 전달
        this.$emit('signup-success'); // 부모 컴포넌트에서 로그인 폼으로 전환하도록 처리
  
        // 로그인 페이지로 리다이렉트
        this.$router.push("/signin");
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
  }
  </style>
  