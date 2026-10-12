<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

definePageMeta({
    layout: 'auth',
});

const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const route = useRoute();

const alert = ref(false);
const passwordText = ref('');

const newPassword = ref('');
const confirmNewPassword = ref('');

// Session state for the recovery link.
//   'checking' -> still consuming the token from the URL
//   'ready'    -> recovery session established, user may set a new password
//   'invalid'  -> no/expired/already-used token; user must request a new email
const status = ref('checking');
const statusMessage = ref('Verifying your reset link…');
const loading = ref(false);
const success = ref(false);

const backLogin = () => {
    router.push('/login');
};
const goForgot = () => {
    router.push('/forget');
};

/**
 * Parse the implicit-flow hash fragment (#access_token=...&type=recovery).
 * Supabase uses the fragment for the implicit flow and the query string for PKCE,
 * so both have to be handled.
 */
const parseHash = () => {
    if (typeof window === 'undefined') return {};
    const raw = window.location.hash?.replace(/^#/, '');
    if (!raw) return {};
    return Object.fromEntries(new URLSearchParams(raw).entries());
};

/**
 * Strip auth material from the visible URL once consumed so a page refresh or a
 * shared URL cannot replay the token.
 */
const scrubUrl = () => {
    if (typeof window === 'undefined') return;
    window.history.replaceState({}, document.title, window.location.pathname);
};

let unsubscribe = null;

const EXPIRED_MESSAGE =
    'This reset link is no longer valid. Reset links can only be opened once, and some '
    + 'email providers (Outlook/Microsoft Safe Links, corporate scanners, antivirus link '
    + 'checking) silently open them first, which uses the link up before you click it. '
    + 'Request a new link below and open it as soon as it arrives.';

const NO_TOKEN_MESSAGE =
    'We could not find a reset token in this link. Please request a new password reset '
    + 'email and open the link directly from your inbox in this same browser.';

/**
 * A recovery token is SINGLE-USE. Exchanging it twice makes the second attempt
 * fail with `otp_expired`, so the exchange must run exactly once per page load —
 * a double mount, an HMR re-run or a re-entrant call would otherwise burn a
 * perfectly good token and show the user an "expired" error.
 */
let exchangeStarted = false;

const markReady = () => {
    status.value = 'ready';
    scrubUrl();
};

/**
 * Never downgrade a live session back to 'invalid'. `onAuthStateChange` and the
 * explicit exchange below race each other; whichever loses must not stomp the
 * winner, or a successful recovery renders as an expired link.
 */
const markInvalid = (message) => {
    if (status.value === 'ready') return;
    status.value = 'invalid';
    statusMessage.value = message;
};

const hasSession = async () => {
    const { data } = await auth.getSession();
    return !!data?.session;
};

const establishSession = async () => {
    if (exchangeStarted) return;
    exchangeStarted = true;

    const q = route.query;
    const hash = parseHash();

    // 1. The Nuxt Supabase plugin may already have consumed the token
    //    (detectSessionInUrl is on in the browser). Cheapest path first.
    if (await hasSession()) {
        markReady();
        return;
    }

    // 2. token_hash flow (?token_hash=...&type=recovery). Tried FIRST because the
    //    token is only spent when this code calls verifyOtp — nothing is consumed
    //    by merely loading the page, so a scanner that prefetches the link cannot
    //    burn it. This is the shape the email template should use.
    const tokenHash = q.token_hash || q.token;
    if (tokenHash) {
        const { error } = await auth.verifyOtp({
            type: String(q.type || 'recovery'),
            token_hash: String(tokenHash),
        });
        if (!error) {
            markReady();
            return;
        }
        console.error('[newpassword] verifyOtp failed:', error);
    }

    // 3. PKCE flow: ?code=<uuid> must be exchanged for a session. This only
    //    succeeds in the SAME browser that requested the reset, because the
    //    code_verifier lives in that browser's storage.
    if (q.code) {
        const { error } = await auth.exchangeCodeForSession(String(q.code));
        if (!error) {
            markReady();
            return;
        }
        console.error('[newpassword] exchangeCodeForSession failed:', error);
    }

    // 4. Implicit flow: tokens arrive in the hash fragment.
    if (hash.access_token && hash.refresh_token) {
        const { error } = await auth.setSession({
            access_token: hash.access_token,
            refresh_token: hash.refresh_token,
        });
        if (!error) {
            markReady();
            return;
        }
        console.error('[newpassword] setSession failed:', error);
    }

    // 5. Supabase reports a rejected link via error params on the redirect. These
    //    are only trusted AFTER every real exchange path has failed: a scanner can
    //    burn the redirect link (producing otp_expired here) while a token_hash in
    //    the same URL is still perfectly usable.
    const errCode = q.error_code || hash.error_code;
    const errDesc = q.error_description || hash.error_description;
    if (errCode || errDesc) {
        const raw = decodeURIComponent(String(errDesc || errCode).replace(/\+/g, ' '));
        console.error('[newpassword] link rejected by Supabase:', errCode, raw);
        markInvalid(/expired|invalid/i.test(raw) ? EXPIRED_MESSAGE : raw);
        return;
    }

    // 6. Last resort: the plugin can finish its own exchange a tick after mount.
    //    Poll briefly instead of declaring failure immediately.
    for (let i = 0; i < 20; i++) {
        await new Promise((r) => setTimeout(r, 300));
        if (user.value || (await hasSession())) {
            markReady();
            return;
        }
    }

    markInvalid(NO_TOKEN_MESSAGE);
};

onMounted(() => {
    // Supabase fires PASSWORD_RECOVERY once it consumes a recovery token.
    const { data } = auth.onAuthStateChange((event, session) => {
        if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
            markReady();
        }
    });
    unsubscribe = data?.subscription;
    establishSession();
});

onBeforeUnmount(() => {
    unsubscribe?.unsubscribe?.();
});

const resetPassword = async () => {
    if (status.value !== 'ready') {
        passwordText.value =
            status.value === 'checking'
                ? 'Still verifying your reset link — please wait a moment and try again.'
                : statusMessage.value;
        alert.value = true;
        return;
    }
    if (!newPassword.value || !confirmNewPassword.value) {
        passwordText.value = 'Please fill in both password fields.';
        alert.value = true;
        return;
    }
    if (newPassword.value !== confirmNewPassword.value) {
        passwordText.value = 'Passwords do not match';
        alert.value = true;
        return;
    }
    if (newPassword.value.length < 8) {
        passwordText.value = 'Password must be at least 8 characters';
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
            // Surface the real Supabase message — "An error occurred" hid the cause.
            passwordText.value = error.message || 'An error occurred. Please try again later.';
            alert.value = true;
            console.error('[newpassword] updateUser failed:', error);
            return;
        }
        success.value = true;
        passwordText.value = 'Password reset successfully! Please log in with your new password.';
        alert.value = true;
        // Drop the recovery session so the user re-authenticates with the new password.
        await auth.signOut();
    } catch (error) {
        passwordText.value = error.message || 'An error occurred. Please try again later.';
        alert.value = true;
        console.error('[newpassword] updateUser threw:', error);
    } finally {
        loading.value = false;
    }
};

// Dismissing the success dialog is what navigates to login.
const dismissAlert = () => {
    alert.value = false;
    if (success.value) router.push('/login');
};

const show = ref(false)
const rules = {
    required: value => !!value || 'Required.',
    min: v => (v || '').length >= 8 || 'Min 8 characters',
    emailMatch: () => (`The email and password you entered don't match`),
};
</script>
<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col cols="" lg="6" sm="12" md="12" class="mt-16 pt-10">
                    <v-form @submit.prevent="resetPassword">
                        <v-container>
                            <h3 style="font-family: 'Inter', sans-serif; font-weight: bold;"
                                class="text-h3 text-center">Set New Password</h3><br>
                            <p class="text-center">Must Be At Least 8 Characters</p>

                            <v-alert v-if="status === 'checking'" type="info" variant="tonal" class="mb-4"
                                density="comfortable">
                                Verifying your reset link…
                            </v-alert>
                            <v-alert v-else-if="status === 'invalid'" type="error" variant="tonal" class="mb-4"
                                density="comfortable">
                                {{ statusMessage }}
                                <div class="mt-3">
                                    <v-btn size="small" color="error" variant="flat" @click="goForgot">
                                        Request a new link
                                    </v-btn>
                                </div>
                            </v-alert>

                            <v-label>New Password</v-label>
                            <v-text-field variant="outlined" :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="show = !show" :rules="[rules.required, rules.min]"
                                :disabled="status !== 'ready'" autocomplete="new-password"
                                :type="show ? 'text' : 'password'" v-model="newPassword"></v-text-field>
                            <br>
                            <v-label>Confirm New Password</v-label>
                            <v-text-field variant="outlined" :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="show = !show" :rules="[rules.required, rules.min]"
                                :disabled="status !== 'ready'" autocomplete="new-password"
                                :type="show ? 'text' : 'password'" v-model="confirmNewPassword"></v-text-field>
                            <br>
                            <v-btn style="width: 100%;" color="grey-darken-3" type="submit"
                                :disabled="status !== 'ready' || loading" :loading="loading">Create New
                                Password</v-btn><br>
                            <v-btn @click="backLogin" class="mt-5" style="width: 100%;" variant="plain"><v-icon
                                    style="font-size: 2.5em; color: black;">mdi-keyboard-backspace</v-icon> Back to
                                Login</v-btn>
                        </v-container>
                    </v-form>
                </v-col>
                <v-col cols="" lg="6" sm="12" md="12">
                    <v-img src="/img/newpass.png" height="800"></v-img>
                </v-col>
            </v-row>

            <v-dialog v-model="alert" width="auto" persistent>
                <v-card max-width="400">
                    <template v-slot:title>
                        Reset Password
                    </template>
                    <template v-slot:text>
                        {{ passwordText }}
                    </template>
                    <template v-slot:actions>
                        <v-btn class="ms-auto" text="Ok" @click="dismissAlert"></v-btn>
                    </template>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<style>
.body {
    background-color: white;
}
</style>
