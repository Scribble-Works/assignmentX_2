<script setup>
definePageMeta({
    layout: 'dashboard'
});

const { client } = useSupabaseClient();
const user = useSupabaseUser();

const username = ref('');


const toggleEdit = () => {
    const editSection = document.getElementById('editSection');
    editSection.classList.toggle('hidden');
};
const profile = await client.from('userProfile').select('*').eq('id', user.id);

if(profile.data == null){
    const {error} = await client.from('userProfile').insert({Full_Name: user.email, id: user.id})
}else{
    const {error} = await client.from('userProfile').update({Full_Name: user.email}).eq('id', user.id)
}


</script>
<template>
    <div>
        <div class="flex flex-col md:flex-row p-6 mt-20">
            <div class="flex-1 p-4 bg-gray-200 rounded-lg shadow-md">
                <!-- Profile Header -->
                <div class="flex items-center mb-6">
                    <img src="" alt="Profile Picture" class="w-36 h-36 rounded-full mr-6">
                    <div>
                        <h2 id="username" class="text-2xl font-semibold">John Doe</h2>
                        <button type="button" class="bg-blue-500 text-white p-2 mt-2 rounded-lg"
                            @click="toggleEdit()">Edit
                            Profile</button>
                    </div>
                </div>

                <!-- Profile Details -->
                <div class="space-y-4">
                    <h4 class="text-xl font-medium">Profile Details</h4>
                    <p><strong>Email:</strong> <span id="userEmail">{{ user.email }}</span></p>
                    <p><strong>Bio:</strong> <span id="userBio">Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit.</span></p>
                </div>

                <!-- Edit Profile Section -->
                <div class="edit-section hidden mt-6" id="editSection">
                    <h4 class="text-xl font-medium mb-2">Edit Profile</h4>
                    <label for="editUsername" class="block mb-2 text-sm font-semibold">Username:</label>
                    <input v-if="profile.data.Full_Name !== null" type="text" id="editUsername" v-model="username" class="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                        value="Write Full Name">
                    <input v-else type="text" id="editUsername" v-model="username" class="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                        :value="profile.data.Full_Name">
                    <label for="editEmail" class="block mb-2 text-sm font-semibold">Email:</label>
                    <input type="email" id="editEmail" class="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                        :value="user.email" disabled>
                    <!-- <label for="editBio" class="block mb-2 text-sm font-semibold">Bio:</label>
                    <textarea id="editBio" rows="3"
                        class="w-full p-2 mb-4 border border-gray-300 rounded-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</textarea> -->
                    <button type="button" class="bg-green-500 text-white p-2 rounded-lg" onclick="saveProfile()">Save
                        Changes</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
/* Optional custom dark mode styling */
.dark .bg-gray-100 {
    background-color: #2d3748;
}

.dark .bg-gray-200 {
    background-color: #4a5568;
}

.dark .text-black {
    color: #f7fafc;
}

.dark .text-white {
    color: #1a202c;
}
</style>