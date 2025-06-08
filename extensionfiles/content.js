//mutation observer - whenever the composer is loaded 
//mutation observer - url updates involving composer 

console.log("MailBot - Content Script Loaded");


function createAIButton() {
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.innerHTML = 'AI Reply';
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    return button;
}

function getEmailContent() {
    // try to find the compose toolbar 
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];
    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            console.log(`Toolbar found using selector: ${selector}`);
            return content.innerText.trim();
        }
        return '';
    }
}
function findComposeToolbar() {
    // try to find the compose toolbar 
    const selectors = [
        '.btC',
        '.aDh',
        '[role="toolbar"]',
        '.gU.Up'
    ];
    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            console.log(`Toolbar found using selector: ${selector}`);
            return toolbar;
        }
        return null;
    }
}

function injectButton() {
    // check if the button already exists
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();

    if (!toolbar) {
        console.log("Toolbar not found");
        return;
    }
    console.log("Toolbar found, injecting button");
    const button = createAIButton();
    button.classList.add('ai-reply-button');
    button.addEventListener('click', async() => {
        try {
            button.innerHTML = 'Generating...';
            button.disabled = true; // Disable button to prevent multiple clicks
            
            const emailContent = getEmailContent(); // Function to get the email content
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                //can allow user to select tone 
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "professional" 
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]'); // Adjust selector as needed
            if (composeBox) {
                composeBox.focus(); // Focus the compose box
                document.execCommand('insertText', false, generatedReply); // Insert the generated reply
            } else {
                console.error("Compose box not found");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to generate reply. Please try again.");
        } finally {
            button.innerHTML = 'AI Reply';
            button.disabled = false; // Re-enable button after operation
        }
    });

    toolbar.insertBefore(button, toolbar.firstChild); // insert at the start of the toolbar
    console.log("AI Reply Button Injected");
}

const observer = new MutationObserver((mutations) => { 
    for(const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasComposeElements = addedNodes.some(node =>
            node.nodeType === Node.ELEMENT_NODE &&
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );
        
        if (hasComposeElements) {
            console.log("Compose Window Detected");
            setTimeout(injectButton, 500); 
        }
    }
});

// Start observing the document body for changes
observer.observe(document.body, { 
    // Observe direct children and subtree changes
    childList: true,
    subtree: true
});