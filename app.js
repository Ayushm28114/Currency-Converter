const BASE_URL = "https://api.frankfurter.app/latest";

// Country codes for flag API - maps currency to country code
const countryList = {
    USD: "US",
    AUD: "AU",
    BGN: "BG",
    BRL: "BR",
    CAD: "CA",
    CHF: "CH",
    CNY: "CN",
    CZK: "CZ",
    DKK: "DK",
    EUR: "EU",
    GBP: "GB",
    HKD: "HK",
    HUF: "HU",
    IDR: "ID",
    ILS: "IL",
    INR: "IN",
    ISK: "IS",
    JPY: "JP",
    KRW: "KR",
    MXN: "MX",
    MYR: "MY",
    NOK: "NO",
    NZD: "NZ",
    PHP: "PH",
    PLN: "PL",
    RON: "RO",
    SEK: "SE",
    SGD: "SG",
    THB: "TH",
    TRY: "TR",
    ZAR: "ZA"
};

// Get DOM elements
const fromSelect = document.getElementById("fromCurrency");
const toSelect = document.getElementById("toCurrency");
const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");
const amount = document.getElementById("amount");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("resultText");

// Debug: Check if elements exist
console.log("DOM Elements:", {
  fromSelect,
  toSelect,
  fromFlag,
  toFlag,
  amount,
  convertBtn,
  result,
});

// Populate select dropdowns with currencies
function populateDropdowns() {
  console.log("Populating dropdowns...");

  if (!fromSelect || !toSelect) {
    console.error("Select elements not found!");
    return;
  }

  // Clear existing options
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  // Add currency options
  for (const currency of Object.keys(countryList)) {
    const option1 = document.createElement("option");
    option1.value = currency;
    option1.text = currency;
    fromSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = currency;
    option2.text = currency;
    toSelect.appendChild(option2);
  }

  // Set default values
  fromSelect.value = "USD";
  toSelect.value = "INR";
  updateFlags();
  console.log("Dropdowns populated successfully!");
}

// Update flag images based on selected currencies
function updateFlags() {
  if (!fromSelect || !toSelect || !fromFlag || !toFlag) {
    console.error("Required elements for flag update not found!");
    return;
  }

  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  const fromCountry = countryList[fromCurrency];
  const toCountry = countryList[toCurrency];

  if (fromCountry && toCountry) {
    fromFlag.src = `https://flagsapi.com/${fromCountry}/flat/64.png`;
    toFlag.src = `https://flagsapi.com/${toCountry}/flat/64.png`;
    console.log(
      `Flags updated: ${fromCurrency} -> ${fromCountry}, ${toCurrency} -> ${toCountry}`
    );
  }
}

// Convert currency using API
async function convertCurrency() {
  console.log("Convert button clicked!");

  if (!amount || !result) {
    console.error("Amount input or result element not found!");
    return;
  }

  const amountValue = amount.value;
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;

  console.log(`Converting ${amountValue} ${fromCurrency} to ${toCurrency}`);

  if (!amountValue || amountValue <= 0) {
    result.textContent = "Please enter a valid amount";
    return;
  }

  // Show loading state
  result.textContent = "Converting...";

  try {
    const url = `${BASE_URL}?from=${fromCurrency}&to=${toCurrency}`;
    console.log("Fetching from:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    const rate = data.rates[toCurrency];

    if (!rate) {
      throw new Error(`No rate found for ${toCurrency}`);
    }

    const convertedAmount = (amountValue * rate).toFixed(2);

    result.textContent = `${amountValue} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    console.log("Conversion successful!");
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    result.textContent = `Error: ${error.message}`;
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded!");
  populateDropdowns();

  // Add event listeners with error checking
  if (fromSelect) {
    fromSelect.addEventListener("change", updateFlags);
    console.log("FromSelect event listener added");
  }

  if (toSelect) {
    toSelect.addEventListener("change", updateFlags);
    console.log("ToSelect event listener added");
  }

  if (convertBtn) {
    convertBtn.addEventListener("click", convertCurrency);
    console.log("Convert button event listener added");
  }

  // Also allow Enter key to convert
  if (amount) {
    amount.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        convertCurrency();
      }
    });
  }
});

// Test the countryList iteration (this will now work!)
console.log("Available currencies:");
for (const currency of Object.keys(countryList)) {
  console.log(`${currency}: ${countryList[currency]}`);
}
