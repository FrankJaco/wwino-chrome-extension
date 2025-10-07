// Function to register the rule for showing the icon only on Vivino.
function setDeclarativeRules() {
  
  // 1. Remove any previously registered rules (important for updates/reloads)
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    
    // 2. Define the rule to match Vivino pages
    const vivinoRule = {
      // CONDITIONS: When to show the icon
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {
            hostSuffix: 'vivino.com', // Matches both vivino.com and www.vivino.com
            schemes: ['https']
          }
        })
      ],
      // ACTIONS: What to do when conditions are met
      actions: [
        new chrome.declarativeContent.ShowAction() // This makes the icon visible/active
      ]
    };
    
    // 3. Register the rule
    chrome.declarativeContent.onPageChanged.addRules([vivinoRule]);
    console.log("Declarative rule set for vivino.com");
  });
}


// Event listener: Run the rule registration when the extension is installed or updated.
chrome.runtime.onInstalled.addListener(() => {
  // Hide the icon globally by default
  chrome.action.disable(); 
  
  // Set the rule that will enable/show the icon on Vivino pages
  setDeclarativeRules();
});


/* OPTIONAL: Keep the logic to disable the icon if the backend URL is NOT configured.
  This adds an extra layer of control: the icon is only SHOWN by the declarative
  rule, but this listener can still DISABLE it if settings are missing.
*/

async function checkBackendSetup() {
  const result = await chrome.storage.local.get(['backendUrl']);
  const isSetup = !!result.backendUrl;
  
  if (!isSetup) {
    // If settings are missing, disable the icon globally, overriding the declarative rule.
    // This forces the user to go to settings by clicking the grayed-out icon.
    chrome.action.disable(); 
    console.log("Icon disabled because backend is not configured.");
  }
}

// Check on startup and whenever local storage settings change (e.g., when saving settings)
chrome.runtime.onStartup.addListener(checkBackendSetup);
chrome.storage.onChanged.addListener(checkBackendSetup);
checkBackendSetup();