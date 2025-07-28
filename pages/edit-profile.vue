<template>
  <div class="min-h-screen bg-white p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-black mb-8">Edit Profile</h1>

      <!-- Form -->
      <form @submit.prevent="saveChanges" class="space-y-6">
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- First Name -->
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium text-black mb-2"
              >
                First Name
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-black mb-2"
              >
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <!-- Password -->
            <div>
              <label
                for="password"
                class="block text-sm font-medium text-black mb-2"
              >
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Enter your password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <!-- Date of Birth -->
            <div>
              <label
                for="dateOfBirth"
                class="block text-sm font-medium text-black mb-2"
              >
                Date of Birth
              </label>
              <div class="relative">
                <input
                  id="dateOfBirth"
                  v-model="form.dateOfBirth"
                  type="text"
                  readonly
                  @click="showDatePicker = true"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent pr-10 cursor-pointer"
                  placeholder="Select date"
                />
                <button
                  type="button"
                  @click="showDatePicker = true"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>

              <!-- Date Picker Modal -->
              <div
                v-if="showDatePicker"
                class="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
              >
                <div
                  class="bg-white rounded-lg p-6 w-80 shadow-xl max-h-[90vh] overflow-y-auto"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold">Select Date</h3>
                    <button
                      @click="showDatePicker = false"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        class="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Calendar -->
                  <div class="mb-4">
                    <div class="flex justify-between items-center mb-2">
                      <button
                        @click="previousMonth"
                        class="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <span class="font-semibold">{{ currentMonthYear }}</span>
                      <button
                        @click="nextMonth"
                        class="p-1 hover:bg-gray-100 rounded"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    <!-- Days of week -->
                    <div class="grid grid-cols-7 gap-1 mb-2">
                      <div
                        v-for="day in [
                          'Sun',
                          'Mon',
                          'Tue',
                          'Wed',
                          'Thu',
                          'Fri',
                          'Sat',
                        ]"
                        :key="day"
                        class="text-center text-sm font-medium text-gray-500 py-1"
                      >
                        {{ day }}
                      </div>
                    </div>

                    <!-- Calendar grid -->
                    <div class="grid grid-cols-7 gap-1">
                      <div
                        v-for="date in calendarDates"
                        :key="date.key"
                        @click="selectDate(date)"
                        :class="[
                          'text-center py-2 cursor-pointer rounded hover:bg-gray-100',
                          date.isCurrentMonth
                            ? 'text-gray-900'
                            : 'text-gray-400',
                          date.isSelected
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : '',
                          date.isToday ? 'font-bold' : '',
                        ]"
                      >
                        {{ date.day }}
                      </div>
                    </div>
                  </div>

                  <!-- Action buttons -->
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="showDatePicker = false"
                      class="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      @click="confirmDate"
                      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Last Name -->
            <div>
              <label
                for="lastName"
                class="block text-sm font-medium text-black mb-2"
              >
                Last Name
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <!-- Gender -->
            <div>
              <label
                for="gender"
                class="block text-sm font-medium text-black mb-2"
              >
                Gender
              </label>
              <input
                id="gender"
                v-model="form.gender"
                type="text"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label
                for="confirmPassword"
                class="block text-sm font-medium text-black mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Confirm your password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label
                for="phoneNumber"
                class="block text-sm font-medium text-black mb-2"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                v-model="form.phoneNumber"
                type="tel"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- Save Changes Button -->
        <div class="pt-6">
          <button
            type="submit"
            class="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Get current user
const user = useSupabaseUser();
const client = useSupabaseClient();

// Log current user information
console.log("Current user:", user.value);
console.log("User ID:", user.value?.id);
console.log("User email:", user.value?.email);

// Form data
const form = ref({
  firstName: "Jane Doe",
  lastName: "Jane Doe",
  email: "janeDoe@gmail.com",
  password: "",
  confirmPassword: "",
  gender: "",
  dateOfBirth: "",
  phoneNumber: "",
});

// Date picker state
const showDatePicker = ref(false);
const currentDate = ref(new Date());
const selectedDate = ref(null);

// Computed properties for date picker
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const dates = [];
  const today = new Date();

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    dates.push({
      key: date.toISOString(),
      day: date.getDate(),
      date: date,
      isCurrentMonth: date.getMonth() === month,
      isToday: date.toDateString() === today.toDateString(),
      isSelected:
        selectedDate.value &&
        date.toDateString() === selectedDate.value.toDateString(),
    });
  }

  return dates;
});

// Date picker methods
const previousMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  );
};

const selectDate = (date) => {
  if (date.isCurrentMonth) {
    selectedDate.value = date.date;
  }
};

const confirmDate = () => {
  if (selectedDate.value) {
    form.value.dateOfBirth = selectedDate.value.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
  showDatePicker.value = false;
};

// Handle form submission
const saveChanges = () => {
  console.log("Saving changes:", form.value);
  // Add your save logic here
  // e.g., API call to update user profile
};
</script>
