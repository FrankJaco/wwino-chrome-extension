# Wonderful Wino Helper Chrome Browser Extension

The Wonderful Wino Chrome Browser Extension utilizes the Vivino site to obtain publicly available wine facts (e,g, proper name, varietals, region, etc.)  to make short work of returning from your favorite merchant and getting the wine you purchased entered into your Wonderful Wino Home Assistant Addon’s Inventory. 

![CBE1](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe1.png)
  

## Installing the Wonderful Wino Chrome Browser Extension

Follow these steps to install the Wonderful Wino Extension in your Chrome browser.

#### **Step 1: Download & Unzip the Extension Files**

1. Go to the main page of the GitHub repository (if not already there).

https://github.com/FrankJaco/wwino-chrome-extension.git

3. Click the green **`< > Code`** button, then click **Download ZIP**.

4. Find the downloaded `.zip` file on your computer and extract its contents using the method for your operating system:

   -  **🖥️ Windows:**  **Right-click** the ZIP file and select **Extract All...**.

   -  **🍎 macOS:**  **Double-click** the ZIP file. It will unzip automatically.

   -  **🐧 Linux:**  **Right-click** the ZIP file and select **Extract Here** (this may vary slightly by distribution).

   -  **🤖 ChromeOS/Flex:**  **Double-click** the ZIP file in the _Files_ app. This will open it like a drive. **Copy the folder** inside to a permanent location, like your "My files" directory.

5. After extracting, you will have a folder, likely named `wwino-chrome-extension-main`. Move this folder to a permanent location where you won't delete it (e.g., your Documents folder).

#### **Step 2: Install in Google Chrome**

1. Open the Chrome browser and navigate to the extensions page by typing `chrome://extensions` into your address bar and pressing Enter.

2. In the top-right corner, turn on the **Developer mode** toggle switch.

3. Click the **Load unpacked** button that appears on the top-left.

4. A file selection window will open. Navigate to and select the `wwino-chrome-extension-main` folder you extracted in Step 1.

5. The "Wonderful Wino Helper" extension will now appear on the page.

6. Click the puzzle piece icon (🧩) in your toolbar and pin📌the Wonderful Wino Helper to the toolbar.

The extension is now installed!

## Wonderful Wino Chrome Extension Configuration

*Before you can use the extension, you need to provide the IP address of your Home Assistant.*

**On first launch the settings window will pop up automatically.**

![CBE2](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe2.png)

**Enter the IP address of your Home Assistant Instance where the Wonderful Wino Add-on is installed. Leave Port at 5000.**

**Important:** You must be on the same LAN as your Home Assistant which is running the Wonderful Wino Add-on **to use** the Wonderful Wino Chrome Browser Extension.

**Note the highlighted message at the bottom of the Extension**

![CBE3](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe3.png)

**This error message will occur if you entered an incorrect IP address for your Home Assistant during initial setup.** (The error would also occur when if you are trying to use the Extension off of your Home Assistant/Wonderful Wino Add-on LAN.)

**To Correct** (or update) **the Home Assistant IP address...**

1. Click the **Gear**⚙️ in the upper-right corner of the Extension

2. Enter the corrected/updated IP Address

3.  **Save & Close**

## Using the Wonderful Wino Chrome Extension

