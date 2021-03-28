
  function updateProgress() {
    jQuery.post({
      url: '/api/forge/saveFile/saveProgress',
      contentType: 'application/json',
      data: JSON.stringify({
        ModelId: modelUrn,
        AddCompleted: addCompleted,
        AddActive: addActive,
        AddPlanned: addPlanned
    }),
      success: function (res) {
        alert('Successfully saved!');
        $('#dashboard').empty();
        loadProgress();
      },
      error: function (err) {
        console.log(err);
      }
    });
  }

  function loadProgress() {

    var data =
    {
        ModelId: modelUrn
    };

    jQuery.get({
        url: '/api/forge/saveFile/getProgress',
        type: 'GET',
        data: data,
        dataType: "json",
        error: function (er) {
            console.log("Can not request");
            //console.log(er);
            alert('No progress has been saved before.')
        }
    })
    .then(res => showProgressElements(res));
}

function showProgressElements(progressData) {
    let completedIds = progressData.AddCompleted.map(a => a.UniqueId);
    let plannedIds = progressData.AddPlanned.map(a => a.UniqueId);
    let activeIds = progressData.AddActive.map(a => a.UniqueId);

    new Dashboard(NOP_VIEWER, [
        new PieChart('progress'),
        new BarChart('progress')
    ],
    progressData)

    let rtIds = getAllIds();
    setThemingColorIds(rtIds, "#bdc3c7");
    for (let i = 0; i < rtIds.length; i++) {
        viewer.model.getProperties(
            rtIds[i],
            function (result) {
                if (completedIds.includes(result.externalId)) {
                    setThemingColorId(result.dbId, "#27ae60");
                }
                else if (activeIds.includes(result.externalId)) {
                    setThemingColorId(result.dbId, "#c0392b");
                }
                else if (plannedIds.includes(result.externalId)) 
                {
                    setThemingColorId(result.dbId, "#2c3e50");
                }
            },
            function () {
                console.log("Error");
            }
        );
    }

    // showProgressLegend();
}

function setThemingColorIds(dbIds, colorHex) {
    let colorRGB = hexToRgb(colorHex);
    let colorVector = new THREE.Vector4(colorRGB.r / 255, colorRGB.g / 255, colorRGB.b / 255, 1);

    for (let i = 0; i < dbIds.length; i++) {
        viewer.setThemingColor(dbIds[i], colorVector);
    }
}

function setThemingColorId(dbId, colorHex) {
    let colorRGB = hexToRgb(colorHex);
    let colorVector = new THREE.Vector4(colorRGB.r / 255, colorRGB.g / 255, colorRGB.b / 255, 1);

    viewer.setThemingColor(dbId, colorVector);
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getAllIds() {
    if (allElementIds !== null && allElementIds.length > 0) {
        return allElementIds;
    }
    else {
        allElementIds = getAllLeafIdsOfParentId(viewer.model.getData().instanceTree.getRootId());
        return allElementIds;
    }
}

function getAllLeafIdsOfParentId(id) {
    let allIds = [];
    const instanceTree = viewer.model.getData().instanceTree;
    if (instanceTree.getChildCount(id) > 0) {
        allIds.push(id);
        instanceTree.enumNodeChildren(id, function (child) {
            allIds = allIds.concat(getAllLeafIdsOfParentId(child));
        }, false);
    }
    else {
        //console.log(id);
        allIds.push(id);
    }

    return allIds;
}