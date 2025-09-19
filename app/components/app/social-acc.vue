<template>
  <div class="quick-signups w-full ">
    <div class="btns w-full max-w-[600px] items-center flex flex-col gap-4">
      <Button
        class="flex items-center gap-8 justify-center bg-gray-400/20 px-6 py-2 rounded-full hover:text-green-400 cursor-pointer hover:"
        @click="googleSign"
        ><img src="/images/google.png" width="20" alt="">Continue With
        Google</Button
      ><Button
        class="flex items-center gap-8 justify-center bg-gray-400/20 px-6 py-2 rounded-full hover:text-green-400 cursor-pointer hover:"
        @click="appleSign"
        ><img src="/images/apple.png" width="25" class="invert bg-red-500" alt="">Continue With
        AppleId</Button
      >
      <Button
        class="flex items-center gap-8 justify-center bg-gray-400/20 px-6 py-2 rounded-full hover:text-green-400 cursor-pointer hover:"
        @click="twitterSign"
        ><img src="/images/twitter.png" width="25" alt="">Continue With
        Twitter</Button
      >
    </div>
  </div>
</template>
