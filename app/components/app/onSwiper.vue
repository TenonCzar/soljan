<script setup lang="ts">
const containerRef = ref(null)
// const slides = ref(Array.from({ length: 10 }))
const swiper = useSwiper(containerRef, {
  effect: 'creative',
  loop: true,
  autoplay: {
    delay: 2000,
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
})

onMounted(() => {
  console.log(swiper.instance)
})
</script>

<template>
  <ClientOnly>
    <swiper-container ref="containerRef" :init="false">
      <swiper-slide
        style="background-color: rgb(32, 233, 70); color: white;"
      >
      <div class="phone-cont">
          <img src="/phone.png" alt="">
      </div>
        Buy Crypto Currencies at Confortable Rates
      </swiper-slide>
    </swiper-container>
        <swiper-container ref="containerRef" :init="false">
      <swiper-slide
        style="background-color: rgb(32, 233, 70); color: white;"
      >    <swiper-container ref="containerRef" :init="false">
      <swiper-slide
        style="background-color: rgb(32, 233, 70); color: white;"
      >
      <div class="phone-cont">
          <img src="/phone.png" alt="">
      </div>
        Buy Crypto Currencies at Confortable Rates
      </swiper-slide>
    </swiper-container>    <swiper-container ref="containerRef" :init="false">
      <swiper-slide
        style="background-color: rgb(32, 233, 70); color: white;"
      >
      <div class="phone-cont">
          <img src="/phone.png" alt="">
      </div>
        Buy Crypto Currencies at Confortable Rates
      </swiper-slide>
    </swiper-container>
      <div class="phone-cont">
          <img src="/phone.png" alt="">
      </div>
        Buy Crypto Currencies at a Confortable Rates
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style lang="css">
.phone-cont{
    height: 300px;
    background: #000;
    overflow:hidden;
}
swiper-slide {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1em;
  font-size: 2em;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
}
</style>
