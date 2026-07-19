const notificationContainer = document.getElementById("notification-container");

// Temporary notification data.
// Later this can come from backend/database.
const notifications = [
    {
        id: 1,
        sender: "Alice",
        fileName: "project-report.pdf"
    },
    {
        id: 2,
        sender: "Bob",
        fileName: "presentation.pptx"
    },
    {
        id: 3,
        sender: "Charlie",
        fileName: "notes.txt"
    }
];

function displayNotifications(notificationList) {
    if (!notificationContainer) {
        console.error("Could not find #notification-container");
        return;
    }

    notificationContainer.innerHTML = "";

    notificationList.forEach(notification => {
        const notificationCard = createNotificationCard(notification);
        notificationContainer.appendChild(notificationCard);
    });
}

function createNotificationCard(notification) {
    const card = document.createElement("div");
    card.className = "notification-card";
    card.dataset.notificationId = notification.id;

    const message = document.createElement("p");
    message.innerHTML = `<strong>${notification.sender}</strong> is sharing <strong>${notification.fileName}</strong>`;

    const acceptButton = document.createElement("button");
    acceptButton.className = "notification-card-accept-button";
    acceptButton.textContent = "Accept";

    acceptButton.addEventListener("click", function () {
        acceptNotification(notification);
        removeNotification(notification.id, card);
    });

    const denyButton = document.createElement("button");
    denyButton.className = "notification-card-deny-button";
    denyButton.textContent = "Deny";

    denyButton.addEventListener("click", function () {
        denyNotification(notification);
        removeNotification(notification.id, card);
    });

    card.appendChild(message);
    card.appendChild(acceptButton);
    card.appendChild(denyButton);

    return card;
}

function removeNotification(notificationId, notificationCard) {
    // Remove from page
    notificationCard.remove();

    // Remove from array
    const index = notifications.findIndex(
        notification => notification.id === notificationId
    );

    if (index !== -1) {
        notifications.splice(index, 1);
    }
}

function acceptNotification(notification) {
    console.log(
        `Accepted "${notification.fileName}" from ${notification.sender}`
    );

    /*
    Backend functionality goes here later.

    Example:

    fetch(`/api/notifications/${notification.id}/accept`, {
        method: "POST"
    });
    */
}

function denyNotification(notification) {
    console.log(
        `Denied "${notification.fileName}" from ${notification.sender}`
    );

    /*
    Backend functionality goes here later.

    Example:

    fetch(`/api/notifications/${notification.id}/deny`, {
        method: "POST"
    });
    */
}

// Call once when the page loads
displayNotifications(notifications);