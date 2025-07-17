<script setup>
import ProductCard from "~/components/productCard.vue";
import AppButton from "~/components/button.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Header Section -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p class="text-gray-600">Last Updated: April 2025</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <!-- Left Column - Content -->
        <div class="space-y-12">
          <!-- Introduction -->
          <div>
            <p class="text-gray-700 leading-relaxed mb-4">
              Welcome to AssignmentX. Your privacy is important to us. This
              Privacy Policy explains how we collect, use, and protect your
              information when you use our website:
              <a href="#" class="text-blue-600 hover:text-blue-800 underline"
                >www.assignmentx.com</a
              >.
            </p>
          </div>

          <!-- Information We Collect -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Information We Collect
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6">
              We are committed to collecting only the information that is
              necessary to provide a safe and effective learning experience on
              AssignmentX. When you interact with our website, we may collect
              certain personal details that help us tailor the content, monitor
              progress, and improve the educational journey. This may include:
            </p>

            <div class="space-y-6">
              <div>
                <h3 class="font-semibold text-gray-900 mb-2">
                  • Personal Information:
                </h3>
                <p class="text-gray-700 leading-relaxed ml-4">
                  We may collect the following personal information when you
                  register, submit a form, or use interactive features on the
                  site such as name, email address, age, grade level, parent or
                  guardian's contact information
                </p>
              </div>

              <div>
                <h3 class="font-semibold text-gray-900 mb-2">
                  • Usage Information:
                </h3>
                <p class="text-gray-700 leading-relaxed ml-4">
                  When you use AssignmentX, we automatically collect certain
                  information about how the site is accessed and used. This
                  helps us understand engagement, improve site features, and
                  ensure a smooth experience for all users eg) device details,
                  IP address, pages visited etc
                </p>
              </div>
            </div>
          </section>

          <!-- How We Use Your Information -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              How We Use Your Information
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6">
              We use the information to:
            </p>

            <ul class="space-y-3 text-gray-700">
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Provide and personalize educational content</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Improve site performance and functionality</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span
                  >Communicate with users (e.g., progress updates,
                  support)</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Monitor usage and enhance user experience</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Comply with legal obligations</span>
              </li>
            </ul>
          </section>

          <!-- Children's Privacy -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Children's Privacy
            </h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              AssignmentX is designed to support learning for children. We
              comply with the Children's Online Privacy Protection Act (COPPA).
              If you are under 13, please ensure a parent or guardian reviews
              this policy and consents to your use of the Site.
            </p>
            <p class="text-gray-700 leading-relaxed">
              We do not knowingly collect personal data from children under 13
              without verifiable parental consent.
            </p>
          </section>

          <!-- Sharing Your Information -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Sharing Your Information
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6">
              We do not sell your personal information. We may share data with:
            </p>

            <ul class="space-y-3 text-gray-700">
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span
                  >Service providers who help us operate the Site (e.g.,
                  hosting, analytics)</span
                >
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Legal authorities if required by law</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span
                  >Parents/guardians or educators (where appropriate and with
                  consent)</span
                >
              </li>
            </ul>
          </section>

          <!-- Cookies and Tracking -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Cookies and Tracking
            </h2>
            <p class="text-gray-700 leading-relaxed mb-6">
              We use cookies and similar technologies to:
            </p>

            <ul class="space-y-3 text-gray-700 mb-6">
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Remember user preferences</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Track learning progress</span>
              </li>
              <li class="flex items-start">
                <span class="text-gray-900 mr-2">•</span>
                <span>Understand how the site is used</span>
              </li>
            </ul>

            <p class="text-gray-700 leading-relaxed">
              You can disable cookies in your browser, but some site features
              may not function properly.
            </p>
          </section>

          <!-- Data Security -->
          <section>
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
            <p class="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your
              information. However, no method of transmission or storage is 100%
              secure.
            </p>
          </section>
        </div>

        <!-- Right Column - Illustration -->
        <div class="hidden lg:flex justify-center items-center sticky top-12">
          <div class="relative">
            <img
              src="/img/bro.png"
              alt="Privacy Policy Illustration - Woman with privacy shield"
              class="w-full max-w-md h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.product {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
