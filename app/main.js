document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let fname = document.getElementById("fnameInput").value;
    let num = parseInt(document.getElementById("numInput").value);
    let outputDiv = document.getElementById("output");
    if (num <= 0) {
        outputDiv.innerHTML = ""; // Clear the output box if no texts are generated
        // Hide copy button when there is no text
        document.getElementById("copyButton").style.display = "none";
        return;
    }
    outputDiv.innerHTML = "";
    for (let x = 1; x <= num; x++) {
        outputDiv.innerHTML += x + "- " + fname + "<br>";
    }
    // Show copy button if texts are generated
    document.getElementById("copyButton").style.display = "inline-block";
});

document.getElementById("copyButton").addEventListener("click", function() {
    let outputText = document.getElementById("output").innerText;
    if (outputText.trim() === "") return; // Do not copy if the output is empty
    navigator.clipboard.writeText(outputText);
    // Show "Copied!" inside button for 1 second
    let copyButton = document.getElementById("copyButton");
    copyButton.textContent = "Copied!";
    setTimeout(function() {
        copyButton.textContent = "Copy";
    }, 1000);
});
