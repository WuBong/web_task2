<template>
    <div>
      <!-- Toggle 버튼 -->
      <div class="toggle-buttons">
        <button 
          @click="toggleView('scroll')" 
          :class="{ active: currentView === 'scroll' }"
        >
          Scroll View
        </button>
        <button 
          @click="toggleView('table')" 
          :class="{ active: currentView === 'table' }"
        >
          Table View
        </button>
      </div>
  
      <!-- 현재 선택된 컴포넌트를 표시 -->
      <component :is="currentComponent" />
    </div>
  </template>
  
  <script>
  import PopularScroll from '../components/PopularScroll.vue';
  import PopularTable from '../components/PopularTable.vue';
  
  export default {
    components: {
      PopularScroll,
      PopularTable,
    },
    data() {
      return {
        currentView: 'scroll', // 초기 뷰
      };
    },
    computed: {
      currentComponent() {
        return this.currentView === 'scroll' ? 'PopularScroll' : 'PopularTable';
      },
    },
    methods: {
      toggleView(view) {
        this.currentView = view;
      },
    },
  };
  </script>
  
  <style scoped>
  .toggle-buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  button {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    background-color: #f0f0f0;
    border-radius: 5px;
    font-size: 16px;
  }
  
  button.active {
    background-color: #007bff;
    color: #fff;
  }
  </style>
  