<script setup>
definePageMeta({
    layout: 'auth',
});
const tab = ref(null);

</script>
<template>
    <div>
        <v-container>
            <h1 class="text-h2">Welcome back!</h1>
            <p>Enter your credentials to access your account</p>
            <form class="mt-16">
                <v-label>Email Address</v-label><br><br>
                <v-text-field v-model="email" type="email" placeholder="Enter your email"
                    variant="outlined"></v-text-field>
                <v-row>
                    <v-col>
                        <v-label>Password</v-label>
                    </v-col>
                    <v-col>
                        <NuxtLink to="/forget" style="color: #2096F3;">Forgot Password?</NuxtLink>
                    </v-col>
                </v-row><br>
                <v-text-field v-model="password" type="password" placeholder="Enter your password"
                    variant="outlined"></v-text-field>
                <v-btn type="submit" color="primary">Login</v-btn>
            </form>
        </v-container>
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