<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

// const dialog = ref(false);

// const profile = ref(null);

// onMounted(async () => {
//     try {
//         if (user.value && profile.value === null) {
//             const { data } = await client.from("profiles").select('*').eq("id", user.value.id).single();
//             if (data) {
//                 profile.value = data;
//             }
//         }
//     } catch (error) {
//         console.error('Error fetching profile data:', error);
//     }
// });


// watch(
//     () => [user.value, profile.value],
//     ([userVal, profileVal]) => {
//         try {
//             if (userVal && profileVal === null) {
//                 dialog.value = true;
//             } else {
//                 dialog.value = false;
//             }
//         } catch (error) {
//             console.error('Error in watch function:', error);
//         }
//     },
//     { immediate: true }
// );

// const openBioData = () => {
//     navigateTo('/bio');
// };
const onboarding = await client.from("onboarding")
  .select("*")
  .eq("id", user.value.id)
  .single();

onMounted(() => {
  if (user.value && onboarding.data == null) {
    navigateTo('/onboarding');
  }
});
</script>
<template>
    <div class="min-h-screen flex flex-col">
        <theHeader />
        <main class="flex-1">
            <slot />
        </main>
        <theFooter />

        <!-- <div v-if="dialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 class="text-xl font-semibold mb-4">Fill Bio Data</h2>
            <p class="mb-6">Please Fill Bio Data to use the app.</p>
            <div class="flex justify-end space-x-2">
                <button @click="openBioData"
                class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Bio Data</button>
            </div>
            </div>
        </div> -->
    </div>
</template>