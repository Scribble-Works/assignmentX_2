<script setup>
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const email = ref('');
const alert = ref(false);
const resetPassword = async () => {
    try {
        const { data, error } = await auth.resetPasswordForEmail(email.value,
            {
                redirectTo: 'https://assignmentx.swph.tech/newpassword'
            }
        );

        if (error) {
            alert('An error occurred. Please try again later.');
            console.error(error);
        } else {
            alert('Password reset email sent! Please check your inbox.');
            alert.value = true;
            router.push('/auth');
        }
    } catch (error) {
        alert('An error occurred. Please try again later.');
        console.error(error);
    }
};
</script>
<template>
    <div class="d-flex flex-column fill-height justify-center align-center min-h-screen">
        <v-card>
            <form @submit.prevent="resetPassword">
                <v-container>
                    <v-label>Email</v-label>
                    <v-text-field v-model="email" type="email" placeholder="Enter your email" required></v-text-field>
                    <v-btn type="submit">Reset</v-btn>
                </v-container>
            </form>
        </v-card>

        <v-dialog v-model="alert" width="auto">
            <v-card max-width="400" title="Reset Password" text="Please check your email for the reset link.">
                <template v-slot:actions>
                    <v-btn class="ms-auto" text="Ok" @click="alert = false"></v-btn>
                </template>
            </v-card>
        </v-dialog>
    </div>
</template>