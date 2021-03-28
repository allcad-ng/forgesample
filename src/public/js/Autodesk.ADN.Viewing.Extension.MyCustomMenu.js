function MyCustomMenuExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

MyCustomMenuExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyCustomMenuExtension.prototype.constructor = MyCustomMenuExtension;

MyCustomMenuExtension.prototype.load = function () {
    //console.log('MyCustomMenuExtension is loaded!');
    this.viewer.registerContextMenuCallback('MyCustomMenu', (menu, status) => {
        if (status.hasSelected) {
            menu.push({
                title: 'Add Completed',
                target: () => {

                    const selSet = this.viewer.getSelection();

                    for (let i = 0; i < selSet.length; i++) {
                        this.viewer.model.getProperties(selSet[i],
                            function (result) {
                                //console.log(selSet[i]);
                                //console.log(result);
                                addCompleted.push(
                                    {
                                        "UniqueId": result.externalId
                                    });
                            },
                            function () {
                                console.log("Error");
                            }
                        );
                    };
                }
            });
            menu.push({
                title: 'Add Active',
                target: () => {
                    const selSet = this.viewer.getSelection();
                    for (let i = 0; i < selSet.length; i++) {
                        this.viewer.model.getProperties(selSet[i],
                            function (result) {
                                addActive.push({
                                    "UniqueId": result.externalId
                                });
                            },
                            function () {
                                console.log("Error");
                            }
                        );
                    };
                }
            });
            
            menu.push({
                title: 'Add Planned',
                target: () => {
                    const selSet = this.viewer.getSelection();
                    for (let i = 0; i < selSet.length; i++) {
                        this.viewer.model.getProperties(selSet[i],
                            function (result) {
                                addPlanned.push({
                                    "UniqueId": result.externalId
                                });
                            },
                            function () {
                                console.log("Error");
                            }
                        );
                    };
                }
            });
        }
        else {
            menu.push({
                title: 'Reset color',
                target: () => {
                    this.viewer.clearThemingColors();
                }
            });
        }
    });
    console.log('MyCustomMenuExtension is now loaded!');
    return true;
};


MyCustomMenuExtension.prototype.unload = function () {
    //alert('MyCustomMenuExtension is now unloaded!');
    this.viewer.unregisterContextMenuCallback('MyChangingColorMenuItems');
    console.log('MyCustomMenuExtension is now unloaded!');
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MyCustomMenuExtension', MyCustomMenuExtension);
