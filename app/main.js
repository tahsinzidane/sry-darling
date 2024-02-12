  document.getElementById("myForm").addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission
            
            let fname = document.getElementById("fname").value;
            for (let x = 0; x <= 100; x++) {
                document.body.insertAdjacentHTML("beforeend", fname + ", " + x + "<br>");
            }
        });
