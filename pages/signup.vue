<script setup>

</script>
<template>
    <div>
        <form id="signupForm">
            <div id="createAccountFields" class="hidden">
                <!-- <div class="mb-4">
                    <label for="fullName" class="block text-sm font-medium">Full Name</label>
                    <input type="text" id="fullName" class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500" required>
                </div> -->
                <div class="mb-4">
                    <label for="createEmail" class="block text-sm font-medium">Email address</label>
                    <input type="email" name="SignUpEmail" id="createEmail"
                        class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <div class="mb-4">
                    <label for="createPassword" class="block text-sm font-medium">Create Passcode</label>
                    <input type="password" name="SignUpPassword" id="createPassword"
                        class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <div class="mb-4">
                    <label for="confirmPassword" class="block text-sm font-medium">Confirm Passcode</label>
                    <input type="password" name="confPassword" id="confirmPassword"
                        class="w-full border-gray-800 border rounded mt-1 p-2 focus:ring-blue-500 focus:border-blue-500"
                        required>
                </div>
                <button type="submit" onclick="createAccount"
                    class="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit</button>
            </div>


        </form>
    </div>
</template>