<template>
  <div class="mail-dashboard rounded-t-[15px]   w-full h-full "
    :class="[
        isDarkMode ? 'bg-dark-card' : 'bg-light-card',
      'border-dark-border border-b-2'
         ]"
    >
        <h1 class="p-3 text-2xl font-thin border-b-2 border-dark-border p-2"
        :class="[
        isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary'
        ]">Emails</h1>
        <main class="grid grid-cols-[30%_70%] ">
            <section class="left-mail border-r-2">
                <ul class="flex flex-row gap-2">
                    <li>All Mail</li>
                    <li>Unread</li>
                    <li>Active</li>
                </ul>
            </section>
            <section class="right-mail">

            </section>
        </main>
  </div>
</template>

<script setup>
const props = defineProps({
    isDarkMode : {
        type: Boolean,
        required: true
    }
})
</script>

<style>

</style>