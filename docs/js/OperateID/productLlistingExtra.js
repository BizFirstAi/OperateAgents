var operateAppSettings = {
    enableDev:true,
    appIdentityUrlTemplate:"https://@identityName.BizFirstAi.com/@identityPath?@network",
}

var appLinkAdiHelper = new AppLinkAdiClass(operateAppSettings.appIdentityUrlTemplate);
$(document).ready(function () {
    setTimeout(async () => {
        await ProductListingUIServiceClass.process(eRecordType.bizFirstAiAgents,".app-product-listing-section-bizfirstaiagents");
        await ProductListingUIServiceClass.process(eRecordType.bizFirstAiDataStores,".app-product-listing-section-bizfirstdatastores");
    }, 100);
});