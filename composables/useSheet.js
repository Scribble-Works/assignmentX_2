let sheetRange = "Sheet1!A1:D200";


const getVars = () => {
    const SPREAD_SHEET_ID = useRuntimeConfig().public.SPREAD_SHEET_ID;
    const ACCESS_TOKEN = useRuntimeConfig().public.GOOGLE_API_KEY;
    const APP_CREDENTIALS = useRuntimeConfig().public.APPLICATION_CREDENTIALS;

    return { SPREAD_SHEET_ID, ACCESS_TOKEN, APP_CREDENTIALS };
}


export async function appendRow(data) {
    const { SPREAD_SHEET_ID, ACCESS_TOKEN, APP_CREDENTIALS } = getVars();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREAD_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW&key=${ACCESS_TOKEN}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            values: [data]
        })
    });

    return await response.json();
}
