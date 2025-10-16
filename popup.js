document.addEventListener('DOMContentLoaded', () => {
    console.log("Popup DOM loaded. Initializing...");

    // --- View Elements ---
    const mainView = document.getElementById('mainView');
    const settingsView = document.getElementById('settingsView');
    const addWineForm = document.getElementById('addWineForm');
    const vivinoUrlDisplay = document.getElementById('vivinoUrlDisplay');
    const vintageInput = document.getElementById('vintage');
    const quantityInput = document.getElementById('quantity');
    const costTierSelector = document.getElementById('costTierSelector');
    const statusDiv = document.getElementById('status');
    const submitButton = document.getElementById('submitButton');
    const cancelButton = document.getElementById('cancelButton');
    const settingsButton = document.getElementById('settingsButton');
    const vintageDecrementBtn = document.getElementById('vintageDecrement');
    const vintageIncrementBtn = document.getElementById('vintageIncrement');
    const quantityDecrementBtn = document.getElementById('quantityDecrement');
    const quantityIncrementBtn = document.getElementById('quantityIncrement');
    const settingsForm = document.getElementById('settingsForm');
    const backendHostInput = document.getElementById('backendHost');
    const backendPortInput = document.getElementById('backendPort');
    const backButton = document.getElementById('backButton');

    let selectedCostTier = null;
    let originalVivinoUrl = '';

    // --- Initialization ---
    async function initialize() {
        console.log("initialize() called.");
        try {
            const { backendUrl } = await chrome.storage.local.get(['backendUrl']);
            if (backendUrl) {
                console.log(`Backend URL found: ${backendUrl}`);
                try {
                    const url = new URL(backendUrl);
                    backendHostInput.value = url.hostname;
                    backendPortInput.value = url.port;
                } catch (e) {
                    console.error("Could not parse saved backend URL:", backendUrl);
                }

                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                const currentUrl = tabs.length > 0 ? tabs[0].url : null;
                console.log(`Current tab URL: ${currentUrl}`);

                const isSpecificVivinoWinePage = currentUrl && currentUrl.includes('vivino.com') && /\/w\/\d+/.test(currentUrl);

                if (isSpecificVivinoWinePage) {
                    console.log("On a specific Vivino wine page.");
                    showMainView();
                    addWineForm.classList.remove('hidden');
                    updateConnectionUI('checking'); // Set initial state

                    // --- Form Data Population ---
                    const url = new URL(currentUrl);
                    const yearParam = url.searchParams.get('year');
                    const cleanBaseUrl = `${url.origin}${url.pathname}`;
                    const cleanUrl = new URL(cleanBaseUrl);

                    if (yearParam && /^\d{4}$/.test(yearParam)) {
                        cleanUrl.searchParams.set('year', yearParam);
                    }
                    originalVivinoUrl = cleanUrl.toString();
                    vintageInput.value = (yearParam && /^\d{4}$/.test(yearParam))
                        ? yearParam
                        : new Date().getFullYear() - 3;
                    updateVivinoUrlDisplay();
                    vivinoUrlDisplay.value = originalVivinoUrl;
                    console.log("Form data populated.");

                    // --- Health Check Logic ---
                    (async () => {
                        try {
                            console.log("Starting health check fetch...");
                            const response = await fetch(`${backendUrl}/health`, {
                                method: 'GET',
                                signal: AbortSignal.timeout(3000)
                            });
                            console.log(`Health check response status: ${response.status}`);
                            if (!response.ok) throw new Error(`Backend not healthy, status: ${response.status}`);
                            
                            console.log("Health check SUCCEEDED.");
                            updateConnectionUI('connected');
                        } catch (error) {
                            console.error("Health check FAILED:", error);
                            updateConnectionUI('error');
                        }
                    })();

                } else if (currentUrl && currentUrl.includes('vivino.com')) {
                    console.log("On Vivino site, but not a specific wine page.");
                    showMainView();
                    showStatus('Please navigate to a specific wine\'s page to add it.', 'info');
                    submitButton.disabled = true;
                    addWineForm.classList.add('hidden');
                } else {
                    console.log("Not on a Vivino page.");
                    showMainView();
                    showStatus('Not a Vivino page.', 'error');
                    submitButton.disabled = true;
                    addWineForm.classList.add('hidden');
                }
            } else {
                console.log("Backend URL not set. Showing settings.");
                showSettingsView();
            }
        } catch (e) {
            console.error("Initialization failed:", e);
            showStatus('Error loading extension.', 'error');
        }
    }
    
    // --- Centralized UI Update Function ---
    function updateConnectionUI(state) {
        console.log(`Updating UI for connection state: '${state}'`);
        switch (state) {
            case 'checking':
                submitButton.disabled = true;
                showStatus('Checking connection...', 'info');
                break;
            case 'connected':
                submitButton.disabled = false;
                showStatus('', 'info');
                break;
            case 'error':
                submitButton.disabled = true;
                showStatus('Cannot connect to backend. Are you on the same network?', 'error');
                break;
        }
    }
    
    // --- View Management ---
    function showMainView() {
        mainView.classList.remove('hidden');
        settingsView.classList.add('hidden');
    }

    function showSettingsView() {
        settingsView.classList.remove('hidden');
        mainView.classList.add('hidden');
    }

    // --- Dynamic URL Display ---
    function updateVivinoUrlDisplay() {
        if (!originalVivinoUrl) return;
        try {
            const displayUrl = new URL(originalVivinoUrl);
            displayUrl.searchParams.set('year', vintageInput.value);
            vivinoUrlDisplay.value = displayUrl.toString();
        } catch (e) {
            console.error("Could not update URL", e);
        }
    }

    function showStatus(message, type = 'info', loading = false) {
        statusDiv.textContent = message;
        statusDiv.className = `status-${type}`;
        cancelButton.disabled = loading;

        if (loading) {
            submitButton.disabled = true;
            submitButton.textContent = 'Working...';
        } else {
            submitButton.textContent = 'Add Wine';
        }
    }

    // --- Event Listeners ---
    settingsButton.addEventListener('click', showSettingsView);
    backButton.addEventListener('click', showMainView);

    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const host = backendHostInput.value.trim();
        const port = backendPortInput.value.trim() || '5000';
        if (host) {
            const cleanHost = host.replace(/^https?:\/\//, '');
            const backendUrl = `http://${cleanHost}:${port}`;
            chrome.storage.local.set({ backendUrl: backendUrl }, () => {
                initialize();
            });
        }
    });

    vintageInput.addEventListener('input', updateVivinoUrlDisplay);
    vintageDecrementBtn.addEventListener('click', () => { vintageInput.stepDown(); updateVivinoUrlDisplay(); });
    vintageIncrementBtn.addEventListener('click', () => { vintageInput.stepUp(); updateVivinoUrlDisplay(); });
    quantityDecrementBtn.addEventListener('click', () => { quantityInput.stepDown(); });
    quantityIncrementBtn.addEventListener('click', () => { quantityInput.stepUp(); });
    cancelButton.addEventListener('click', () => { window.close(); });

    costTierSelector.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            const value = e.target.dataset.value;
            const currentSelected = costTierSelector.querySelector('.selected');
            if (currentSelected) {
                currentSelected.classList.remove('selected');
            }
            if (selectedCostTier?.toString() !== value) {
                e.target.classList.add('selected');
                selectedCostTier = parseInt(value, 10);
            } else {
                selectedCostTier = null;
            }
        }
    });

    addWineForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { backendUrl } = await chrome.storage.local.get(['backendUrl']);
        if (!backendUrl) {
            showStatus('Backend URL not set. Go to settings.', 'error');
            return;
        }

        const payload = {
            vivino_url: vivinoUrlDisplay.value,
            quantity: parseInt(quantityInput.value, 10),
            cost_tier: selectedCostTier,
        };

        showStatus('Adding wine...', 'info', true);

        try {
            const response = await fetch(`${backendUrl}/scan-wine`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            showStatus(`${result.wine_name} added!`, 'success');
            setTimeout(() => window.close(), 1500);

        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
            submitButton.disabled = true;
        }
    });

    initialize();
});