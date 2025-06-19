<template>

  <div class="absolute top-[100px] left-[152px] w-full h-[2px] bg-gray-700">

 </div>
 <nav :class="[
    'absolute left-[50px] flex justify-center flex-colomn border p-2 w-[50px] rounded-3xl',
    isDarkMode ? 'bg-dark-card border-dark-border' : 'bg-dark border-light-border'
  ]">
    <ul class="">
      <li><img src="../assets/img/icons8-home-100.png" alt=""></li>
      <li><img src="../assets/img/icons8-increase-100.png" alt=""></li>
      <li><img src="../assets/img/icons8-calendrier-50.png" alt=""></li>
      <li><img src="../assets/img/icons8-météo-pomme-50.png" alt=""></li>
      <li><img src="../assets/img/icons8-to-do-100.png" alt=""></li>
      <li><img src="../assets/img/icons8-email-96.png" alt=""></li>
      <li><img src="../assets/img/icons8-settings-100.png" alt=""></li>
    </ul>
 </nav>
 <!-- Bar vertical -->
 <div class="absolute top-0 left-[150px] h-full w-[2px] bg-gray-700">

 </div>
</template>

<script setup>
defineProps({
  isDarkMode:{
    type: Boolean,
    required: true
  }
})
</script>

<style lang="scss" scoped>
ul {

  li{
    
     height: 67px;
     padding-top: 19px;
     cursor: pointer;

     img {
      height: 25px;
     }
  }
}
</style>