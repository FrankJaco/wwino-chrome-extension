// A central function to update the icon's state (color, clickability, tooltip)
async function updateActionIcon(tabId) {
    // We need to get the tab to check its URL.
    // Use a try-catch block in case the tab has been closed while this is running.
    try {
        const tab = await chrome.tabs.get(tabId);
        
        // The URL might not be available for special pages like chrome://extensions
        if (!tab || !tab.url) {
            await disableIcon(tabId, "This page is not supported.");
            return;
        }

        const isVivinoPage = tab.url.includes('vivino.com');
        const { backendUrl } = await chrome.storage.local.get('backendUrl');
        const isBackendConfigured = !!backendUrl;

        // Condition for the icon to be active:
        // 1. The user is on a Vivino page.
        // 2. The backend server address is configured.
        if (isVivinoPage && isBackendConfigured) {
            await enableIcon(tabId);
        } else {
            // Determine the correct reason for being disabled.
            let reason = "Wonderful Wino: Only active on vivino.com";
            if (isVivinoPage && !isBackendConfigured) {
                reason = "Wonderful Wino: Click to configure your backend server.";
            }
            await disableIcon(tabId, reason);
        }
    } catch (error) {
        console.log(`Could not update icon for tab ${tabId}: ${error.message}`);
    }
}

// Helper function to ENABLE the icon (full color, clickable)
async function enableIcon(tabId) {
    await chrome.action.enable(tabId);
    await chrome.action.setTitle({
        tabId: tabId,
        title: 'Wonderful Wino Helper' // Default tooltip
    });
    await chrome.action.setIcon({
        tabId: tabId,
        path: {
            "16": "images/icon16.png",
            "48": "images/icon48.png",
            "128": "images/icon128.png"
        }
    });
}

// Helper function to DISABLE the icon (gray, not clickable)
async function disableIcon(tabId, title) {
    await chrome.action.disable(tabId);
    await chrome.action.setTitle({
        tabId: tabId,
        title: title // Informative tooltip
    });
    // Set the icon to the grayscale versions you created in Step 1.
    await chrome.action.setIcon({
        tabId: tabId,
        path: {
            "16": "images/icon16_disabled.png",
            "48": "images/icon48_disabled.png",
            "128": "images/icon128_disabled.png"
        }
    });
}

// --- Event Listeners ---

// 1. When a tab is switched to (activated)
chrome.tabs.onActivated.addListener(activeInfo => {
    updateActionIcon(activeInfo.tabId);
});

// 2. When a tab's URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // To make the icon update more reliable, we run our check in two key moments:
    //  - When the URL changes (for navigating between pages).
    //  - When the page status is "complete" (for page reloads or complex loads).
    if (changeInfo.url || changeInfo.status === 'complete') {
        // Ensure we only run on actual web pages, not internal chrome:// pages
        if (tab && tab.url && (tab.url.startsWith('http:') || tab.url.startsWith('https://'))) {
            updateActionIcon(tabId);
        }
    }
});

// 3. When backend settings are saved in the popup
chrome.storage.onChanged.addListener((changes, namespace) => {
    // If the backendUrl changes, we need to re-evaluate the currently active tab.
    if (namespace === 'local' && changes.backendUrl) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                updateActionIcon(tabs[0].id);
            }
        });
    }
});

// 4. When the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
    // Go through all open tabs and set the initial icon state.
    chrome.tabs.query({}, (tabs) => {
        for (const tab of tabs) {
            if (tab.id) {
                updateActionIcon(tab.id);
            }
        }
    });
});