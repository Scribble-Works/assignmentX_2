<template>
    <div>
        <theHeader />
        <v-container>
            <v-text-field prepend-inner-icon="mdi-magnify" label="Search chapters and topics..."
                variant="outlined"></v-text-field><br>
            <slot />
        </v-container>
        <theFooter />
    </div>
</template>