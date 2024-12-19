let bookmarks = [];

// Saves options to chrome.storage.sync
function saveOptions() {
    const bgColor = document.getElementById('bgColor').value;
    const textColor = document.getElementById('textColor').value;
    const bgImage = document.getElementById('bgImage').value;
    const customMessage = document.getElementById('customMessage').value;

    chrome.storage.sync.set({
        backgroundColor: bgColor,
        textColor: textColor,
        backgroundImage: bgImage,
        customMessage: customMessage,
        bookmarks: bookmarks
    }, function() {
        // Update status to let user know options were saved
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        status.className = 'status success';
        status.style.display = 'block';
        setTimeout(function() {
            status.style.display = 'none';
        }, 2000);
    });
}

function addBookmark() {
    const title = document.getElementById('bookmarkTitle').value.trim();
    const url = document.getElementById('bookmarkUrl').value.trim();
    
    if (title && url) {
        // Add http:// if no protocol is specified
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        
        bookmarks.push({ title, url: formattedUrl });
        renderBookmarks();
        
        // Clear input fields
        document.getElementById('bookmarkTitle').value = '';
        document.getElementById('bookmarkUrl').value = '';
        
        // Save immediately
        saveOptions();
    }
}

function removeBookmark(index) {
    bookmarks.splice(index, 1);
    renderBookmarks();
    saveOptions();
}

function renderBookmarks() {
    const container = document.getElementById('bookmarkList');
    container.innerHTML = '';
    
    bookmarks.forEach((bookmark, index) => {
        const div = document.createElement('div');
        div.className = 'bookmark-item';
        
        const text = document.createElement('span');
        text.textContent = `${bookmark.title} (${bookmark.url})`;
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeBookmark(index);
        
        div.appendChild(text);
        div.appendChild(removeButton);
        container.appendChild(div);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get({
        backgroundColor: '#f0f8ff',
        textColor: '#333333',
        backgroundImage: '',
        customMessage: '',
        bookmarks: []
    }, function(items) {
        document.getElementById('bgColor').value = items.backgroundColor;
        document.getElementById('textColor').value = items.textColor;
        document.getElementById('bgImage').value = items.backgroundImage;
        document.getElementById('customMessage').value = items.customMessage;
        bookmarks = items.bookmarks;
        renderBookmarks();
    });
}

document.getElementById('removeBgImage').addEventListener('click', function() {
    document.getElementById('bgImage').value = '';
});

document.getElementById('addBookmark').addEventListener('click', addBookmark);
document.getElementById('save').addEventListener('click', saveOptions);
document.addEventListener('DOMContentLoaded', restoreOptions);