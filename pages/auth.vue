<script setup>
const tab = ref(null);

</script>
<template>
    <div class="container mx-auto flex justify-center items-center min-h-screen">
        <v-card elevation="0">
            <v-tabs v-model="tab" align-tabs="center">
                <v-tab value="1">Login</v-tab>
                <v-tab value="2">Sign Up</v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab" class="w-full">
                <v-tabs-window-item value="1">
                    <v-container>
                        <login />
                    </v-container>
                </v-tabs-window-item>
                <v-tabs-window-item value="2">
                    <v-container>
                        <signup />
                    </v-container>
                </v-tabs-window-item>
            </v-tabs-window>
        </v-card>

    </div>
</template>
<style>
.spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #000;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>