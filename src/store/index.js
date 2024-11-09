// src/store/index.js
import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      // 상태 초기화
      user: null,
      isAuthenticated: false,
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('logout')
    }
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
  }
})

export default store
