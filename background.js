// Function to update the extension icon's state
async function updateIconState() {
  // Check if backend settings are configured
  const result = await chrome.storage.local.get(['backendUrl']);
  const isSetup = !!result.backendUrl;

  // Query the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isVivinoPage = tab?.url?.includes('vivino.com');

  if (isSetup && !isVivinoPage) {
    // If settings are configured but it's not a Vivino page, disable the icon.
    chrome.action.disable(tab.id);
  } else {
    // If settings are not configured or it is a Vivino page, enable the icon.
    chrome.action.enable(tab.id);
  }
}

// Add listeners to detect tab changes
chrome.tabs.onUpdated.addListener(updateIconState);
chrome.tabs.onActivated.addListener(updateIconState);

// Run the check on startup
updateIconState();