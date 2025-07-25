<script setup>
definePageMeta({
    layout: 'auth',
});
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const email = ref('');
const alert = ref(false);
const resetPassword = async () => {
    try {
        const { data, error } = await auth.resetPasswordForEmail(email.value);
        console.log(data);
        if (error) {
            alert('An error occurred. Please try again later.');
            console.error(error);
        } else {
            // alert('Password reset email sent! Please check your inbox.');
            alert.value = true;
            // router.push('/auth');
        }
    } catch (error) {
        // alert('An error occurred. Please try again later.');
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
                    <img src="/img/forget.png" alt="Forget Password">
                </v-col>
            </v-row>


            <v-dialog v-model="alert" width="auto">
                <v-card max-width="400" title="Reset Password" text="Please check your email for the reset link.">
                    <template v-slot:actions>
                        <v-btn class="ms-auto" text="Ok" @click="alert = false"></v-btn>
                    </template>
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