<script setup>
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
        } else if (user.value && email.value !== user.value.email) {
            const { data, error } = await auth.signUp({
                email: email.value,
                password: password.value
            });
            router.push('/login');
        } else {
            alert('User already exists');
            router.push('/login');
        }
    } catch (error) {
        console.error(error);
    }
};
</script>
<template>
    <div class="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <form @submit.prevent="signUp" id="signupForm">
            <div id="createAccountFields">
                <!-- <div class="mb-4">
                    <label for="fullName" class="block text-sm font-medium">Full Name</label>
                    <input type="text" id="fullName" class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500" required>
                </div> -->
                <div class="mb-4">
                    <label for="createEmail" class="block text-sm font-medium">Email address</label>
                    <input type="email" v-model="email" name="SignUpEmail" id="createEmail"
                        class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <div class="mb-4">
                    <label for="createPassword" class="block text-sm font-medium">Create Passcode</label>
                    <input type="password" v-model="password" name="SignUpPassword" id="createPassword"
                        class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <div class="mb-4">
                    <label for="confirmPassword" class="block text-sm font-medium">Confirm Passcode</label>
                    <input type="password" v-model="confPassword" name="confPassword" id="confirmPassword"
                        class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <button type="submit"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit</button>
            </div>


        </form>
    </div>
</template>