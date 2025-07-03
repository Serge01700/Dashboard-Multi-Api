<template>
    <figure  class="bullet-point flex items-center w-20 h-10 justify-center rounded-full ">
        <img 
        v-if="image"
        :style="{ width: size, height:size}"  class="object-contain w-full h-full" :src="image" >
        <slot v-else/>
    </figure>
  
</template>

<script setup>
defineProps({
    image: String,

    alt:{
        type: String,
        default: 'Bullet icon'
    },
    size:{
        type: String,
        default: '40px'
    }
})

</script>

<style scoped>

</style>