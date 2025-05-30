<script setup>
const user = useSupabaseUser();
</script>
<template>
    <div>
        <!-- Hero Section -->
        <section class="flex items-center justify-center min-h-screen bg-cover bg-center relative"
            style="background-image: url('/img/img1.jpg');">
            <div class="absolute inset-0 bg-black opacity-50"></div>
            <div class="text-center text-white relative z-10 p-4 max-w-lg mx-auto">
                <h1 class="text-4xl md:text-6xl font-bold">Unlock Learning with <div class="asign">AssignmentX</div>
                </h1>
                <p class="mt-4 text-lg md:text-xl">Scan your workbook QR code to access an abundance of learning
                    resources.</p><br>
                <div v-if="!user">
                    <v-btn to="/auth" size="large" color="blue" rounded="sm">Get Started</v-btn>
                </div>
                <div v-else>
                    <v-btn to="/workbook/" size="large" color="blue" rounded="sm">Get Started</v-btn>
                </div>
            </div>
        </section>

        <v-container class="mt-15">
            <v-row>
                <v-col class="mt-15 d-flex flex-column justify-center" cols="auto" lg="5" sm="12" md="6">
                    <p class="text-uppercase text-h6" style="color: #66BB6A; font-family: 'Inter', sans-serif;">what we do</p>
                    <h2 class="text-h4" style="font-family: 'Inter', sans-serif; color: #3E4F5C;">Struggling to <span style="text-decoration: underline; text-decoration-color: #FCC30C; text-decoration-style: initial; text-decoration-line: underline;">understand</span> <br> your textbook?</h2><br>
                    <p style="font-family: 'Inter', sans-serif;">We've got you covered. <br> Clear explanations, helpful examples, and extra <br> insights - all
                        designed to help you master your <br> subject.</p>
                </v-col>
                <v-col cols="" lg="7" sm="12" md="6">
                    <v-row>
                        <v-col cols="6">
                            <v-sheet elevation="2" rounded>
                                <v-img src="/img/home1.jpg" height="650" cover rounded></v-img>
                            </v-sheet>   
                            
                        </v-col>
                        <v-col cols="6">
                            <v-row>
                                <v-col cols="12">
                                    <v-sheet elevation="2" rounded>
                                        <v-img height="315" src="/img/home2.jpg" cover  rounded></v-img>
                                    </v-sheet>
                                </v-col>
                                <v-col cols="12">
                                    <v-sheet elevation="2" rounded>
                                        <v-img height="315" src="/img/home3.jpg" cover  rounded></v-img>
                                    </v-sheet>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row><br>


            <div class="mt-15">
                <p class="text-center text-uppercase text-h6" style="font-family: 'Inter', sans-serif; color: #66BB6A; font-weight: bold;">what to do</p>
                <h1 class="text-center text-h4" style="font-family: 'Inter', sans-serif; color: #3E4F5C;">Getting <span style="text-decoration: underline; text-decoration-color: #FCC30C; text-decoration-style: initial; text-decoration-line: underline;">Started</span></h1><br>
                <v-row>
                    <v-col cols="" lg="5" sm="12" md="6">
                        <v-sheet elevation="2" rounded>
                            <v-img height="600" src="/img/home4.jpg" cover rounded></v-img>
                        </v-sheet>
                    </v-col>
                    <v-col class="mt-5" cols="" lg="7" sm="12" md="6">
                        <v-row>
                            <v-col cols="4">
                                <v-icon style="color: #2096F3; font-size: 5em;">mdi-magnify</v-icon>
                            </v-col>
                            <v-col cols="8">
                                <h2 class="text-h4">Explore the Chapters</h2>
                                <p>Browse our comprehensive list of textbook chapters</p>
                            </v-col>
                        </v-row><br>
                        <div class="vert"></div>
                        <br>
                        <v-row>
                            <v-col cols="4">
                                <v-icon style="font-size: 5em; color: #E5253A;">mdi-book-open-variant-outline</v-icon>
                            </v-col>
                            <v-col cols="8">
                                <h2 class="text-h4">Dive into the Topics</h2>
                                <p>Selext a chpater and explore detailed explanations and examples</p>
                            </v-col>
                        </v-row><br>
                        <div class="vert"></div>
                        <br>
                        <v-row>
                            <v-col cols="4">
                                <v-icon style="font-size: 5em; color: #FCC30C;">mdi-check</v-icon>
                            </v-col>
                            <v-col cols="8">
                                <h2 class="text-h4">Practice and Quiz</h2>
                                <p>Selext a chpater and explore detailed explanations and examples</p>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </div>

            <br><br><br>
            <div class="mt-16 py-16">
                <h4 class="text-h6 text-uppercase text-center" style="color: #66BB6A; font-family: 'Inter', sans-serif;">course category</h4><br>
                <h3 class="text-h3 text-center" style="font-family: 'Inter', sans-serif; ">Explore Our <span style="text-decoration: underline; text-decoration-color: #FCC30C;">Features</span></h3>
                <br>
                <v-row class="mt-10">
                    <v-col>
                        <v-sheet>
                            <div style="background-color: #FCC30C33; width: 48.5%; border-radius: 10%;">
                                <v-icon style="font-size: 10em; color: #FCC30C;">mdi-video-outline</v-icon>
                            </div><br>
                            <h3 class="text-h4" style="font-family: 'Inter', sans-serif;">Video Lessons</h3>
                            <p class="text-left">Access interactive video tutorials on <br> various topics</p><br>
                            <div v-if="!user">
                                <v-btn to="/auth" color="blue">Explore</v-btn>
                            </div>
                            <div v-else>
                                <v-btn to="/workbook/" color="blue">Explore</v-btn>
                            </div>
                        </v-sheet>
                    </v-col>
                    <v-col>
                        <v-sheet>
                            <div style="background-color: #E5253A33; width: 48.5%; border-radius: 10%;">
                                <v-icon style="font-size: 10em; color: #E5253A;">mdi-note-outline</v-icon>
                            </div><br>
                            <h3 class="text-h4" style="font-family: 'Inter', sans-serif;">Concept Notes</h3>
                            <p class="text-left">Detailed study notes to deepen your <br> knowledge.</p><br>
                            <div v-if="!user">
                                <v-btn to="/auth" color="blue">Explore</v-btn>
                            </div>
                            <div v-else>
                                <v-btn to="/workbook/" color="blue">Explore</v-btn>
                            </div>
                        </v-sheet>
                    </v-col>
                    <v-col>
                        <v-sheet>
                            <div style="background-color: #4C9F3833; width: 48.5%; border-radius: 10%;">
                                <v-icon style="font-size: 10em; color: #4C9F38;">mdi-note-plus-outline</v-icon>
                            </div><br>
                            <h3 class="text-h4" style="font-family: 'Inter', sans-serif;">Quizzes</h3>
                            <p class="text-left">Test yourself with interactive quizzes <br> and challenges</p><br>
                            <div v-if="!user">
                                <v-btn to="/auth" color="blue">Explore</v-btn>
                            </div>
                            <div v-else>
                                <v-btn to="/workbook/" color="blue">Explore</v-btn>
                            </div>
                        </v-sheet>
                    </v-col>
                </v-row>
            </div>

            <br>
            <div class="mt-15">
                <v-row>
                    <v-col cols="" lg="5" sm="12" md="6">
                        <v-sheet elevation="2" rounded>
                            <v-img src="/img/pileBooks.jpg" height="500" cover rounded></v-img>
                        </v-sheet>
                    </v-col>
                    <v-col cols="" lg="7" sm="12" md="6" class="mt-15 d-flex flex-column justify-center pl-15">
                        <h3 class="text-h3" style="font-family: 'Inter', sans-serif; color: #3E4F5C;">Don't have the <span style="text-decoration: underline; text-decoration-color: #FCC30C;">book</span><br> yet?</h3><br>
                        <p style="font-family: 'Inter', sans-serif;">Get your Assignment Workbook now and unlock a <br> world of learning with QR code scanning!</p><br>
                        <v-btn href="https://wa.me/c/233201001041" size="large" width="150" color="blue">Buy the Book</v-btn>
                    </v-col>
                </v-row>
            </div>
            <br>
            <div class="mt-15 mb-16">
                <v-row>
                    <v-col cols="" lg="5" md="6" sm="12" class="d-flex flex-column justify-center">
                        <h3 class="text-h3 text-capitalize" style="font-family: 'Inter', sans-serif; color: #3E4F5C;">ready to take your learning to the next level? <span><v-img class="mt-n15" height="90" src="/img/mdi_arrow.png"></v-img></span></h3><br>
                        <div v-if="!user">
                            <v-btn to="/auth" size="large" class="mt-n10" width="150" color="blue">Get Started</v-btn>
                        </div>
                        <div v-else>
                            <v-btn to="/workbook/" size="large" class="mt-n10" width="150" color="blue">Get Started</v-btn>
                        </div>
                    </v-col>
                    <v-col cols="" lg="7" md="6" sm="12">
                        <v-sheet elevation="2" rounded>
                            <v-img src="/img/paramecium.jpg" height="500" cover rounded></v-img>
                        </v-sheet>
                    </v-col>
                </v-row>
            </div>
        </v-container>

    </div>
</template>
<style>
.asign {
    color: rgb(255, 187, 0);

}
.vert{
    border-left: 1px solid #1f1e1e;
    height: 15%;
    margin-left: 2.5em;
}
</style>