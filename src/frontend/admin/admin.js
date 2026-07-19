const adminPageLogoutButton = document.getElementById("admin-logout");

adminPageLogoutButton.addEventListener("click", function(){
    alert("button clicked");
    window.location.href = "../homePage.html";
});

const bar = document.getElementById('myBar');
// Update value dynamically
bar.value = 75; // Bar fills to 75%


const users = [
    {
        id: 1,
        name: "Dyllan Cummings",
        email: "dyllan@example.com",
        role: "User",
        status: "active",
        files: [
            {
                name: "project-report.pdf",
                type: "PDF",
                url: "./files/project-report.pdf"
            },
            {
                name: "network-diagram.png",
                type: "Image",
                url: "./files/network-diagram.png"
            }
        ]
    },
    {
        id: 2,
        name: "Alex Johnson",
        email: "alex@example.com",
        role: "User",
        status: "inactive",
        files: [
            {
                name: "notes.txt",
                type: "Text file",
                url: "./files/notes.txt"
            }
        ]
    },
    {
        id: 3,
        name: "Sarah Smith",
        email: "sarah@example.com",
        role: "Administrator",
        status: "active",
        files: []
    }
];

const userTableBody = document.getElementById("user-table-body");
const userSearch = document.getElementById("user-search");
const noUsersMessage = document.getElementById("no-users-message");

const userPopup = document.getElementById("user-popup");
const closeUserPopupButton = document.getElementById(
    "close-user-popup"
);

const popupUserAvatar = document.getElementById(
    "popup-user-avatar"
);

const popupUserName = document.getElementById("popup-user-name");
const popupUserEmail = document.getElementById("popup-user-email");
const popupUserRole = document.getElementById("popup-user-role");
const popupUserStatus = document.getElementById(
    "popup-user-status"
);

const popupUserFileCount = document.getElementById(
    "popup-user-file-count"
);

const popupUserFiles = document.getElementById(
    "popup-user-files"
);

const noFilesMessage = document.getElementById(
    "no-files-message"
);

const toggleUserStatusButton = document.getElementById(
    "toggle-user-status"
);

const deleteUserButton = document.getElementById(
    "delete-user-button"
);

let selectedUserId = null;

function getUserInitials(name) {
    return name
        .split(" ")
        .map(function (word) {
            return word.charAt(0);
        })
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function displayUsers(userList) {
    userTableBody.innerHTML = "";

    if (userList.length === 0) {
        noUsersMessage.style.display = "block";
        return;
    }

    noUsersMessage.style.display = "none";

    userList.forEach(function (user) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="user-information">
                    <div class="user-avatar">
                        ${getUserInitials(user.name)}
                    </div>

                    <div class="user-information-text">
                        <strong>${user.name}</strong>
                        <span>${user.email}</span>
                    </div>
                </div>
            </td>

            <td>${user.role}</td>

            <td>
                <span class="status-badge ${user.status}">
                    ${
                        user.status === "active"
                            ? "Active"
                            : "Inactive"
                    }
                </span>
            </td>

            <td>${user.files.length}</td>

            <td>
                <button
                    type="button"
                    class="view-user-button"
                    data-user-id="${user.id}"
                >
                    Manage
                </button>
            </td>
        `;

        userTableBody.appendChild(row);
    });
}

function openUserPopup(userId) {
    const user = users.find(function (currentUser) {
        return currentUser.id === userId;
    });

    if (!user) {
        return;
    }

    selectedUserId = user.id;

    popupUserAvatar.textContent = getUserInitials(user.name);
    popupUserName.textContent = user.name;
    popupUserEmail.textContent = user.email;
    popupUserRole.textContent = user.role;

    popupUserStatus.textContent =
        user.status === "active" ? "Active" : "Inactive";

    popupUserFileCount.textContent = user.files.length;

    displayUserFiles(user.files);
    updateStatusButton(user);

    userPopup.classList.add("active");
}

function closeUserPopup() {
    userPopup.classList.remove("active");
    selectedUserId = null;
}

function displayUserFiles(files) {
    popupUserFiles.innerHTML = "";

    if (files.length === 0) {
        noFilesMessage.style.display = "block";
        return;
    }

    noFilesMessage.style.display = "none";

    files.forEach(function (file) {
        const fileItem = document.createElement("li");
        fileItem.className = "user-file-item";

        fileItem.innerHTML = `
            <div class="user-file-information">
                <strong>${file.name}</strong>
                <span>${file.type}</span>
            </div>

            <button
                type="button"
                class="delete-file-button"
                data-file-name="${file.name}"
            >
                Delete
            </button>
        `;

        popupUserFiles.appendChild(fileItem);
    });
}

function updateStatusButton(user) {
    if (user.status === "active") {
        toggleUserStatusButton.textContent = "Deactivate Account";
        toggleUserStatusButton.classList.remove("activate");
    } else {
        toggleUserStatusButton.textContent = "Activate Account";
        toggleUserStatusButton.classList.add("activate");
    }
}

userSearch.addEventListener("input", function () {
    const searchText = userSearch.value.trim().toLowerCase();

    const filteredUsers = users.filter(function (user) {
        return (
            user.name.toLowerCase().includes(searchText) ||
            user.email.toLowerCase().includes(searchText) ||
            user.role.toLowerCase().includes(searchText) ||
            user.status.toLowerCase().includes(searchText)
        );
    });

    displayUsers(filteredUsers);
});

userTableBody.addEventListener("click", function (event) {
    const manageButton = event.target.closest(".view-user-button");

    if (!manageButton) {
        return;
    }

    const userId = Number(manageButton.dataset.userId);
    openUserPopup(userId);
});

popupUserFiles.addEventListener("click", function (event) {

    const deleteButton = event.target.closest(".delete-file-button");

    if (!deleteButton) return;

    const user = users.find(user => user.id === selectedUserId);

    if (!user) return;

    const fileName = deleteButton.dataset.fileName;

    const confirmed = confirm(
        `Delete "${fileName}"?`
    );

    if (!confirmed) return;

    user.files = user.files.filter(file => file.name !== fileName);

    popupUserFileCount.textContent = user.files.length;

    displayUserFiles(user.files);

    displayUsers(users);
});

toggleUserStatusButton.addEventListener("click", function () {
    const user = users.find(function (currentUser) {
        return currentUser.id === selectedUserId;
    });

    if (!user) {
        return;
    }

    const wasActive = user.status === "active";

    user.status = wasActive ? "inactive" : "active";

    popupUserStatus.textContent =
        user.status === "active" ? "Active" : "Inactive";

    updateStatusButton(user);

    if (wasActive) {
        addActivity(
            "deactivated",
            "Account deactivated",
            `${user.name}'s account was deactivated by an administrator.`
        );
    } else {
        addActivity(
            "activated",
            "Account activated",
            `${user.name}'s account was activated by an administrator.`
        );
    }

    const searchText = userSearch.value.trim().toLowerCase();

    const filteredUsers = users.filter(function (currentUser) {
        return (
            currentUser.name.toLowerCase().includes(searchText) ||
            currentUser.email.toLowerCase().includes(searchText) ||
            currentUser.role.toLowerCase().includes(searchText) ||
            currentUser.status.toLowerCase().includes(searchText)
        );
    });

    displayUsers(filteredUsers);
});

deleteUserButton.addEventListener("click", function () {
    const user = users.find(function (currentUser) {
        return currentUser.id === selectedUserId;
    });

    if (!user) {
        return;
    }

    const deleteConfirmed = confirm(
        `Are you sure you want to delete ${user.name}'s account?`
    );

    if (!deleteConfirmed) {
        return;
    }

    const deletedUserName = user.name;

    const userIndex = users.findIndex(function (currentUser) {
        return currentUser.id === selectedUserId;
    });

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
    }

    addActivity(
        "user-deleted",
        "Account deleted",
        `${deletedUserName}'s account was deleted by an administrator.`
    );

    closeUserPopup();

    const searchText = userSearch.value.trim().toLowerCase();

    const filteredUsers = users.filter(function (currentUser) {
        return (
            currentUser.name.toLowerCase().includes(searchText) ||
            currentUser.email.toLowerCase().includes(searchText) ||
            currentUser.role.toLowerCase().includes(searchText) ||
            currentUser.status.toLowerCase().includes(searchText)
        );
    });

    displayUsers(filteredUsers);
});

displayUsers(users);


// Activity Log Section ------------------------------------------------------------------
const activityLogList = document.getElementById(
    "activity-log-list"
);

const activityFilter = document.getElementById(
    "activity-filter"
);

const clearActivityLogButton = document.getElementById(
    "clear-activity-log"
);

const noActivityMessage = document.getElementById(
    "no-activity-message"
);

let activityLog = [
    {
        id: 1,
        type: "registered",
        title: "User registered",
        description: "Alex Johnson created an account.",
        timestamp: new Date("2026-07-19T09:30:00")
    },
    {
        id: 2,
        type: "file-added",
        title: "File uploaded",
        description: "Dyllan Cummings uploaded project-report.pdf.",
        timestamp: new Date("2026-07-19T10:15:00")
    },
    {
        id: 3,
        type: "file-shared",
        title: "File shared",
        description:
            "Dyllan Cummings shared project-report.pdf with Alex Johnson.",
        timestamp: new Date("2026-07-19T10:25:00")
    }
];

function getActivityIcon(type) {
    const icons = {
        registered: "＋",
        "file-added": "↑",
        "file-shared": "⇄",
        "file-deleted": "×",
        activated: "✓",
        deactivated: "!",
        "user-deleted": "×"
    };

    return icons[type] || "•";
}

function formatActivityTime(timestamp) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(new Date(timestamp));
}

function displayActivityLog(filterType = "all") {
    activityLogList.innerHTML = "";

    const filteredActivities = activityLog.filter(function (activity) {
        return (
            filterType === "all" ||
            activity.type === filterType
        );
    });

    if (filteredActivities.length === 0) {
        noActivityMessage.style.display = "block";
        return;
    }

    noActivityMessage.style.display = "none";

    const newestFirst = [...filteredActivities].sort(function (a, b) {
        return new Date(b.timestamp) - new Date(a.timestamp);
    });

    newestFirst.forEach(function (activity) {
        const logItem = document.createElement("li");

        logItem.className =
            `activity-log-item ${activity.type}`;

        logItem.innerHTML = `
            <div class="activity-log-icon">
                ${getActivityIcon(activity.type)}
            </div>

            <div class="activity-log-content">
                <strong>${activity.title}</strong>
                <p>${activity.description}</p>
            </div>

            <time class="activity-log-time">
                ${formatActivityTime(activity.timestamp)}
            </time>
        `;

        activityLogList.appendChild(logItem);
    });
}

function addActivity(type, title, description) {
    const activity = {
        id: Date.now(),
        type: type,
        title: title,
        description: description,
        timestamp: new Date()
    };

    activityLog.push(activity);

    displayActivityLog(activityFilter.value);
}

activityFilter.addEventListener("change", function () {
    displayActivityLog(activityFilter.value);
});

clearActivityLogButton.addEventListener("click", function () {
    const confirmed = confirm(
        "Are you sure you want to clear the activity log?"
    );

    if (!confirmed) {
        return;
    }

    activityLog = [];
    displayActivityLog(activityFilter.value);
});

displayActivityLog();

