class PieChart extends DashboardPanelChart {
    constructor(property) {
        super();
        this.propertyToUse = property;
    }

    load(parentDivId, viewer, modelData) {
        if (!super.load(parentDivId, this.constructor.name, viewer, modelData)) return;
        this.drawChart();
    }

    drawChart() {
        var _this = this; // need this for the onClick event

        var ctx = document.getElementById(this.canvasId);
        
        if(this.propertyToUse === 'progress'){
            var colors = {
                background:['rgba(39,174,96,1)','rgba(44,62,80,1)','rgba(192,57,43,1)'],
                borders:['rgba(39,174,96,1)','rgba(44,62,80,1)','rgba(192,57,43,1)']
            };

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.modelData.getLabels(this.propertyToUse),
                    datasets: [{
                        data: this.modelData.getCountInstances(this.propertyToUse),
                        backgroundColor: colors.background,
                        borderColor: colors.borders,
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: true
                    },
                    'onClick': function (evt, item) {
                        _this.viewer.isolate(_this.modelData.getIds(_this.propertyToUse, item[0]._model.label));
                    }
                }
            });
        }
        else
        {
            var colors = this.generateColors(this.modelData.getLabels(this.propertyToUse).length);
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: this.modelData.getLabels(this.propertyToUse),
                    datasets: [{
                        data: this.modelData.getCountInstances(this.propertyToUse),
                        backgroundColor: colors.background,
                        borderColor: colors.borders,
                        borderWidth: 1
                    }]
                },
                options: {
                    tooltips: {
                        enabled: false
                    },
                    plugins: {
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0;
                                let dataArr = ctx.chart.data.datasets[0].data;
                                dataArr.map(data => {
                                    sum += data;
                                });
                                let percentage = (value*100 / sum).toFixed(2)+"%";
                                return percentage;
                            },
                            color: '#fff',
                        }
                    },
                    legend: {
                        display: true
                    },
                    'onClick': function (evt, item) {
                        _this.viewer.isolate(_this.modelData.getIds(_this.propertyToUse, item[0]._model.label));
                    }
                    
                }
            });
        }
    }
}
