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
const loading = ref(false);
const resetPassword = async () => {
    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value || !emailPattern.test(email.value)) {
        text.value = 'Please enter a valid email address.';
        alert.value = true;
        return;
    }
    if (loading.value) return; // guard against double-submit queuing duplicate emails
    loading.value = true;
    try {
        // `redirectTo` is REQUIRED. Without it Supabase builds the emailed link against
        // the project's default Site URL, so the user lands on the home page instead of
        // the page that can actually set a new password.
        const { data, error } = await auth.resetPasswordForEmail(
            email.value.trim().toLowerCase(),
            { redirectTo: `${window.location.origin}/newpassword` }
        );
        if (error) {
            text.value = error.message || 'An error occurred. Please try again later.';
            alert.value = true;
            console.error('[forget] resetPasswordForEmail failed:', error);
        } else {
            text.value =
                'Password reset email sent. Please check your inbox — and your Spam/Junk folder, '
                + 'since the message can be filtered there. The link is valid for one hour and '
                + 'must be opened in this same browser.';
            alert.value = true;
        }
    } catch (error) {
        text.value = error.message || 'An error occurred. Please try again later.';
        alert.value = true;
        console.error('[forget] resetPasswordForEmail threw:', error);
    } finally {
        loading.value = false;
    }
};

const backLogin = () => {
    // '/auth' is a LAYOUT name, not a route — pushing it 404s. The login page is '/login'.
    router.push('/login');
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
                                <v-btn color="grey-darken-3" style="width: 100%;" type="submit" :loading="loading"
                                    :disabled="loading">Reset
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