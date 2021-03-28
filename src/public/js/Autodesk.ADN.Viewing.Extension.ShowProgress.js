class ShowProgressExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('ShowProgressExtension has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('ShowProgressExtension has been unloaded');
        return true;
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('progressToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('progressToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('ShowProgressButton');
        this._button.onClick = (ev) => {
            // Execute an action here
            $('#dashboard').remove();
            loadProgress();
        };
        this._button.setToolTip('Show Status');
        this._button.addClass('showProgressIcon');
        this._group.addControl(this._button);


        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('UpdateProgressButton');
        this._button.onClick = (ev) => {
            // Execute an action here
            $('#dashboard').remove();
            updateProgress();
        };
        this._button.setToolTip('Save Status');
        this._button.addClass('saveProgressIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('ShowProgressExtension', ShowProgressExtension);