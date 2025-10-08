# Wonderful Wino Chrome Browser Extension

The Wonderful Wino Chrome Browser Extension utilizes the Vivino site to obtain publicly available wine facts (e,g, proper name, varietals, region, etc.)  to make short work of returning from your favorite merchant and getting the wine you just purchased entered into your Wonderful Wino Home Assistant Addon’s Inventory. 

![CBE1](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe1.png)
  

## Installing the Wonderful Wino Chrome Browser Extension


Follow these steps to install the Wonderful Wino Extension in your Chrome browser.

#### **Step 1: Download & Unzip the Extension Files**

1. Go to the main page of the GitHub repository (if not already there).

https://github.com/FrankJaco/wwino-chrome-extension.git

2. Click the green **`< > Code`** button, then click **Download ZIP**.

3. Find the downloaded `.zip` file on your computer and extract its contents using the method for your operating system:

   -  **🖥️ Windows:**  **Right-click** the ZIP file and select **Extract All...**.

   -  **🍎 macOS:**  **Double-click** the ZIP file. It will unzip automatically.

   -  **🐧 Linux:**  **Right-click** the ZIP file and select **Extract Here** (this may vary slightly by distribution).

   -  **🤖 ChromeOS/Flex:**  **Double-click** the ZIP file in the _Files_ app. This will open it like a drive. **Copy the folder** inside to a permanent location, like your "My files" directory.

4. After extracting, you will have a folder, likely named `wwino-chrome-extension-main`. Move this folder to a permanent location where you won't delete it (e.g., your Documents folder).

#### **Step 2: Install in Google Chrome**

1. Open the Chrome browser and navigate to the extensions page by typing `chrome://extensions` into your address bar and pressing Enter.

2. In the top-right corner, turn on the **Developer Mode** toggle switch.

3. Click the **Load Unpacked** button that appears on the top-left.

4. A file selection window will open. Navigate to and select the `wwino-chrome-extension-main` folder you extracted in Step 1.

5. The "Wonderful Wino Helper" extension will now appear on the page.

6. Click the **puzzle** piece icon (🧩) in your toolbar and **pin**📌the Wonderful Wino Helper to the toolbar.

The extension is now installed!

## Wonderful Wino Chrome Extension Configuration

*Before you can use the extension, you will need the IP address of your Home Assistant system in which the Wonderful Wino Add-on is installed.* 

**On first launch of the extension the settings window will pop up automatically.**

![CBE2](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe2.png)

**Enter the IP address of your Home Assistant instance where the Wonderful Wino Add-on is installed. Leave Port at 5000.**

**Important:** You must be on the same LAN as your Home Assistant which is running the Wonderful Wino Add-on to use the Wonderful Wino Chrome Browser Extension.

***Note the highlighted error message at the bottom of the Extension***

![CBE3](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe3.png)

**If you see this error, it is likely for one of these reasons...**
 - You entered the wrong IP address for your Home Assistant
 - The Wonderful Wino Add-on is not running
 - You are not currently on the same LAN as your Home Assistant

**To correct** (or update) **the Home Assistant IP address...**

1. Click the **Gear**⚙️ in the upper-right corner of the Extension
2. Enter the corrected/updated IP Address
3.  **Save & Close**

## Using the Wonderful Wino Chrome Extension

**Use your Chrome Browser to search the Vivino website directly or the Wonderful Wino Addon's GUI for the wine/vintage that you want to add to your Inventory.**

![CBE4](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe4.png)

**- OR - Via the Wonderful Wino Add-on's GUI**

![CBE5](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe5.png)

**Either method will open on a page on the Vivino site displaying the results. If by chance the search yielded more than one result, ensure you select your wine before proceeding.**



**Click the Wonderful Wino Browser Extension icon** ![CBE6](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe6.png)

***In the Wonderful Wino Chrome Extension...***
![CBE7](https://raw.githubusercontent.com/FrankJaco/wwino-chrome-extension/main/resources/cbe7.png)

 1. Verify (or change) the **Vintage**
 2. Verify (or change) the **Quantity**
 3. Select the **Cost Tier** if desired
 4. Click **Add Wine**

Move onto you next wine, or better yet open a bottle.

Cheers!
