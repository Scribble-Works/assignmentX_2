<script setup>
import { useMediaQuery } from '@vueuse/core';

definePageMeta({
    layout: 'auth',
});

const mobile = useMediaQuery('(max-width: 600px)');
const { auth } = useSupabaseClient();
const router = useRouter();
const route = useRoute();

// Form state
const newPassword = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

// Alert dialog state
const alert = ref(false);
const alertTitle = ref('Reset Password');
const alertText = ref('');
const alertType = ref('info'); // 'success', 'error', 'info'

// Page status
const status = ref('checking'); // 'checking', 'ready', 'invalid', 'success'
const errorMessage = ref('');

const rules = {
    required: (v) => !!v || 'Required',
    min: (v) => (v || '').length >= 8 || 'Password must be at least 8 characters',
    match: (v) => v === newPassword.value || 'Passwords do not match',
};

/**
 * Handle the password recovery flow on page load.
 * Supabase sends users here with either:
 * 1. Hash fragment: #access_token=...&type=recovery (implicit flow)
 * 2. Query params: ?code=... (PKCE flow)
 * 3. Query params: ?token_hash=...&type=recovery (magic link flow)
 */
const initializeRecovery = async () => {
    try {
        // First check if we already have a session (Nuxt Supabase plugin may have handled it)
        const { data: sessionData } = await auth.getSession();
        if (sessionData?.session) {
            status.value = 'ready';
            return;
        }

        // Parse hash fragment for implicit flow tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Check for error in hash
        const hashError = hashParams.get('error');
        const hashErrorDescription = hashParams.get('error_description');
        if (hashError) {
            throw new Error(hashErrorDescription || hashError);
        }

        // Handle implicit flow (hash fragment with tokens)
        if (accessToken && refreshToken && type === 'recovery') {
            const { error } = await auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            if (error) throw error;
            
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            status.value = 'ready';
            return;
        }

        // Handle PKCE flow (code in query params)
        const code = route.query.code;
        if (code) {
            const { error } = await auth.exchangeCodeForSession(String(code));
            if (error) throw error;
            
            status.value = 'ready';
            return;
        }

        // Handle token_hash flow (magic link style)
        const tokenHash = route.query.token_hash;
        const queryType = route.query.type;
        if (tokenHash) {
            const { error } = await auth.verifyOtp({
                type: String(queryType || 'recovery'),
                token_hash: String(tokenHash),
            });
            if (error) throw error;

            // Token is single-use — drop it from the address bar/history.
            window.history.replaceState({}, document.title, window.location.pathname);
            status.value = 'ready';
            return;
        }

        // Check for error in query params
        const queryError = route.query.error;
        const queryErrorDescription = route.query.error_description;
        if (queryError) {
            throw new Error(String(queryErrorDescription || queryError).replace(/\+/g, ' '));
        }

        // No valid token found
        throw new Error('No valid reset token found. Please request a new password reset link.');

    } catch (error) {
        console.error('[newpassword] Recovery initialization failed:', error);
        status.value = 'invalid';
        errorMessage.value = error.message || 'This reset link is invalid or has expired. Please request a new one.';
    }
};

// Listen for auth state changes (backup method)
let unsubscribe = null;
onMounted(() => {
    const { data } = auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' && session) {
            status.value = 'ready';
        }
    });
    unsubscribe = data?.subscription;
    
    // Initialize recovery flow
    initializeRecovery();
});

onBeforeUnmount(() => {
    unsubscribe?.unsubscribe?.();
});

const resetPassword = async () => {
    // Validate inputs
    if (!newPassword.value || !confirmPassword.value) {
        alertText.value = 'Please fill in both password fields.';
        alertType.value = 'error';
        alert.value = true;
        return;
    }

    if (newPassword.value.length < 8) {
        alertText.value = 'Password must be at least 8 characters.';
        alertType.value = 'error';
        alert.value = true;
        return;
    }

    if (newPassword.value !== confirmPassword.value) {
        alertText.value = 'Passwords do not match.';
        alertType.value = 'error';
        alert.value = true;
        return;
    }

    if (loading.value) return;
    loading.value = true;

    try {
        const { error } = await auth.updateUser({
            password: newPassword.value,
        });

        if (error) {
            alertText.value = error.message || 'Failed to reset password. Please try again.';
            alertType.value = 'error';
            alert.value = true;
            console.error('[newpassword] updateUser failed:', error);
            return;
        }

        // Success!
        status.value = 'success';
        alertTitle.value = 'Success!';
        alertText.value = 'Your password has been reset successfully. You can now log in with your new password.';
        alertType.value = 'success';
        alert.value = true;

        // Sign out to clear recovery session
        await auth.signOut();

    } catch (error) {
        alertText.value = error.message || 'An unexpected error occurred. Please try again.';
        alertType.value = 'error';
        alert.value = true;
        console.error('[newpassword] resetPassword threw:', error);
    } finally {
        loading.value = false;
    }
};

const closeAlert = () => {
    alert.value = false;
    if (status.value === 'success') {
        router.push('/login');
    }
};

const goToForgot = () => {
    router.push('/forget');
};

const goToLogin = () => {
    router.push('/login');
};
</script>

<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col cols="12" lg="6" sm="12" md="12" class="mt-16 pt-10">
                    <v-container>
                        <h3 class="text-h3 text-center" style="font-family: 'Inter', sans-serif; font-weight: bold;">
                            Set New Password
                        </h3>
                        <br>
                        <p class="text-center text-grey-darken-1">
                            Must be at least 8 characters
                        </p>

                        <!-- Checking status -->
                        <v-alert 
                            v-if="status === 'checking'" 
                            type="info" 
                            variant="tonal" 
                            class="mt-6 mb-4"
                        >
                            <div class="d-flex align-center">
                                <v-progress-circular indeterminate size="20" width="2" class="mr-3"></v-progress-circular>
                                Verifying your reset link...
                            </div>
                        </v-alert>

                        <!-- Invalid/Expired link -->
                        <div v-else-if="status === 'invalid'" class="mt-6">
                            <v-alert type="error" variant="tonal" class="mb-6">
                                <div class="font-weight-bold mb-2">Link Invalid or Expired</div>
                                <div>{{ errorMessage }}</div>
                            </v-alert>
                            <v-btn 
                                @click="goToForgot" 
                                color="grey-darken-3" 
                                style="width: 100%;"
                                class="mb-4"
                            >
                                Request New Reset Link
                            </v-btn>
                            <v-btn 
                                @click="goToLogin" 
                                style="width: 100%;" 
                                variant="plain"
                            >
                                <v-icon start>mdi-keyboard-backspace</v-icon>
                                Back to Login
                            </v-btn>
                        </div>

                        <!-- Success state -->
                        <div v-else-if="status === 'success'" class="mt-6">
                            <v-alert type="success" variant="tonal" class="mb-6">
                                <div class="font-weight-bold mb-2">Password Reset Successfully!</div>
                                <div>You can now log in with your new password.</div>
                            </v-alert>
                            <v-btn 
                                @click="goToLogin" 
                                color="grey-darken-3" 
                                style="width: 100%;"
                            >
                                Go to Login
                            </v-btn>
                        </div>

                        <!-- Ready - show password form -->
                        <v-form v-else-if="status === 'ready'" @submit.prevent="resetPassword" class="mt-6">
                            <v-label>New Password</v-label>
                            <v-text-field 
                                v-model="newPassword"
                                variant="outlined"
                                :type="showPassword ? 'text' : 'password'"
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPassword = !showPassword"
                                :rules="[rules.required, rules.min]"
                                placeholder="Enter new password"
                                autocomplete="new-password"
                                class="mb-2"
                            ></v-text-field>

                            <v-label>Confirm New Password</v-label>
                            <v-text-field 
                                v-model="confirmPassword"
                                variant="outlined"
                                :type="showConfirmPassword ? 'text' : 'password'"
                                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                                :rules="[rules.required, rules.min, rules.match]"
                                placeholder="Confirm new password"
                                autocomplete="new-password"
                                class="mb-4"
                            ></v-text-field>

                            <v-btn 
                                type="submit"
                                color="grey-darken-3" 
                                style="width: 100%;"
                                :loading="loading"
                                :disabled="loading"
                            >
                                Reset Password
                            </v-btn>
                            <br>
                            <v-btn 
                                @click="goToLogin" 
                                class="mt-5" 
                                style="width: 100%;" 
                                variant="plain"
                            >
                                <v-icon style="font-size: 2em; color: black;">mdi-keyboard-backspace</v-icon>
                                Back to Login
                            </v-btn>
                        </v-form>
                    </v-container>
                </v-col>
                <v-col cols="12" lg="6" sm="12" md="12">
                    <v-img v-if="!mobile" src="/img/newpass.png" height="800"></v-img>
                </v-col>
            </v-row>

            <v-dialog v-model="alert" max-width="400" persistent>
                <v-card>
                    <v-card-title class="headline">{{ alertTitle }}</v-card-title>
                    <v-card-text>{{ alertText }}</v-card-text>
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
    background-color: white;
    min-height: 100vh;
}
</style>
