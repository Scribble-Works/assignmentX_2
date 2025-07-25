<template>
  <button
    :class="[
      'text-white px-4 py-2 rounded transition-colors duration-200',
      bgColorClass,
      hoverColorClass,
      widthClass,
      customClass,
    ]"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  name: "AppButton",
  props: {
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: "blue",
    },
    width: {
      type: String,
      default: "",
    },
    class: {
      type: String,
      default: "",
    },
  },
  computed: {
    bgColorClass() {
      return `bg-${this.color}-600`;
    },
    hoverColorClass() {
      return `hover:bg-${this.color}-700`;
    },
    widthClass() {
      return this.width;
    },
    customClass() {
      return this.class;
    },
  },
};
</script>
