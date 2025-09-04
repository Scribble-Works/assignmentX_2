<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();
const router = useRouter();

let onboarding = { data: null };
let profile = { data: null };

onMounted(async () => {
    if (user.value && user.value.id) {
        const { data } = await client.from("onboarding")
            .select("*")
            .eq("id", user.value.id)
            .single();
        
        onboarding.data = data;
        profile = await client.from("profiles")
            .select("*")
            .eq("id", user.value.id)
            .single();
        
        // profile.data = profileData;
        if(profile.data == null) {
            router.push("/bio");
        } else if (onboarding.data == null) {
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