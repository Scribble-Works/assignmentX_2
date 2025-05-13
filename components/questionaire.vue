<script setup>
import { useScroll } from '@vueuse/core';
const client = useSupabaseClient();
const config = useRuntimeConfig();

import { appendRow } from '~/composables/useSheet';
const { y, isScrolling } = useScroll();
const { scrl } = ref(null);

const url = config.public.SHEET_URL;
const email = ref('');
const role = ref('');
const experience = ref('');
const oXperience = ref('');

const submitFeedback = async () => {

    const {data, error} = await client.from('user_experience_data').insert({
        email: email.value,
        role: role.value,
        experience: experience.value,
        other_experience: oXperience.value
    });

    email.value = '';
    role.value = '';
    experience.value = '';
    oXperience.value = '';
};
</script>
<template>
    <div style="height: 40dvh; width:auto; overflow-y: auto;" ref="scrl">
        <h3 class="text-left">
            <strong style="font-size: 2em;">Welcome to AssignmentX Beta!</strong><br>
            Thank you for participating in the AssignmentX beta test! AssignmentX is a web extension designed to
            enhance the Assignment Workbook Series with rich, interactive, and relevant content. Your feedback is
            crucial in helping us improve and refine this tool.
            Please take a few moments to share your experience with us.
        </h3>
        <br>
        <v-form @submit.prevent="submitFeedback">

            <label style="color: black;">
                <strong>Which of the following best describes your role?</strong>
            </label>
            <v-select v-model="role" label="Role" variant="solo-filled"
                :items="['Parent', 'Student', 'Educator', 'Other']"></v-select>

            <label style="color: black;">
                <strong>Overall, how would you rate your experience with AssignmentX?</strong>
            </label>
            <v-select v-model="experience" label="Experience" variant="solo-filled"
                :items="['Excellent', 'Good', 'Neutral', 'Fair', 'Poor']"></v-select>

            <label style="color: black;">
                <strong>Please share any specific experiences or observations you had while using AssignmentX.
                    <br>
                    What
                    did you like? What could be improved?</strong>
            </label>
            <v-textarea v-model="oXperience" label="Observations and Recommedations" variant="solo-filled"></v-textarea>

            <label style="color: black;">
                <strong>
                    Join our waitlist for Version 2.0!
                    Be the first to access new updates and exclusive features. <br> Enter your email
                    below!
                </strong>
            </label>
            <v-text-field v-model="email" variant="solo-filled" label="Email"></v-text-field>

            <v-btn type="submit" color="primary">Submit</v-btn><br>
        </v-form>
    </div>
</template>