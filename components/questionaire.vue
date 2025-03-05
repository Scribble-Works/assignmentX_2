<script setup>
import { useScroll } from '@vueuse/core';

const { y, isScrolling } = useScroll();
const { scrl } = ref(null);

const email = ref('');
const role = ref('');
const experience = ref('');
const oXperience = ref('');

const submitFeedback = async () => {
    const feedback = {
        email: email.value,
        role: role.value,
        experience: experience.value,
        oXperience: oXperience.value,
    };
    console.log(feedback);
    email.value = '';
    role.value = '';
    experience.value = '';
    oXperience.value = '';
};
</script>
<template>
    <div style="height: 40dvh; width: 100%; overflow-y: auto;" ref="scrl">
        <h3 class="text-justify">
            <strong style="font-size: 2em;">Welcome to AssignmentX Beta!</strong><br>
            Thank you for participating in the AssignmentX beta test! AssignmentX is a web extension designed to
            enhance the Assignment Workbook Series with rich, interactive, and relevant content. Your feedback is
            crucial in helping us improve and refine this tool.
            Please take a few moments to share your experience with us.
        </h3>
        <br>
        <v-form @submit.prevent="submitFeedback">
            <v-row>
                <v-col>
                    <v-label style="color: black; font-size: 1.3em;">
                        <strong>Which of the following best describes your role?</strong>
                    </v-label>
                    <v-select v-model="role" label="Role" variant="solo-filled"
                        :items="['Parent', 'Student', 'Educator', 'Other']"></v-select>
                </v-col>
                <v-col>
                    <v-label style="color: black; font-size: 1.3em;">
                        <strong>Overall, how would you rate your experience with AssignmentX?</strong>
                    </v-label>
                    <v-select v-model="experience" label="Experience" variant="solo-filled"
                        :items="['Excellent', 'Good', 'Neutral', 'Fair', 'Poor']"></v-select>
                </v-col>
                <v-col>
                    <v-label style="color: black; font-size: 1.3em;">
                        <strong>Please share any specific experiences or observations you had while using AssignmentX.
                            <br>
                            What
                            did you like? What could be improved?</strong>
                    </v-label>
                    <v-textarea v-model="oXperience" label="Observations and Recommedations" variant="solo-filled"></v-textarea>
                </v-col>
                <v-col>
                    <v-label style="color: black; font-size: 1.3em;">
                        <strong>
                            Join our waitlist for Version 2.0!
                            Be the first to access new updates and exclusive features. <br> Enter your email
                            below!
                        </strong>
                    </v-label>
                    <v-text-field v-model="email" variant="solo-filled" label="Email"></v-text-field>
                </v-col>
            </v-row>
            <v-btn type="submit" color="primary">Submit</v-btn><br>
        </v-form>
    </div>
</template>