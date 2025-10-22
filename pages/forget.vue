<script setup>
import { useMediaQuery } from '@vueuse/core';
const mobile = useMediaQuery('(max-width: 600px)');
definePageMeta({
    layout: 'auth',
});
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const email = ref('');
const alert = ref(false);
const text = ref('');
const resetPassword = async () => {
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value || !emailPattern.test(email.value)) {
        text.value = 'Please enter a valid email address.';
        alert.value = true;
        return;
    }
    try {
        const { data, error } = await auth.resetPasswordForEmail(email.value);
        console.log(data);
        if (error) {
            text.value = error.message || 'An error occurred. Please try again later.';
            alert.value = true;
            console.error(error);
        } else {
            text.value = 'Password reset email sent! Please check your inbox.';
            alert.value = true;
            // router.push('/auth');
        }
    } catch (error) {
        text.value = error.message || 'An error occurred. Please try again later.';
        alert.value = true;
        console.error(error);
    }
};

const backLogin = () => {
    router.push('/auth');
};
</script>
<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col cols="" lg="6" md="12" sm="12" class="mt-16 pt-16">
                    <form @submit.prevent="resetPassword">
                        <v-container>
                            <h3 class="text-h3" style="font-family: 'Inter', sans-serif;">Forgot password?</h3><br>
                            <p style="font-family: 'Inter', sans-serif;">No worries, we'll send you reset instructions
                            </p>
                            <div class="mt-10">
                                <v-label>Email</v-label>
                                <v-text-field variant="outlined" v-model="email" type="email"
                                    placeholder="Enter your email" required></v-text-field>
                                <v-btn color="grey-darken-3" style="width: 100%;" type="submit">Reset
                                    Password</v-btn><br>
                                <v-btn @click="backLogin" class="mt-5" style="width: 100%;" variant="plain"><v-icon
                                        style="font-size: 2.5em; color: black;">mdi-keyboard-backspace</v-icon> Back to
                                    Login</v-btn>
                            </div>
                        </v-container>
                    </form>
                </v-col>
                <v-col cols="" lg="6" md="12" sm="12">
                    <img v-if="!mobile" src="/img/forget.png" alt="Forget Password">
                </v-col>
            </v-row>


            <v-dialog v-model="alert" max-width="400">
                <v-card>
                    <v-card-title class="headline">Reset Password</v-card-title>
                    <v-card-text>{{ text }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="alert = false">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<style>
.body {
    background: white;
}
</style>