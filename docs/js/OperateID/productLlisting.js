
class ProductListingDataProcessorClass
{
    async getData_Recent(productScope) {       
        return await getData_ByProductScope("recent");
    }
    async getData_Top(productScope) {       
        return await getData_ByProductScope("top");
    }
    async getData_ByProductScope(productScope) {        
        var request = { info: { searchRequestType: "public" } };
        if(IsEmpty(productScope)) productScope="recent";
        if(productScope == "top"){
            request.info.isHot = true;
        } 
        request.info.recordTypeID = productListingCurrent.recordTypeID;
        var url =null;
        url = "https://accumulateplatform.com/api/v1/PublicProductListing/Search";
        //url = "https://localhost:7033/api/v1/PublicProductListing/Search";
        return await this._post(url, request, false);
    }
    
    async _post(url, request, isPost) {
        if (IsEmpty(isPost)) isPost = true;
        var requestS = JSON.stringify(request);

        var webRequest = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        };
        webRequest.method = (isPost ? "POST" : "GET");
        if (isPost) {
            webRequest.body = requestS;
        }
        else {
            url = url + "?request=" + requestS;
        }
        const response = await fetch(url, webRequest);

        const responseText = await response.text();
        try {
            const result = JSON.parse(responseText);
            if (!IsEmptyString(result.message)) {
                alertError(result.message);
            }
            return result;
        } catch (error) {
            alert("Parsed Response:" + responseText);
            console.error("Error parsing JSON response:", error);
            alert(`Invalid JSON response: ${responseText}`);
            throw new Error(`Invalid JSON response: ${responseText}`);
        }
    }
}
 
class ProductListingUIProcessorClass
{  
    constructor(productScope, cardType) {
        this.productScope = productScope;   
        this.cardType = cardType;
        this.targetElementCssSelection = null;
    }
    init(){
        if (IsEmpty(this.targetElementCssSelection)) {
            this.targetElementCssSelection = productListingCurrent.sectionCssSelection + " .app-product-listing-holder-" + this.productScope;
            this.contentElementCssSelection = this.targetElementCssSelection + ">.app-product-listing-content";
        }

        this.targetElement$  = $(this.targetElementCssSelection);
        this.contentElement$  = $(this.contentElementCssSelection);
        this.cardHtmlTemplate = this._templateText();

        if (this.targetElement$.length == 0) this.valid = false;
        if (this.contentElement$.length == 0) this.valid = false;
        if  (this.cardHtmlTemplate === "") this.valid = false;        
    }
    async attachAsCards() {
        this.init();
        if(this.valid == false) {
            console.log("Product Listing UI Processor is not valid.Error 1818");
            return;
        }
        try {
                await this._loadData();
                this._calculateItems();
                console.log("Data Fetched:", this.dataItems);

                await this._render();           
                console.log("Render Complete:");
            }
            catch (error) {
                this.targetElement$.html("");
                console.log(error);
            }
            finally {
            }
    }
    _templateText() {
        var templateElement$ = $(".card-template-" + this.cardType);
        var cardHtml= templateElement$.html();
        return cardHtml;
    }
    _calculateItems(){
            this.dataItems.forEach(item => {
                    item.appUrl = appLinkAdiHelper.getUrl(item.code);
                if(operateAppSettings.enableDev) item.appUrlTestNet = item.appUrl + "?current-network=kermit"; 
            });
        }
    _convertToHtmlCards() {
        let html = '';
        this.dataItems.forEach(item => {
            let card = this.cardHtmlTemplate;
            for (let key in item) {
                const regex = new RegExp(`{@${key}}`, 'g');
                card = card.replace(regex, item[key]);
            }
            html += card;
        });
        return html;
    } 

    async _loadData() {
            var dataProcessor = new ProductListingDataProcessorClass();
            this.webResponse = await dataProcessor.getData_ByProductScope(this.productScope);
            this.dataItems = this.webResponse.result;
    }
    async _render() {
        var html = this._convertToHtmlCards();
        this.contentElement$.html(html);

        if(this.dataItems==null || this.dataItems.length == 0){
           this.targetElement$.html("");
           return;
        }
        productListingCurrent.increment(this.dataItems.length);
    }
}
class ProductListingCurrentClass
{ 
    activeItemCount = 0;
    sectionCssSelection = ".app-product-listing-section";
    increment(count) {
        if (IsEmpty(count)) count = 0;
        this.activeItemCount = this.activeItemCount + count;
    }  
    onComplete() {
        if ( this.activeItemCount>0) return;
        $(this.sectionCssSelection).addClass("w-hidden");
    }
}
var productListingCurrent = new ProductListingCurrentClass();
class ProductListingUIServiceClass
{  
    /*
        async attachAsCards_StandardMini(targetELementCssSelection) {
            return this._attachAsCards("standard-mini", targetELementCssSelection);
        }
        async attachAsCards_StandardMedium(targetELementCssSelection) {
            return this._attachAsCards("standard-medium", targetELementCssSelection);
        }
        async attachAsCards_StandardLarge(targetELementCssSelection) {
            return this._attachAsCards("standard-large", targetELementCssSelection);
        }
    */
    static async attachAsCards(productScope, cardType) {
        var processor = new ProductListingUIProcessorClass(productScope, cardType);   
        await processor.attachAsCards();        
    }

    static async process(recordTypeID, sectionCssSelection) {
        if(!IsEmpty(sectionCssSelection)) productListingCurrent.sectionCssSelection = sectionCssSelection;
        productListingCurrent.recordTypeID =  recordTypeID;
        await ProductListingUIServiceClass.attachAsCards('recent', 'standard-mini');
        await ProductListingUIServiceClass.attachAsCards('top', 'standard-mini'); 
        productListingCurrent.onComplete();       
    }
}



