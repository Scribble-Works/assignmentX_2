<script setup>
const testimonials = [
    { quote: 'At first glance, you do not need a second look to tell you the material is excellent. The content is exhaustive, the arrangement is meticulous and the standard is second to none. A very impressive effort.', author: 'Baldwin Lamptey', school: 'Maths Teacher Day Spring Montessori Int. Sch, Dansoman' },
    { quote: 'At first glance, you do not need a second look to tell you the material is excellent. The content is exhaustive, the arrangement is meticulous and the standard is second to none. A very impressive effort.', author: 'Baldwin Lamptey', school: 'Maths Teacher Day Spring Montessori Int. Sch, Dansoman' }
];
</script>
<template>
    <div class="body">
        <v-parallax src="/img/abouthero.jpg" height="100dvh">
            <div class="d-flex align-center justify-center"
                style="height: 100%; width: 100%; background-color: rgba(0, 0, 0, 0.5);">
            </div>
            >
        </v-parallax>
        <v-container>
            <v-row>
                <v-col cols="" lg="" md="" sm="12">
                    <h2 class="text-h3">Discover <br>AssignmentX</h2>
                    <span><img src="/img/Vector.png" alt=""></span>
                </v-col>
                <v-col cols="" lg="" md="" sm="12">
                    <h4 class="text-h4">
                        <span style="color: #FCC30C; font-weight: bold;">AssignmentX</span> is a learning platform built
                        to help students truly understand mathematics — not just memorize it.
                    </h4><br>
                    <p>
                        We use storytelling, real-life examples, games, and guided practice to make math engaging,
                        practical, and fun.
                        Whether you're learning at home or in school, AssignmentX helps you build confidence, solve
                        problems, and connect math to everyday life.
                    </p>
                </v-col>
            </v-row>
            <br>
            <v-row class="mt-16">
                <v-col cols="" lg="6" sm="12" md="6">
                    <img src="/img/mission.png" alt="">
                </v-col>
                <v-col cols="" lg="6" sm="12" md="6" class="mt-15">
                    <h4 class="text-h3">Our <span style="color: #4C9F38;">Mission</span></h4><br>
                    <p>Our mission is to empower young learners across Africa to discover the power of math by
                        transforming their experience to be:</p><br>
                    <ul class="missionList">
                        <li><strong>Understandable</strong> - not confusing</li><br>
                        <li><strong>Relatable</strong> - not abstract</li><br>
                        <li><strong>Enjoyable</strong> - not intimidating</li><br>
                    </ul>
                </v-col>
            </v-row>
            <v-row class="mt-15">
                <v-col cols="" lg="6" sm="12" md="6">
                    <h4 class="text-h4">Our Learning <span style="color: #FCC30C;">Approach</span></h4><br>
                    <p>AssignmentX is built on a simple yet powerful 3-step learning model, designed to foster deep
                        understanding and application:</p><br>
                    <v-row>
                        <v-col sm="4" lg="3" md="3">
                            <v-container>
                                <div class="d-flex align-center justify-center"
                                    style="background-color: #FCC30C26; width: 100%; height: 95px; border-radius: 10%;">
                                    <img src="/img/mag.png" alt="">
                                </div>
                            </v-container>
                        </v-col>
                        <v-col lg="9" md="9" sm="8" class="mt-5">
                            <h4 class="text-h5">Discover – Learn the Why</h4>
                            <p>Explore the story, purpose, and real-world value of each math concept.</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="4" lg="3" md="3">
                            <v-container>
                                <div class="d-flex align-center justify-center"
                                    style="background-color: #E5253A33; width: 100%; height: 95px; border-radius: 10%;">
                                    <img src="/img/clipboard.png" alt="">
                                </div>
                            </v-container>
                        </v-col>
                        <v-col lg="9" md="9" sm="8" class="mt-5">
                            <h4 class="text-h5">Practice – Build the How</h4>
                            <p>Learn step-by-step through videos, notes, games, and worked examples.</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="4" lg="3" md="3">
                            <v-container>
                                <div class="d-flex align-center justify-center"
                                    style="background-color: #4C9F3826; width: 100%; height: 95px; border-radius: 10%;">
                                    <img src="/img/plane.png" alt="">
                                </div>
                            </v-container>
                        </v-col>
                        <v-col lg="9" md="9" sm="8" class="mt-5">
                            <h4 class="text-h5">Practice – Build the How</h4>
                            <p>Learn step-by-step through videos, notes, games, and worked examples.</p>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="" lg="6" sm="12" md="6">
                    <img src="/img/approach.png" alt="">
                </v-col>
            </v-row>

            <v-row class="mt-15">
                <v-col cols="" lg="6" md="12" sm="12">
                    <h3 class="text-h3">Why It Matters</h3>
                    <br>
                    <p>Many learners struggle with math not because they aren’t smart — but because math was never shown
                        to them in a way that made sense. We’re changing that.</p><br>
                    <p>AssignmentX is designed to work online or offline, in low-resource schools, and with localized
                        content to meet learners where they are, ensuring access and relevance for all.
                    </p>
                </v-col>
                <v-col cols="" lg="6" md="12" sm="12">
                    <h3 class="text-h3">Who It’s For</h3><br>
                    <p>AssignmentX is designed to support a wide range of learners and educators:</p>
                    <br>
                    <ul class="forList">
                        <li>Students who want to improve, catch up, or explore math in a new way</li>
                        <li>Teachers looking for curriculum-aligned tools to support their lessons</li>
                        <li>Parents who want to help their children learn independently and confidently</li>
                    </ul>
                </v-col>
            </v-row>

            <br>
            <v-row class="mt-15 mb-15">
                <v-col cols="" lg="6" md="12" sm="12">
                    <img src="/img/diff.png" alt="">
                </v-col>
                <v-col cols="" lg="6" md="12" sm="12">
                    <h4 class="text-h4">What Makes Us <span style="color: #E5253A;">Different</span>?</h4>
                    <p>What sets AssignmentX apart and ensures real learning outcomes?</p><br>

                    <v-row>
                        <v-col sm="3" lg="3" md="3">
                            <v-icon style="font-size: 6.5em; color: #FCC30C;">mdi-book-open-blank-variant</v-icon>
                        </v-col>
                        <v-col sm="9" lg="9" md="9">
                            <h5 class="text-h5">Context-based learning</h5>
                            <p>Utilizing engaging stories, local culture, and real-life scenarios to teach math.</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="3" lg="3" md="3">
                            <v-icon style="font-size: 6.5em; color: #4C9F38;">mdi-book-open-blank-variant</v-icon>
                        </v-col>
                        <v-col sm="9" lg="9" md="9">
                            <h5 class="text-h5">Curriculum-aligned content</h5>
                            <p>Specifically tailored for Ghanaian JHS (B7–B9), ensuring relevance to local educational
                                standards.</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="3" lg="3" md="3">
                            <v-icon style="font-size: 6.5em; color: #2096F3;">mdi-book-open-blank-variant</v-icon>
                        </v-col>
                        <v-col sm="9" lg="9" md="9">
                            <h5 class="text-h5">Interactive tools</h5>
                            <p>Engaging features like quizzes, flip cards, worksheets, and live sessions to make
                                learning dynamic.</p>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col sm="3" lg="3" md="3">
                            <v-icon style="font-size: 6.5em; color: #E5253A;">mdi-book-open-blank-variant</v-icon>
                        </v-col>
                        <v-col sm="9" lg="9" md="9">
                            <h5 class="text-h5">Progress tracking</h5>
                            <p>Robust features to measure learning growth and provide insights into student mastery.</p>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            <div class="mt-10 text-center">
                <h3 class="text-h3">Not Just Numbers - Real Results</h3><br>
                <p>We could talk about impact all day—but we’d rather let our users do the talking.</p>
                <br>
                <v-carousel hide-delimiter-background height="500">
                    <v-carousel-item v-for="(testimonial, i) in testimonials" :key="i">
                        <v-sheet elevation="2" class="mx-auto" max-width="800" height="400">
                            <v-container>
                                <v-card-text style="width: 100%;">
                                    <div class="text-left mb-2 mt-10">{{ testimonial.quote }}</div>
                                    <div class="text-subtitle-1 text-left mt-10 font-italic">{{ testimonial.author }}
                                    </div>
                                    <div class="text-caption text-left mt-1" style="color: #888;">{{ testimonial.school
                                    }}</div>
                                </v-card-text>
                            </v-container>
                        </v-sheet>
                    </v-carousel-item>
                </v-carousel>
            </div>
            <v-row class="mt-10">
                <v-col cols="" sm="12" md="12" lg="6" class="mt-16 pt-10">
                    <h4 style="color: #3E4F5C; font-family: 'Inter', sans-serif;" class="text-h4">Don't Have The <span
                            style="text-decoration: underline; text-decoration-color: #FCC30C;">Book</span><br> Yet?
                    </h4>
                    <p class="mt-5 mb-5">Get your Assignment Workbook now and unlock a <br> world of learning with QR
                        code scanning!</p>
                    <v-btn color="blue-darken-1" size="large">Buy the Book</v-btn>
                </v-col>
                <v-col cols="" sm="12" md="12" lg="6">
                    <img src="/img/buyabout.png" alt="">
                </v-col>
            </v-row>
            <v-row class="mt-16 mb-10">
                <v-col cols="" lg="6" md="12" sm="12" class="mt-10">
                    <h5 class="text-h5">Want to Get Involved?</h5>
                    <br>
                    <p>Whether you're a school, parent, teacher, or education partner <br>— we’d love to connect and
                        explore how we can work <br> together to empower learners.</p><br>
                    <p>
                        <v-icon>mdi-phone</v-icon> +233 556 402 828 <br><br>
                        <v-icon>mdi-email</v-icon> scribbleworksonline@gmail.com
                    </p>
                </v-col>
                <v-col cols="" lg="6" md="12" sm="12">
                    <v-form>
                        <label>Name</label>
                        <v-text-field v-model="name" placeholder="Enter your name" variant="underlined"></v-text-field>
                        <label>Email</label>
                        <v-text-field v-model="email" type="email" placeholder="Enter your email"
                            variant="underlined"></v-text-field>
                        <label>Message</label>
                        <v-textarea v-model="message" placeholder="Enter your message"
                            variant="underlined"></v-textarea>
                        <v-btn color="blue-darken-1" size="large" @click="submitForm">Send <v-icon>mdi-send</v-icon>
                        </v-btn>
                    </v-form>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
<style>
.body {
    background: white;
}

.missionList li {
    list-style: none;
    padding: 10px 30px;
    background-image: url(/img/check.png);
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 20px;
}

.forList {
    list-style: disc;
}
</style>