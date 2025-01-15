<script setup>
definePageMeta({
    layout: 'dashboard'
});

const client = useSupabaseClient();
const user = useSupabaseUser();

const profile = ref(null);
const username = ref("");
console.log(profile.data);


const fetchProfile = async () => {
    try {
        const { data, error } = await client.from('userProfile').select('*').eq('id', user.value.id).single();
        if (error) throw error;
        profile.value = data;
        username.value = data.Full_Name;
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
};


const toggleEdit = () => {
    const editSection = document.getElementById('editSection');
    editSection.classList.toggle('hidden');
};

const saveProfile = async () => {
    try {
        if (!profile.value) {
            const { error } = await client.from('userProfile').insert({ Full_Name: username, id: user.value.id });
            if (error) throw error;
        } else {
            const { error } = await client.from('userProfile').update({ Full_Name: username }).eq('id', user.value.id);
            if (error) throw error;
        }
        alert('Profile saved successfully');
    } catch (error) {
        console.log(error);
    }
};

fetchProfile();


</script>
<template>
    <div>
        <div class="flex flex-col md:flex-row p-6 mt-5 w-96 min-h-max" style="width: 30em;">
            <div class="flex-1 p-4 bg-gray-200 rounded-lg shadow-md">
                <!-- Profile Header -->
                <div class="flex items-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd"
                            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                            clipRule="evenodd" />
                    </svg>

                    <!-- <img src="" alt="Profile Picture" class="w-36 h-36 rounded-full mr-6"> -->
                    <div>
                        <h2 id="username" class="text-2xl font-semibold">{{ username }}</h2>
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
                    <input type="text" v-model="username" id="editUsername"
                        class="w-full p-2 mb-4 border border-gray-300 rounded-lg">
                    <label for="editEmail" class="block mb-2 text-sm font-semibold">Email:</label>
                    <input type="email" id="editEmail" class="w-full p-2 mb-4 border border-gray-300 rounded-lg"
                        :value="user.email" disabled>
                    <!-- <label for="editBio" class="block mb-2 text-sm font-semibold">Bio:</label>
                    <textarea id="editBio" rows="3"
                        class="w-full p-2 mb-4 border border-gray-300 rounded-lg">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</textarea> -->
                    <button type="button" class="bg-green-500 text-white p-2 rounded-lg" @click="saveProfile()">Save
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