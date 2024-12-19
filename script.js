// Load saved settings and bookmarks
function loadSettings() {
    chrome.storage.sync.get({
        backgroundColor: '#f0f8ff',
        textColor: '#333333',
        backgroundImage: '',
        customMessage: '',
        bookmarks: []
    }, function(items) {
        document.body.style.backgroundColor = items.backgroundColor;
        document.getElementById('message').style.color = items.textColor;
        if (items.backgroundImage) {
            document.body.style.backgroundImage = `url(${items.backgroundImage})`;
        }
        if (items.customMessage) {
            document.getElementById('message').textContent = items.customMessage;
        } else {
            document.getElementById('message').textContent = getRandomMessage();
        }
        renderBookmarks(items.bookmarks);
    });
}

function generateColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate pastel colors
    const h = hash % 360;
    return `hsl(${h}, 70%, 65%)`; 
}

function renderBookmarks(bookmarks) {
    const container = document.getElementById('bookmarks');
    container.innerHTML = '';
    
    if (bookmarks.length === 0) {
        const noBookmarks = document.createElement('div');
        noBookmarks.className = 'no-bookmarks';
        noBookmarks.textContent = 'Add bookmarks from the extension options';
        // container.appendChild(noBookmarks);
        return;
    }
    
    bookmarks.forEach(bookmark => {
        const link = document.createElement('a');
        link.href = bookmark.url;
        link.className = 'bookmark';
        link.title = `${bookmark.title} - ${bookmark.url}`;
        
        const icon = document.createElement('div');
        icon.className = 'bookmark-icon';
        icon.style.backgroundColor = generateColor(bookmark.title);
        icon.textContent = bookmark.title.charAt(0).toUpperCase();
        
        const title = document.createElement('div');
        title.className = 'bookmark-title';
        title.textContent = bookmark.title;
        
        link.appendChild(icon);
        link.appendChild(title);
        container.appendChild(link);
    });
}

const messages = [
    "What would you like to see?"
];

function getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}


// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
});