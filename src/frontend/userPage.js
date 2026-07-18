const userPageLogoutButton = document.getElementById("user-logout");

userPageLogoutButton.addEventListener("click", function(){
    alert("button clicked");
    window.location.href = "./homePage.html";
});

        const fileInput = document.getElementById('file-input');
        const uploadBtn = document.getElementById('file-upload-button');
        const linkContainer = document.getElementById('my-files');

        uploadBtn.addEventListener('click', function() {
            // Check if a file is actually selected
            if (fileInput.files.length === 0) {
                alert('Please select a file first.');
                return;
            }

            const file = fileInput.files[0];
            
            // Create a temporary, local URL representing the file
            const fileURL = URL.createObjectURL(file);

            // Clear out the placeholder text inside the container
            // linkContainer.innerHTML = '';

            // Create a new anchor (<a>) tag dynamically

            const listItem = document.createElement('li');
            const downloadLink = document.createElement('a');
            downloadLink.href = fileURL;
            downloadLink.download = file.name; // Tells browser to download instead of open
            downloadLink.className = 'download-link';
            downloadLink.textContent = `${file.name}`;

            // Append the link inside the download container
            listItem.appendChild(downloadLink);
            linkContainer.appendChild(listItem);
        });

