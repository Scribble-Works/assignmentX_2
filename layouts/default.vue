<script setup>
const user = useSupabaseUser();
const client = useSupabaseClient();

const profile = await client.from("profiles").select('*').eq("id", user.value.id)
    .single();;
const alert = ref(false);
// console.log(profile);

watchEffect(() => {
    if (user.value && profile.data === null) {
        alert.value = true;
    } else {
        alert.value = false;
    }
});

const openBioData = () => {
    navigateTo('/bio');
};
</script>
<template>
    <div class="min-h-screen flex flex-col">
        <theHeader />
        <main class="flex-1">
            <slot />
        </main>
        <theFooter />

        <v-dialog v-model="alert" max-width="500" persistent>
            <v-card>
                <v-card-title class="headline">Fill Bio Data</v-card-title>
                <v-card-text>Please Fill Bio Data to use the app.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="openBioData" color="secondary">Bio Data</v-btn>
                    <!-- <v-btn color="primary" @click="closeAlert">Close</v-btn> -->
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>