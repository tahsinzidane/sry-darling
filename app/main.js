document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let fname = document.getElementById("fnameInput").value;
    let num = parseInt(document.getElementById("numInput").value);
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML = "";
    for (let x = 1; x <= num; x++) {
        outputDiv.innerHTML += x + "- " + fname + "<br>";
    }
    // Show copy button if texts are generated
    if (num > 0) {
        document.getElementById("copyButton").style.display = "inline-block";
    } else {
        document.getElementById("copyButton").style.display = "none";
    }
});

document.getElementById("copyButton").addEventListener("click", function() {
    let outputText = document.getElementById("output").innerText;
    navigator.clipboard.writeText(outputText);
    alert("Text copied to clipboard!");
});
