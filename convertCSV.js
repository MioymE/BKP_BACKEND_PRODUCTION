const csv = require('csvtojson');
const fs = require('fs');

// Paths to the CSV and JSON files
const csvFilePath = './data/MIOYM_MLS_20241219.csv'; // Replace with the CSV file path
const jsonFilePath = './data/data.json'; // Output JSON file

// List of the columns to keep
const selectedColumns = [
  "PropFullStreetAddress",
  "PropCity",
  "PropState",
  "PropZipCode",
  "PropUnitType",
  "PropUnitNumber",
  "LatestSaleRecDate",
  "LatestSalePrice",
  "agt_list_agt_email",
  "agt_list_agt_name",
  "agt_list_agt_phone",
  "agt_list_off_phone",
  "avm_range_high",
  "avm_range_low",
  "mls_dom",
  "mls_list_price",
  "mls_photo_link"
];

// Function to process the CSV file
async function processSingleCSV() {
  try {
    // Check if the CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`CSV file not found: ${csvFilePath}`);
      return;
    }

    // Get the file size for reference
    const stats = fs.statSync(csvFilePath);
    console.log(`Processing file: ${csvFilePath} (${stats.size} bytes)`);

    // Convert CSV to JSON
    const jsonData = await csv().fromFile(csvFilePath);

    if (jsonData.length === 0) {
      console.error('No data found in the CSV file.');
      return;
    }

    // Filter the data to keep only the selected columns and set empty values
    const filteredData = jsonData.map(item => {
      const filteredItem = {};

      selectedColumns.forEach(column => {
        // If the column exists in the row, use it; otherwise, set an empty string or integer
        filteredItem[column] = item[column] === undefined || item[column] === null ? '' : item[column];
      });

      return filteredItem;
    });

    // Save the filtered data to the JSON file
    fs.writeFileSync(jsonFilePath, JSON.stringify(filteredData, null, 2));
    console.log(`Data successfully saved to ${jsonFilePath}`);
  } catch (error) {
    console.error('Error during processing:', error.message);
  }
}

// Run the script
processSingleCSV();
