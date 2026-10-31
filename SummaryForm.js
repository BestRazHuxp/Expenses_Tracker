const summaryPeriod = document.getElementById("summary-period");
const summaryDate = document.getElementById("summary-date");
const summaryDateLabel = document.getElementById("summary-date-label");

function updateSummaryInput() {
    // Clear the previous value because each period uses a different format.
    summaryDate.value = "";
    summaryDate.removeAttribute("min");
    summaryDate.removeAttribute("max");
    summaryDate.removeAttribute("step");
    summaryDate.removeAttribute("placeholder");

    if (summaryPeriod.value === "year") {
        summaryDate.type = "number";
        summaryDate.min = "1";
        summaryDate.max = "9999";
        summaryDate.step = "1";
        summaryDate.placeholder = "YYYY";
        summaryDateLabel.textContent = "Year";
    } else {
        summaryDate.type = summaryPeriod.value === "month" ? "month" : "date";
        summaryDateLabel.textContent = summaryPeriod.value === "month" ? "Month" : "Date";
    }
}

summaryPeriod.addEventListener("change", updateSummaryInput);
updateSummaryInput();
