<script setup>
definePageMeta({
    layout: 'dashboard'
});

const client = useSupabaseClient();
const user = useSupabaseUser();

const profile = await client.from('userProfile').select('*').eq('id', user.value.id).single();
console.log(profile);
</script>
<template>
    <div class="bg-gray-50 font-sans">
        <div class="p-8 overflow-auto">
            <div class="space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-4xl font-semibold text-gray-800">Welcome back, {{profile.data?.Full_Name}}</h1>
                        <p class="text-lg text-gray-600">Let's continue your learning journey!</p>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Notifications</button>
                        <button class="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800">Settings</button>
                    </div>
                </div>

                <!-- User Progress Section -->
                <div id="progress" class="bg-white shadow-lg rounded-lg p-6">
                    <h3 class="text-2xl font-semibold text-gray-800">Your Progress</h3>
                    <div class="mt-4">
                        <p class="text-lg text-gray-600">Overall Progress: <span
                                class="font-semibold text-green-500">80%</span></p>
                        <div class="w-full bg-gray-200 rounded-full h-3 mt-2">
                            <div class="bg-green-500 h-3 rounded-full" style="width: 80%"></div>
                        </div>
                    </div>
                </div>

                <!-- Learning Resources Section -->
                <div id="resources" class="bg-white shadow-lg rounded-lg p-6">
                    <h3 class="text-2xl font-semibold text-gray-800">Learning Resources</h3>
                    <div class="mt-4 space-y-4">
                        <a href="#" class="block text-blue-600 hover:underline">Video Lesson 1: Introduction</a>
                        <a href="#" class="block text-blue-600 hover:underline">Quiz 1: Basic Concepts</a>
                        <a href="#" class="block text-blue-600 hover:underline">QR Code: Interactive Problem</a>
                    </div>
                </div>

                <!-- Quick Links Section -->
                <div id="quick-links" class="bg-white shadow-lg rounded-lg p-6">
                    <h3 class="text-2xl font-semibold text-gray-800">Quick Links</h3>
                    <div class="mt-4 flex space-x-4">
                        <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Start
                            Quiz</button>
                        <button class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">Start Video
                            Lesson</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>