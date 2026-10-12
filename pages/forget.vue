<script setup>
import { useMediaQuery } from '@vueuse/core';
const mobile = useMediaQuery('(max-width: 600px)');
definePageMeta({
    layout: 'auth',
});
// NOTE: the Supabase client is deliberately NOT used to send the recovery mail —
// see the comment in resetPassword() for why the REST endpoint is called directly.
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
        //
        // The recovery request is sent WITHOUT a PKCE code_challenge on purpose.
        // @supabase/ssr's createBrowserClient hardcodes `flowType: 'pkce'` (it is applied
        // after the caller's auth options, so it cannot be overridden), which makes
        // resetPasswordForEmail attach a code_challenge and send a `?code=` link. That
        // code can ONLY be exchanged in the browser that requested it, because the
        // code_verifier lives in that browser's storage. Users routinely open the email
        // on a phone or in a webmail/in-app viewer, where there is no verifier — the
        // exchange then fails with "both auth code and code verifier should be non-empty"
        // and the reset page has no usable token at all.
        //
        // Calling /auth/v1/recover directly with no code_challenge yields the implicit
        // shape (#access_token&refresh_token), which `setSession` accepts on ANY device.
        const targetEmail = email.value.trim().toLowerCase();
        const redirectTo = `${window.location.origin}/newpassword`;
        const { public: { supabase: supabaseConfig } } = useRuntimeConfig();

        const response = await fetch(
            `${supabaseConfig.url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`,
            {
                method: 'POST',
                headers: {
                    apikey: supabaseConfig.key,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: targetEmail }),
            }
        );

        // Supabase deliberately returns 200 for unknown addresses (anti-enumeration),
        // so a success here does not confirm the account exists.
        let error = null;
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            error = new Error(body.msg || body.error_description || `Request failed (${response.status})`);
        }
        if (error) {
            text.value = error.message || 'An error occurred. Please try again later.';
            alert.value = true;
            console.error('[forget] resetPasswordForEmail failed:', error);
        } else {
            text.value =
                'Password reset email sent. Please check your inbox — and your Spam/Junk folder, '
                + 'since the message can be filtered there. Open the link as soon as it arrives: '
                + 'it expires after one hour and can only be opened once.';
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