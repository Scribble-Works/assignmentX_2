<script setup>
definePageMeta({
    layout: 'auth',
});

const { auth } = useSupabaseClient();
const client = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();
const menu = ref(false);
const modal = ref(false);

const fName = ref('');
const lName = ref('');
const alert = ref(false);
const text = ref('');
const school = ref('');
const dob = ref(new Date().toISOString().substring(0, 10));
const gender = ref('');
const countryCode = ref('+233');
const phone = ref('');

// Phone validation rules
const rules = {
    phone: (v) => {
        if (!v) return true; // Allow empty (not required)
        const digitsOnly = /^[0-9]+$/.test(v);
        if (!digitsOnly) return "Invalid phone number - digits only";
        if (v.length < 6 || v.length > 15) return "Invalid phone number - must be 6-15 digits";
        return true;
    },
};

// Country codes - African countries first (Ghana default), then other regions
const countryCodes = [
    // Africa (all countries)
    { title: 'Ghana (+233)', value: '+233' },
    { title: 'Algeria (+213)', value: '+213' },
    { title: 'Angola (+244)', value: '+244' },
    { title: 'Benin (+229)', value: '+229' },
    { title: 'Botswana (+267)', value: '+267' },
    { title: 'Burkina Faso (+226)', value: '+226' },
    { title: 'Burundi (+257)', value: '+257' },
    { title: 'Cameroon (+237)', value: '+237' },
    { title: 'Cape Verde (+238)', value: '+238' },
    { title: 'Central African Republic (+236)', value: '+236' },
    { title: 'Chad (+235)', value: '+235' },
    { title: 'Comoros (+269)', value: '+269' },
    { title: 'Congo (+242)', value: '+242' },
    { title: 'DR Congo (+243)', value: '+243' },
    { title: 'Djibouti (+253)', value: '+253' },
    { title: 'Egypt (+20)', value: '+20' },
    { title: 'Equatorial Guinea (+240)', value: '+240' },
    { title: 'Eritrea (+291)', value: '+291' },
    { title: 'Eswatini (+268)', value: '+268' },
    { title: 'Ethiopia (+251)', value: '+251' },
    { title: 'Gabon (+241)', value: '+241' },
    { title: 'Gambia (+220)', value: '+220' },
    { title: 'Guinea (+224)', value: '+224' },
    { title: 'Guinea-Bissau (+245)', value: '+245' },
    { title: 'Ivory Coast (+225)', value: '+225' },
    { title: 'Kenya (+254)', value: '+254' },
    { title: 'Lesotho (+266)', value: '+266' },
    { title: 'Liberia (+231)', value: '+231' },
    { title: 'Libya (+218)', value: '+218' },
    { title: 'Madagascar (+261)', value: '+261' },
    { title: 'Malawi (+265)', value: '+265' },
    { title: 'Mali (+223)', value: '+223' },
    { title: 'Mauritania (+222)', value: '+222' },
    { title: 'Mauritius (+230)', value: '+230' },
    { title: 'Morocco (+212)', value: '+212' },
    { title: 'Mozambique (+258)', value: '+258' },
    { title: 'Namibia (+264)', value: '+264' },
    { title: 'Niger (+227)', value: '+227' },
    { title: 'Nigeria (+234)', value: '+234' },
    { title: 'Rwanda (+250)', value: '+250' },
    { title: 'São Tomé and Príncipe (+239)', value: '+239' },
    { title: 'Senegal (+221)', value: '+221' },
    { title: 'Seychelles (+248)', value: '+248' },
    { title: 'Sierra Leone (+232)', value: '+232' },
    { title: 'Somalia (+252)', value: '+252' },
    { title: 'South Africa (+27)', value: '+27' },
    { title: 'South Sudan (+211)', value: '+211' },
    { title: 'Sudan (+249)', value: '+249' },
    { title: 'Tanzania (+255)', value: '+255' },
    { title: 'Togo (+228)', value: '+228' },
    { title: 'Tunisia (+216)', value: '+216' },
    { title: 'Uganda (+256)', value: '+256' },
    { title: 'Zambia (+260)', value: '+260' },
    { title: 'Zimbabwe (+263)', value: '+263' },
    // North America
    { title: 'USA (+1)', value: '+1' },
    { title: 'Canada (+1)', value: '+1' },
    { title: 'Mexico (+52)', value: '+52' },
    // South America
    { title: 'Argentina (+54)', value: '+54' },
    { title: 'Brazil (+55)', value: '+55' },
    { title: 'Chile (+56)', value: '+56' },
    { title: 'Colombia (+57)', value: '+57' },
    { title: 'Peru (+51)', value: '+51' },
    { title: 'Venezuela (+58)', value: '+58' },
    // Europe
    { title: 'UK (+44)', value: '+44' },
    { title: 'Germany (+49)', value: '+49' },
    { title: 'France (+33)', value: '+33' },
    { title: 'Italy (+39)', value: '+39' },
    { title: 'Spain (+34)', value: '+34' },
    { title: 'Netherlands (+31)', value: '+31' },
    { title: 'Belgium (+32)', value: '+32' },
    { title: 'Portugal (+351)', value: '+351' },
    { title: 'Switzerland (+41)', value: '+41' },
    // Asia
    { title: 'China (+86)', value: '+86' },
    { title: 'India (+91)', value: '+91' },
    { title: 'Japan (+81)', value: '+81' },
    { title: 'South Korea (+82)', value: '+82' },
    { title: 'UAE (+971)', value: '+971' },
    { title: 'Saudi Arabia (+966)', value: '+966' },
    { title: 'Singapore (+65)', value: '+65' },
    { title: 'Malaysia (+60)', value: '+60' },
];

// Computed full phone number with country code
const fullPhoneNumber = computed(() => {
    if (!phone.value) return '';
    return `${countryCode.value}${phone.value.replace(/^0+/, '')}`;
});

const submit = async () => {
    try {
        const { error } = await client.from('profiles').insert({
            firstName: fName.value,
            lastName: lName.value,
            school: school.value,
            DOB: dob.value,
            gender: gender.value,
            phone: fullPhoneNumber.value,
            id: user.value && user.value.id ? user.value.id : null
        }).single();

        if (error) {
            alert.value = true;
            text.value = 'An error occurred. Please try again later.';
            console.error(error);
        } else {
            alert.value = true;
            text.value = 'Profile updated successfully!';
            // router.push('/');
        }
    } catch (error) {
        alert.value = true;
        text.value = 'An error occurred. Please try again later.';
        console.error(error);
    }
};
const closeAlert = () => {
    alert.value = false;
    if (text.value === 'Profile updated successfully!') {
        router.push('/');
    }
};
</script>
<template>
    <div class="body">
        <v-container>
            <v-row>
                <v-col class="mt-16 pt-16" cols="" lg="6" sm="12" md="12">
                    <h3 class="text-h3" style="font-family: 'Inter', sans-serif; font-weight: bold;">Get Started Now
                    </h3><br>
                    <form @submit.prevent="submit">
                        <v-row>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>First Name</v-label>
                                <v-text-field variant="outlined" placeholder="First Name" v-model="fName" />
                            </v-col>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Last Name</v-label>
                                <v-text-field variant="outlined" placeholder="Last Name" v-model="lName" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Date of Birth</v-label>
                                <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40"
                                    transition="scale-transition" offset-y min-width="290px">
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="dob" variant="outlined" placeholder="Date of Birth"
                                            append-inner-icon="event" readonly v-bind="props" />
                                    </template>
                                    <v-date-picker v-model="dob" @update:model-value="menu = false"></v-date-picker>
                                </v-menu>
                            </v-col>
                            <v-col cols="" lg="6" md="12" sm="12">
                                <v-label>Gender</v-label>
                                <v-select placeholder="Gender" variant="outlined" :items="['Male', 'Female']"
                                    v-model="gender" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="" lg="6" md="6" sm="12">
                                <v-label>School</v-label>
                                <v-text-field variant="outlined" placeholder="School" v-model="school" />
                            </v-col>
                            <v-col cols="" lg="6" md="6" sm="12">
                                <v-label>Phone Number</v-label>
                                <v-row no-gutters>
                                    <v-col cols="5" sm="4">
                                        <v-select 
                                            v-model="countryCode" 
                                            :items="countryCodes"
                                            item-title="title"
                                            item-value="value"
                                            variant="outlined"
                                            hide-details
                                        />
                                    </v-col>
                                    <v-col cols="7" sm="8">
                                        <v-text-field 
                                            variant="outlined" 
                                            placeholder="Phone number (e.g. 201001041)" 
                                            v-model="phone"
                                            type="tel"
                                            :rules="[rules.phone]"
                                        />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-btn style="width: 100%;" color="grey-darken-3" type="submit">Submit</v-btn>
                    </form>
                </v-col>
                <v-col cols="" lg="6" sm="12" md="12">
                    <v-img src="/img/bio.png" height="700"></v-img>
                </v-col>
            </v-row>

            <v-dialog v-model="alert" max-width="400">
                <v-card>
                    <v-card-title class="headline">Profile Update</v-card-title>
                    <v-card-text>{{ text }}</v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" variant="text" @click="closeAlert()">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<style>
.datePicker {
    color: rgb(122, 133, 143);
}
</style>