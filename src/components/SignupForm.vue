<template>
    <v-card class="pa-4">
      <v-card-title class="text-h5">회원가입</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="signup">
          <v-text-field
            label="이메일"
            v-model="email"
            type="email"
            required
          ></v-text-field>
  
          <v-text-field
            label="비밀번호"
            v-model="password"
            type="password"
            required
          ></v-text-field>
  
          <v-text-field
            label="비밀번호 확인"
            v-model="passwordConfirmation"
            type="password"
            required
          ></v-text-field>
  
          <v-checkbox
            v-model="agreeTerms"
            label="이용약관에 동의합니다"
            required
          ></v-checkbox>
  
          <v-btn type="submit" color="primary" class="mt-4" block>회원가입</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        passwordConfirmation: '',
        agreeTerms: false,
      };
    },
    methods: {
      signup() {
        if (this.password !== this.passwordConfirmation) {
          alert('비밀번호가 일치하지 않습니다.');
          return;
        }
        // 회원가입 로직 처리
        console.log("회원가입 시도:", this.email, this.password);
        this.$emit('toggleForm'); // 회원가입 후 로그인 화면으로 돌아가기
      },
    },
  };
  </script>
  
  <style scoped>
  /* 추가적인 스타일 */
  </style>
  