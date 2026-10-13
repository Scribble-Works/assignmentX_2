<script setup>
import { useMediaQuery } from '@vueuse/core';

definePageMeta({
    layout: 'auth',
});

const mobile = useMediaQuery('(max-width: 600px)');
const router = useRouter();
const { auth } = useSupabaseClient();

const email = ref('');
const alert = ref(false);
const text = ref('');
const loading = ref(false);
const emailSent = ref(false);

const rules = {
    required: (v) => !!v || 'Email is required',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address',
};

const resetPassword = async () => {
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value || !emailPattern.test(email.value)) {
        text.value = 'Please enter a valid email address.';
        alert.value = true;
        return;
    }

    if (loading.value) return;
    loading.value = true;

    try {
        const redirectUrl = `${window.location.origin}/newpassword`;
        
        const { error } = await auth.resetPasswordForEmail(email.value.trim().toLowerCase(), {
            redirectTo: redirectUrl,
        });

        if (error) {
            text.value = error.message || 'An error occurred. Please try again later.';
            alert.value = true;
            console.error('[forget] resetPasswordForEmail failed:', error);
        } else {
            emailSent.value = true;
            text.value = 'Password reset email sent! Please check your inbox (and spam/junk folder). The link expires in 1 hour.';
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
    router.push('/login');
};

const closeAlert = () => {
    alert.value = false;
};
</script>

<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col cols="12" lg="6" md="12" sm="12" class="mt-16 pt-16">
                    <v-container>
                        <h3 class="text-h3" style="font-family: 'Inter', sans-serif; font-weight: bold;">
                            Forgot password?
                        </h3>
                        <br>
                        <p style="font-family: 'Inter', sans-serif;">
                            No worries, we'll send you reset instructions
                        </p>

                        <div v-if="emailSent" class="mt-10">
                            <v-alert type="success" variant="tonal" class="mb-6">
                                <div class="font-weight-bold mb-2">Check your email</div>
                                <div>
                                    We've sent a password reset link to <strong>{{ email }}</strong>.
                                    Click the link in the email to reset your password.
                                </div>
                                <div class="mt-3 text-caption">
                                    Didn't receive the email? Check your spam folder or 
                                    <a href="#" @click.prevent="emailSent = false; email = ''" class="text-primary">
                                        try again
                                    </a>
                                </div>
                            </v-alert>
                            <v-btn 
                                @click="backLogin" 
                                color="grey-darken-3" 
                                style="width: 100%;"
                            >
                                <v-icon start>mdi-keyboard-backspace</v-icon>
                                Back to Login
                            </v-btn>
                        </div>

                        <form v-else @submit.prevent="resetPassword" class="mt-10">
                            <v-label>Email</v-label>
                            <v-text-field 
                                v-model="email" 
                                variant="outlined" 
                                type="email"
                                placeholder="Enter your email"
                                :rules="[rules.required, rules.email]"
                                :disabled="loading"
                                class="mb-4"
                            ></v-text-field>

                            <v-btn 
                                color="grey-darken-3" 
                                style="width: 100%;" 
                                type="submit" 
                                :loading="loading"
                                :disabled="loading"
                            >
                                Reset Password
                            </v-btn>
                            <br>
                            <v-btn 
                                @click="backLogin" 
                                class="mt-5" 
                                style="width: 100%;" 
                                variant="plain"
                            >
                                <v-icon style="font-size: 2em; color: black;">mdi-keyboard-backspace</v-icon>
                                Back to Login
                            </v-btn>
                        </form>
                    </v-container>
                </v-col>
                <v-col cols="12" lg="6" md="12" sm="12">
                    <img v-if="!mobile" src="/img/forget.png" alt="Forget Password" style="max-width: 100%;">
                </v-col>
            </v-row>

            <v-dialog v-model="alert" max-width="400">
                <v-card>
                    <v-card-title class="headline">Reset Password</v-card-title>
                    <v-card-text>{{ text }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" @click="closeAlert">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>

<style scoped>
.body {
    background: white;
    min-height: 100vh;
}
</style>
