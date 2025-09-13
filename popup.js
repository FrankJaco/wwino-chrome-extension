document.addEventListener('DOMContentLoaded', () => {
    // --- View Elements ---
    const mainView = document.getElementById('mainView');
    const settingsView = document.getElementById('settingsView');

    // --- Main View Form Elements ---
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
    
    // --- Settings View Form Elements ---
    const settingsForm = document.getElementById('settingsForm');
    const backendHostInput = document.getElementById('backendHost');
    const backendPortInput = document.getElementById('backendPort');
    const backButton = document.getElementById('backButton');

    let selectedCostTier = null;
    let originalVivinoUrl = '';

    // --- Initialization ---
    async function initialize() {
    try {
        const result = await chrome.storage.local.get(['backendUrl']);
        if (result.backendUrl) {
            try {
                const url = new URL(result.backendUrl);
                backendHostInput.value = url.hostname;
                backendPortInput.value = url.port;
            } catch (e) {
                console.error("Could not parse saved backend URL:", result.backendUrl);
            }

            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            const currentUrl = tabs.length > 0 ? tabs[0].url : null;

            // Use a more robust check with a regular expression for /w/ followed by a number
            const isSpecificVivinoWinePage = currentUrl && currentUrl.includes('vivino.com') && /\/w\/\d+/.test(currentUrl);

            if (isSpecificVivinoWinePage) {
                showMainView();
                originalVivinoUrl = currentUrl;
                const url = new URL(originalVivinoUrl);
                const yearParam = url.searchParams.get('year');

                vintageInput.value = (yearParam && /^\d{4}$/.test(yearParam))
                    ? yearParam
                    : new Date().getFullYear() - 3;

                updateVivinoUrlDisplay();
                submitButton.disabled = false;
                addWineForm.classList.remove('hidden'); // Ensure form is visible
                vivinoUrlDisplay.value = originalVivinoUrl;
            } else if (currentUrl && currentUrl.includes('vivino.com')) {
                // It's a general Vivino page, not a specific wine page
                showMainView();
                showStatus('Please navigate to a specific wine\'s page to add it.', 'info');
                submitButton.disabled = true;
                addWineForm.classList.add('hidden'); // Hide the form fields
            } else {
                // Not a Vivino page at all
                showMainView();
                showStatus('Not a Vivino page.', 'error');
                submitButton.disabled = true;
                addWineForm.classList.add('hidden'); // Hide the form fields
            }

        } else {
            showSettingsView();
        }
    } catch (e) {
        console.error("Initialization failed:", e);
        showStatus('Error loading extension.', 'error');
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
            const url = new URL(originalVivinoUrl);
            url.searchParams.set('year', vintageInput.value);
            vivinoUrlDisplay.value = url.toString();
        } catch (e) {
            console.error("Could not update URL", e);
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

        const vivinoUrl = vivinoUrlDisplay.value;
        if (!vivinoUrl.includes('vivino.com')) {
            showStatus('This is not a Vivino page.', 'error');
            return;
        }

        const payload = {
            vivino_url: vivinoUrl,
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
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Wine';
        }
    });

    function showStatus(message, type = 'info', loading = false) {
        statusDiv.textContent = message;
        statusDiv.className = `status-${type}`; // Use classes for styling
        submitButton.disabled = loading;
        cancelButton.disabled = loading;
        if (loading) submitButton.textContent = 'Working...';
    }

    // --- Run Initialization ---
    initialize();
});
