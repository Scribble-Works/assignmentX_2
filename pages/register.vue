<script setup>
definePageMeta({
    layout: 'auth',
});
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const email = ref('');
const password = ref('');
const confPassword = ref('');

const signUp = async () => {
    try {
        if (password.value !== confPassword.value) {
            alert('Passwords do not match');
            return;
        }
        const { data, error } = await auth.signUp({
            email: email.value,
            password: password.value
        });

        if (error) {
            alert('An error occurred. Please try again later.');
            console.error(error);
        } else {
            alert('Sign up successful! Please check your email for confirmation.');
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
        <v-container class="w-auto" role="presentation">
            <h1 class="text-h2" style="font-family: 'Inter', sans-serif; font-weight: bold;">Get Started Now</h1>
            <!-- <p style="font-family: 'Inter', sans-serif;">Enter your credentials to access your account</p> -->
            <form class="mt-16" @submit.prevent="signUp">
                <v-label>Email Address</v-label><br><br>
                <v-text-field v-model="email" type="email" placeholder="Enter your email"
                    variant="outlined"></v-text-field>

                <v-label>Password</v-label><br><br>

                <v-text-field v-model="password" type="password" placeholder="Enter your password"
                    variant="outlined"></v-text-field>
                <v-label>Confirm Password</v-label><br><br>
                <v-text-field v-model="confPassword" type="password" placeholder="Confirm your password"
                    variant="outlined"></v-text-field>
                <v-btn style="width: 100%;" type="submit" color="grey-darken-3">Signup</v-btn>
            </form><br>
            <v-spacer></v-spacer>
            <v-row align="center">
                <v-col>
                    <v-divider :thickness="6" color="#3E4F5C"></v-divider>
                </v-col>
                <v-col class="text-center">
                    <span>Or</span>
                </v-col>
                <v-col>
                    <v-divider :thickness="6" color="#3E4F5C"></v-divider>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="" lg="6" md="6" sm="12">
                    <v-btn><v-icon style="color: red;">mdi-google</v-icon> Signup with Google</v-btn>
                </v-col>
                <v-col align="right" cols="" lg="6" md="6" sm="12">
                    <v-btn><v-icon>mdi-apple</v-icon> Signup with Apple</v-btn>
                </v-col>
            </v-row><br>
            <p class="text-center">Have an account? <NuxtLink style="color: #2096F3; text-decoration: underline;"
                    to="/auth">Sign In</NuxtLink>
            </p>
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