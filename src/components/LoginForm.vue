<template>
    <v-card class="pa-4">
      <v-card-title class="text-h5">로그인</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
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
  
          <v-checkbox
            v-model="rememberMe"
            label="로그인 상태 유지"
          ></v-checkbox>
  
          <v-btn type="submit" color="primary" class="mt-4" block>로그인</v-btn>
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
        rememberMe: false,
      };
    },
    methods: {
      login() {
        // 로그인 로직 처리
        console.log("로그인 시도:", this.email, this.password, this.rememberMe);
        this.$emit('toggleForm'); // 로그인 성공 시 홈 화면으로 이동하도록 설정 가능
      },
    },
  };
  </script>
  
  <style scoped>
  /* 추가적인 스타일 */
  </style>
  