const createVirtualAccount = async (name, email, phoneNumber, userId) => {
    try {
        const API_URL = "https://api.paymentpoint.co/api/v1/createVirtualAccount";
        const API_KEY = process.env.PAYMENTPOINT_API_KEY; // Store API key in .env
        const API_SECRET = process.env.PAYMENTPOINT_API_SECRET; // Store secret in .env
        const BUSINESS_ID = process.env.PAYMENTPOINT_BUSINESS_ID; // Store Business ID in .env

        const headers = {
            "Authorization": `Bearer ${API_SECRET}`,
            "Content-Type": "application/json",
            "api-key": API_KEY,
        };

        const data = {
            email: email,
            name: name,
            phoneNumber: phoneNumber,
            bankCode: ["20946"], // ✅ REQUIRED: Bank code for Palmpay
            businessId: BUSINESS_ID, // ✅ REQUIRED: Business ID
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (responseData.status !== "success") {
            throw new Error(responseData.message || "Failed to create virtual account");
        }

        return responseData.bankAccounts[0]; // Return the first virtual account
    } catch (error) {
        console.error("❌ Error creating virtual account:", error.message);
        throw error;
    }
};

// ✅ Export function
module.exports = createVirtualAccount;
