<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();


let onboarding = { data: null };

onMounted(async () => {
    if (user.value && user.value.id) {
        const { data } = await client.from("onboarding")
            .select("*")
            .eq("id", user.value.id)
            .single();
        
        onboarding.data = data;
        if (onboarding.data == null) {
            navigateTo('/onboarding');
        }
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
    </div>
</template>