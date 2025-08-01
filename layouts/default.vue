<template>
    <div class="min-h-screen flex flex-col">
        <theHeader />
        <main class="flex-1">
            <slot />
        </main>
        <theFooter />
    </div>
</template>