<script setup>
const { auth } = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const logout = async () => {
    try {
        await auth.signOut();
        router.push('/login');
    } catch (error) {
        console.error(error);
    }
};
</script>
<template>
    <div>
        <div class="bg-gradient-to-b from-blue-600 to-blue-500 w-64 p-6 justify-between text-white"
            style="height: 100dvh;">
            <div>
                <h2 class="text-3xl font-bold mb-8">AssignmentX</h2>
                <ul class="space-y-10">
                    <li><NuxtLink to="/user/" class="hover:bg-blue-700 p-3 rounded-lg block">Home</NuxtLink></li>
                    <li><NuxtLink to="/user/profile" class="hover:bg-blue-700 p-3 rounded-lg block">Profile</NuxtLink></li>
                    <li><NuxtLink to="/user/resources" class="hover:bg-blue-700 p-3 rounded-lg block">Learning Resources</NuxtLink></li>
                    <li><NuxtLink to="/user/progress" class="hover:bg-blue-700 p-3 rounded-lg block">Progress</NuxtLink></li>
                    <li>
                        <button @click="logout" class="hover:bg-blue-700 p-3 rounded-lg block">Logout</button>
                    </li>
                </ul>
            </div>
            <br>
            <div class="text-center mt-auto" style="margin-top: 30dvh;">
                <p class="text-sm">AssignmentX © 2024</p>
            </div>
        </div>

    </div>
</template>