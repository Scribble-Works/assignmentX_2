<script setup>
const user = useSupabaseUser();
</script>
<template>
  <div class="body">
    <!-- Hero Section -->
    <section
      class="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style="background-image: url('/img/img1.jpg')"
    >
      <div class="absolute inset-0 bg-black opacity-50"></div>
      <div class="text-center text-white relative z-10 p-4 max-w-lg mx-auto">
        <h1 class="text-4xl md:text-6xl font-bold">
          Finally, Math That
          <div class="asign">Makes Sense.</div>
        </h1>
        <p class="mt-4 text-lg md:text-xl">
          Math can be hard — but it doesn’t have to be boring or confusing.
          AssignmentX is here to help you understand the “why” behind the
          numbers, not just memorize formulas.
        </p>
        <br />
        <div v-if="!user">
          <v-btn to="/auth" size="large" color="blue" rounded="sm"
            >Get Started</v-btn
          >
        </div>
        <div v-else>
          <v-btn to="/workbook/" size="large" color="blue" rounded="sm"
            >Get Started</v-btn
          >
        </div>
      </div>
    </section>

    <v-container class="mt-20">
      <v-row>
        <v-col cols="" lg="7" sm="12" md="6">
          <v-img src="/img/strug.png" height="550" width="auto" cover></v-img>
        </v-col>
        <v-col class="mt-10" cols="" lg="5" sm="12" md="6">
          <h2
            style="
              font-family: 'Inter', sans-serif;
              font-weight: bold;
              color: #3e4f5c;
            "
            class="text-h3"
          >
            Turn Every Math Lesson into a Journey of Discovery.
          </h2>
          <br />
          <p style="font-family: 'Inter', sans-serif">
            AssignmentX helps you make math more engaging and effective — even
            in resource-limited classrooms. Built on the Ghanaian curriculum and
            designed for Junior High learners, it supports your teaching with
          </p>
          <br />
          <v-btn class="text-white" color="yellow-darken-2" rounded="lg"
            >Learn More</v-btn
          >
        </v-col>
      </v-row>

      <v-row class="mt-15 pt-16">
        <v-col class="mt-15" cols="" lg="5" md="12" sm="12">
          <h2
            style="
              font-family: 'Inter', sans-serif;
              font-weight: bold;
              color: #3e4f5c;
            "
            class="text-h2"
          >
            Struggling to understand your textbook?
          </h2>
          <br />
          <p>
            AssignmentX is more than a digital learning tool — it's a response
            to one of the biggest challenges in African education: students
            struggling to grasp mathematics. Built as a web extension of The
            Assignment Maths Workbook Series, AssignmentX offers a
            curriculum-aligned, culturally relevant, and pedagogically sound
            platform designed as an African edtech solution transforming math
            from confusion to curiosity
          </p>
        </v-col>
        <v-col cols="" lg="7" md="12" sm="12">
          <v-img
            height="550"
            width="auto"
            src="/img/textbook.png"
            cover
          ></v-img>
        </v-col>
      </v-row>

      <div class="mt-15">
        <p
          class="text-center text-uppercase text-h6"
          style="
            font-family: 'Inter', sans-serif;
            color: #66bb6a;
            font-weight: bold;
          "
        >
          what to do
        </p>
        <h1
          class="text-center text-h4"
          style="font-family: 'Inter', sans-serif; color: #3e4f5c"
        >
          Help Your Child
          <span
            style="
              text-decoration: underline;
              text-decoration-color: #fcc30c;
              text-decoration-style: initial;
              text-decoration-line: underline;
            "
            >Understand</span
          >
          Not Just Memorize.
        </h1>
        <br />
        <v-row>
          <v-col cols="" lg="5" sm="12" md="6">
            <!-- <v-sheet elevation="2" rounded> -->
            <v-img height="600" src="/img/understand.png" cover rounded></v-img>
            <!-- </v-sheet> -->
          </v-col>
          <v-col class="mt-5" cols="" lg="7" sm="12" md="6">
            <v-row>
              <v-col cols="4">
                <v-icon style="color: #2096f3; font-size: 5em"
                  >mdi-magnify</v-icon
                >
              </v-col>
              <v-col cols="8">
                <h2 class="text-h4">Explore the Chapters</h2>
                <p>Browse our comprehensive list of textbook chapters</p>
              </v-col> </v-row
            ><br />
            <div class="vert"></div>
            <br />
            <v-row>
              <v-col cols="4">
                <v-icon style="font-size: 5em; color: #e5253a"
                  >mdi-book-open-variant-outline</v-icon
                >
              </v-col>
              <v-col cols="8">
                <h2 class="text-h4">Dive into the Topics</h2>
                <p>
                  Select a chpater and explore detailed explanations and
                  examples
                </p>
              </v-col> </v-row
            ><br />
            <div class="vert"></div>
            <br />
            <v-row>
              <v-col cols="4">
                <v-icon style="font-size: 5em; color: #fcc30c"
                  >mdi-check</v-icon
                >
              </v-col>
              <v-col cols="8">
                <h2 class="text-h4">Practice and Quiz</h2>
                <p>
                  Select a chpater and explore detailed explanations and
                  examples
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <br /><br /><br />
      <div class="mt-16 py-16">
        <h4
          class="text-h6 text-uppercase text-center"
          style="color: #66bb6a; font-family: 'Inter', sans-serif"
        >
          course category
        </h4>
        <br />
        <h3
          class="text-h3 text-center"
          style="font-family: 'Inter', sans-serif"
        >
          Explore Our
          <span
            style="text-decoration: underline; text-decoration-color: #fcc30c"
            >Features</span
          >
        </h3>
        <br />

        <div class="flex flex-wrap justify-center gap-12 max-auto mt-10">
          <!-- Video Lessons -->
          <div class="flex flex-col items-center text-center w-full md:w-64">
            <div class="w-full flex justify-center mb-4">
              <div
                class="bg-yellow-100 w-32 h-32 rounded-2xl flex items-center justify-center"
              >
                <v-icon class="text-6xl text-yellow-500" size="4em"
                  >mdi-video-outline</v-icon
                >
              </div>
            </div>
            <h3
              class="text-2xl font-bold mb-2"
              style="font-family: 'Inter', sans-serif"
            >
              Video Lessons
            </h3>
            <p class="text-gray-600 mb-4 w-[100%]">
              Cool concept videos that explain things in simple ways
            </p>
            <div v-if="!user">
              <v-btn to="/auth" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
            <div v-else>
              <v-btn to="/workbook/" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
          </div>

          <!-- Concept Notes -->
          <div class="flex flex-col items-center text-center w-full md:w-64">
            <div class="w-full flex justify-center mb-4">
              <div
                class="bg-red-100 w-32 h-32 rounded-2xl flex items-center justify-center"
              >
                <v-icon class="text-6xl text-red-600" size="4em"
                  >mdi-note-outline</v-icon
                >
              </div>
            </div>
            <h3
              class="text-2xl font-bold mb-2"
              style="font-family: 'Inter', sans-serif"
            >
              Concept Notes
            </h3>
            <p class="text-gray-600 mb-4">
              Detailed study notes to deepen your knowledge.
            </p>
            <div v-if="!user">
              <v-btn to="/auth" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
            <div v-else>
              <v-btn to="/workbook/" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
          </div>

          <!-- Quizzes -->
          <div class="flex flex-col items-center text-center w-full md:w-64">
            <div class="w-full flex justify-center mb-4">
              <div
                class="bg-green-100 w-32 h-32 rounded-2xl flex items-center justify-center"
              >
                <v-icon class="text-5xl text-green-600" size="4em"
                  >mdi-note-plus-outline</v-icon
                >
              </div>
            </div>
            <h3
              class="text-2xl font-bold mb-2"
              style="font-family: 'Inter', sans-serif"
            >
              Quizzes
            </h3>
            <p class="text-gray-600 mb-4">
              Test yourself with interactive quizzes and challenges
            </p>
            <div v-if="!user">
              <v-btn to="/auth" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
            <div v-else>
              <v-btn to="/workbook/" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
          </div>

          <!-- Worksheets -->
          <div class="flex flex-col items-center text-center w-full md:w-64">
            <div class="w-full flex justify-center mb-4">
              <div
                class="bg-gray-100 w-32 h-32 rounded-2xl flex items-center justify-center"
              >
                <v-icon class="text-6xl text-gray-600" size="4em"
                  >mdi-google-spreadsheet</v-icon
                >
              </div>
            </div>
            <h3
              class="text-2xl font-bold mb-2"
              style="font-family: 'Inter', sans-serif"
            >
              Worksheets
            </h3>
            <p class="text-gray-600 mb-4">
               Downloadable worksheets to help you practice for class and exams
            </p>
            <div v-if="!user">
              <v-btn to="/auth" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
            <div v-else>
              <v-btn to="/workbook/" color="yellow-darken-2" class="text-white"
                >Explore</v-btn
              >
            </div>
          </div>
        </div>
      </div>

      <br />
      <div class="mt-15">
        <v-row>
          <v-col cols="" lg="7" sm="12" md="6">
            <!-- <v-sheet elevation="2" rounded> -->
            <v-img src="/img/shop.png" height="700" cover></v-img>
            <!-- </v-sheet> -->
          </v-col>
          <v-col
            cols=""
            lg="5"
            sm="12"
            md="6"
            class="mt-15 d-flex flex-column justify-center pl-15"
          >
            <h3
              class="text-h3"
              style="font-family: 'Inter', sans-serif; color: #3e4f5c"
            >
              Don't have the
              <span
                style="
                  text-decoration: underline;
                  text-decoration-color: #fcc30c;
                "
                >book</span
              ><br />
              yet?
            </h3>
            <br />
            <p style="font-family: 'Inter', sans-serif">
              Get your Assignment Workbook now and unlock a <br />
              world of learning with QR code scanning!
            </p>
            <br />
            <v-btn href="/pricing" size="large" width="150" color="blue"
              >Buy the Book</v-btn
            >
          </v-col>
        </v-row>
      </div>
      <br />
      <div class="mt-15 mb-16">
        <v-row>
          <v-col
            cols=""
            lg="5"
            md="6"
            sm="12"
            class="d-flex flex-column justify-center"
          >
            <h3
              class="text-h3 text-capitalize"
              style="font-family: 'Inter', sans-serif; color: #3e4f5c"
            >
              ready to take your learning to the next level?
              <span
                ><v-img
                  class="mt-n15"
                  style="margin-left: 3em"
                  height="90"
                  src="/img/mdi_arrow.png"
                ></v-img
              ></span>
            </h3>
            <br />
            <div v-if="!user">
              <v-btn
                to="/auth"
                size="large"
                class="mt-n10"
                width="150"
                color="blue"
                >Get Started</v-btn
              >
            </div>
            <div v-else>
              <v-btn
                to="/workbook/"
                size="large"
                class="mt-n10"
                width="150"
                color="blue"
                >Get Started</v-btn
              >
            </div>
          </v-col>
          <v-col cols="" lg="7" md="6" sm="12">
            <!-- <v-sheet elevation="2" rounded> -->
            <v-img src="/img/jump.png" height="600" cover rounded></v-img>
            <!-- </v-sheet> -->
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
<style>
.body {
  background-color: white;
}

.asign {
  color: rgb(255, 187, 0);
}

.vert {
  border-left: 1px solid #1f1e1e;
  height: 15%;
  margin-left: 2.5em;
}
</style>
