const userPageLogoutButton = document.getElementById("user-logout");

userPageLogoutButton.addEventListener("click", function(){
    alert("button clicked");
    userPageLogoutButton.addEventListener("click", async function(){
    await fetch("http://localhost:5000/api/user/logout", {
        method: "POST",
        credentials: "include"
    });

    window.location.href = "./index.html";
    });
});

        // const fileInput = document.getElementById('file-input');
        // const uploadBtn = document.getElementById('file-upload-button');
        // const linkContainer = document.getElementById('my-files');

        // uploadBtn.addEventListener('click', function() {
        //     // Check if a file is actually selected
        //     if (fileInput.files.length === 0) {
        //         alert('Please select a file first.');
        //         return;
        //     }

        //     const file = fileInput.files[0];
            
        //     // Create a temporary, local URL representing the file
        //     const fileURL = URL.createObjectURL(file);

        //     // Clear out the placeholder text inside the container
        //     // linkContainer.innerHTML = '';

        //     // Create a new anchor (<a>) tag dynamically

        //     const listItem = document.createElement('li');
        //     const downloadLink = document.createElement('a');
        //     downloadLink.href = fileURL;
        //     downloadLink.download = file.name; // Tells browser to download instead of open
        //     downloadLink.className = 'download-link';
        //     downloadLink.textContent = `${file.name}`;

        //     // Append the link inside the download container
        //     listItem.appendChild(downloadLink);
        //     linkContainer.appendChild(listItem);
        // });
let selectedFile = null;

const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("file-upload-button");
const fileContainer = document.getElementById("my-files");

const filePopup = document.getElementById("file-popup");
const popupFileName = document.getElementById("popup-file-name");
const previewButton = document.getElementById("preview-file-button");
const closePopupButton = document.getElementById("close-popup");
const deleteButton = document.getElementById("delete-file-button");

const accessList = document.getElementById("access-list");
const shareSearchInput = document.getElementById("share-search-input");
const shareButton = document.getElementById("share-button");

uploadBtn.addEventListener("click", function () {
    if (fileInput.files.length === 0) {
        alert("Please select a file first.");
        return;
    }

    const file = fileInput.files[0];
    const fileURL = URL.createObjectURL(file);

    const listItem = document.createElement("li");
    const fileButton = document.createElement("button");

    fileButton.type = "button";
    fileButton.className = "file-button";
    fileButton.textContent = file.name;

    const fileData = {
    name: file.name,
    url: fileURL,
    listItem: listItem,
    access: [
        {
            name: "You",
            removable: false
        },
        {
            name: "Alex Johnson",
            removable: true
        },
        {
            name: "Taylor Smith",
            removable: true
        }
    ]
};

fileButton.addEventListener("click", function () {
    selectedFile = fileData;

    popupFileName.textContent = selectedFile.name;
    shareSearchInput.value = "";

    displayAccessList();

    filePopup.classList.add("active");
});

    listItem.appendChild(fileButton);
    fileContainer.appendChild(listItem);

    

    fileInput.value = "";
});

previewButton.addEventListener("click", function () {
    if (!selectedFile) {
        return;
    }

    window.open(selectedFile.url, "_blank");
});

deleteButton.addEventListener("click", function () {
    if (!selectedFile) {
        return;
    }

    selectedFile.listItem.remove();
    URL.revokeObjectURL(selectedFile.url);

    selectedFile = null;

    filePopup.classList.remove("active");
});

closePopupButton.addEventListener("click", function () {
    filePopup.classList.remove("active");
});

filePopup.addEventListener("click", function (event) {
    if (event.target === filePopup) {
        filePopup.classList.remove("active");
    }
});

function displayAccessList() {
    accessList.innerHTML = "";

    if (!selectedFile) {
        return;
    }

    selectedFile.access.forEach(function (person, index) {
        const accessItem = document.createElement("li");
        const personName = document.createElement("span");

        accessItem.className = "access-item";
        personName.className = "access-name";
        personName.textContent = person.name;

        accessItem.appendChild(personName);

        if (person.removable) {
            const removeButton = document.createElement("button");

            removeButton.type = "button";
            removeButton.className = "remove-access-button";
            removeButton.textContent = "Remove Access";

            removeButton.addEventListener("click", function () {
                selectedFile.access.splice(index, 1);
                displayAccessList();
            });

            accessItem.appendChild(removeButton);
        } else {
            const ownerLabel = document.createElement("span");

            ownerLabel.className = "owner-label";
            ownerLabel.textContent = "Owner";

            accessItem.appendChild(ownerLabel);
        }

        accessList.appendChild(accessItem);
    });
}

shareButton.addEventListener("click", function () {
    if (!selectedFile) {
        return;
    }

    const userName = shareSearchInput.value.trim();

    if (userName === "") {
        alert("Enter a user name.");
        return;
    }

    const alreadyHasAccess = selectedFile.access.some(function (person) {
        return person.name.toLowerCase() === userName.toLowerCase();
    });

    if (alreadyHasAccess) {
        alert("This user already has access.");
        return;
    }

    selectedFile.access.push({
        name: userName,
        removable: true
    });

    shareSearchInput.value = "";
    displayAccessList();
});

async function checkAuth() {
    try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            alert("Not logged in");
            window.location.href = "index.html";
            return;
        }

        console.log("Logged in user:", data);

    } catch (err) {
        console.log(err);
    }
}

checkAuth();