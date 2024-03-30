document.addEventListener('DOMContentLoaded', function() {
    var loginBtn = document.getElementById('login-btn');
    loginBtn.addEventListener('click', function() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        // Mock API call, replace with your actual API call
        mockAPICall(email, password);
    });
});

// function httpGetAsync(theUrl, callback) {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() {
//         if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//             callback(xmlHttp.responseText);
//         }
//     }
// }

function mockAPICall(email, password) {
    // Mocking a successful response here, replace with your actual API call
    if (email === "s" && password === "p") {
        // Redirect to the dashboard or next page upon successful authentication
        // window.location.href = "../../UI/uploader.html";
        window.location.href = "fileUploadWithImageFlash.html";

    } else {
        // Display error message
        document.getElementById("error-message").innerText = "Invalid email or password.";
    }
}
 