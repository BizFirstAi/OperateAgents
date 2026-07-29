class OperateIdMembersClass {
    constructor() {
        this.init();
    }
    navigateToAppByIdentityUrl() {
        var identityInput = document.querySelector('.text_identity');
        var identityUrl = identityInput.value.trim();
        if (identityUrl == "") {
            identityInput.focus();
            identityInput.setAttribute('placeholder', 'Please enter an identity first');
            if (typeof showNotification === 'function') {
                showNotification("Please enter an identity to search", "warning");
            }
            return;
        }
        identityUrl = operateIdMembers._normalizeIdentity(identityUrl);
        // Repaint the textbox with the normalized acc:// format
        document.querySelector('.text_identity').value = "acc://" + identityUrl;
        const adi = operateIdMembers._parseAdi2(identityUrl);

        const links = document.querySelectorAll('.member-link-app-identity-url');
        links.forEach(link => {
            const urlTemplate = link.getAttribute('href_template');
            var url = urlTemplate.replace("@identityName", adi.name);
            url = url.replace("@identityPath", adi.subPath);
            //operateIdMembers._navigateToUrl(url, link);
            //window.open(url, "_blank");
            operateIdMembers.openWindow(url);
        });
    }
    navigateToQrCode() {
        var identityInput = document.querySelector('.text_identity');
        var identityUrl = identityInput.value.trim();
        if (identityUrl == "") {
            identityInput.focus();
            identityInput.setAttribute('placeholder', 'Please enter an identity first');
            if (typeof showNotification === 'function') {
                showNotification("Please enter an identity to generate a QR Code", "warning");
            }
            return;
        }
        identityUrl = operateIdMembers._normalizeIdentity(identityUrl);
        document.querySelector('.text_identity').value = "acc://" + identityUrl;
        const adi = operateIdMembers._parseAdi2(identityUrl);

        const links = document.querySelectorAll('.member-link-app-identity-url');
        links.forEach(link => {
            const urlTemplate = link.getAttribute('href_template');
            var url = urlTemplate.replace("@identityName", adi.name);
            url = url.replace("@identityPath", adi.subPath);

            url = operateIdMembers._replaceNetwork(url);
            url = url.replace(/\?$/, '');//remove trailing ?
            url = url.replace(/\/$/, ''); //remove trailing /            
            url = url.replace(/\?$/, '');//remove trailing ?
            url = url.replace(/\/$/, ''); //remove trailing /  
            
            url = "https://www.bankonledger.com/website/QRCodeGenerator.html?barcodeData=" + url;
            window.open(url, "_blank"); //operateIdMembers.openWindow(url);
        });
    }

    navigateToAppByRecordId() {
        var recordInput = document.querySelector('.text_record_id');
        const text_record_id = recordInput.value.trim();
        if (text_record_id == "") {
            recordInput.focus();
            recordInput.setAttribute('placeholder', 'Please enter a record ID first');
            if (typeof showNotification === 'function') {
                showNotification("Please enter a record ID to search", "warning");
            }
            return;
        }
        const links = document.querySelectorAll('.member-link-app-record-id');
        links.forEach(link => {
            const urlTemplate = link.getAttribute('href_template');
            var url = urlTemplate.replace("@record-id", text_record_id);
            operateIdMembers.openWindow(url); //operateIdMembers._navigateToUrl(url, link);
        });
    }
    openWindow(url) {
        url = operateIdMembers._replaceNetwork(url);
        window.open(url, "_blank");
    }
    //_navigateToUrl(url, link) {
    //    url = operateIdMembers._replaceNetwork(url);
    //    link.setAttribute('href', url);
    //    console.log("Navigating to");
    //    console.log(url);
    //    link.click();
    //}
    _replaceNetwork(url) {
        var network = document.querySelector('.select-network').value.trim();
        if (network != "") {
            network = "&current-network=" + network
        }
        return url.replace("@network", network);
    }

    init() {
        // Add click handlers to each link element
        document.querySelectorAll('.member-link-app-identity-url').forEach(link => {
            link.addEventListener('click', this.navigateToAppByIdentityUrl);
        });

        document.querySelectorAll('.member-link-app-record-id').forEach(link => {
            link.addEventListener('click', this.navigateToAppByRecordId);
        });

        document.querySelectorAll('.member-link-app-identity-qr-code').forEach(link => {
            link.addEventListener('click', this.navigateToQrCode);
        });
    }
    // Normalizes user input into a clean identity path (without acc:// prefix)
    // Supports: "newyork", "newyork.acme", "newyork/agent", "newyork.acme/agent/sub",
    //           "acc://newyork.acme/agent", and replaces \, >, | with /
    _normalizeIdentity(input) {
        var url = input.trim().toLowerCase();
        // Replace common typo separators with /
        url = url.replace(/[\\>|]/g, '/');
        // Strip acc:// prefix if present
        if (url.startsWith("acc://")) {
            url = url.substring(6);
        }
        // Remove leading/trailing slashes
        url = url.replace(/^\/+|\/+$/g, '');
        // Split into parts: first segment may contain .acme
        var parts = url.split("/");
        var rootPart = parts[0];
        // Ensure .acme suffix on the root identity
        if (!rootPart.includes(".acme")) {
            rootPart = rootPart + ".acme";
        }
        parts[0] = rootPart;
        return parts.join("/");
    }
    _parseAdi2(adiUrl) {
        var adi = {};
        adi.url = adiUrl.toLowerCase();
        // Strip acc:// prefix
        if (adi.url.startsWith("acc://")) {
            adi.path = adi.url.substring(6);
        } else {
            adi.path = adi.url;
        }
        // Split on first "/" to separate root identity from sub-path
        var slashIndex = adi.path.indexOf("/");
        var rootPart = slashIndex >= 0 ? adi.path.substring(0, slashIndex) : adi.path;
        adi.subPath = slashIndex >= 0 ? adi.path.substring(slashIndex + 1) : "";
        // Extract name (part before .acme)
        adi.name = rootPart.replace(".acme", "");
        adi.rootUrl = "acc://" + adi.name + ".acme";
        return adi;
    }
}


var operateIdMembers = new OperateIdMembersClass(); 