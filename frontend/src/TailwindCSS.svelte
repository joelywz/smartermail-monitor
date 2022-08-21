<style global>
@tailwind utilities;
@tailwind components;
@tailwind base;

html, body {
    @apply bg-neutral-100;
    box-sizing: border-box;
}

button[type="submit"] {
    @apply bg-blue-500;
    @apply font-medium  transition-all duration-200;
}

button:disabled[type="submit"] {
    @apply bg-neutral-400;
}

button:hover:enabled[type="submit"]{
    @apply bg-blue-600;
}
</style>