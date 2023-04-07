//Use the D3 library to read in samples.json from the URL
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then(function(data) {
    console.log(data);
});

//Created function to hold chart functions
function init() {
    let dropdownMenu = d3.select(`#selDataset`);
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((id) => {
            console.log(id);
            dropdownMenu.append(`option`)
            .text(id)
            .property(`value`, id);
        });
        let firstSample = names[0];
       
        populateMetadata(firstSample);
        barChart(firstSample);
        bubbleChart(firstSample);
    });
};

//Display the sample metadata
function populateMetadata(sample) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);
        //console.log(value);
        let valueData = value[0];
        d3.select(`#sample-metadata`).html("");

//Display each key-value pair from the metadata JSON object somewhere on the page
        Object.entries(valueData).forEach(([key, value]) => {
            //console.log(key, value);
            d3.select(`#sample-metadata`).append(`h5`).text(`${key}: ${value}`);
        });
    });
};

//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual

function barChart(sample) {
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        let value = sampleData.filter(result => result.id == sample);
        let valueData = value[0];

//Use sample_values as the values for the bar chart.
//Use otu_ids as the labels for the bar chart.
//Use otu_labels as the hovertext for the chart.   

        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        
        //console.log(otu_ids, otu_labels, sample_values);

        let yAxis = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xAxis = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();

        let traceBar = {
            x: xAxis,
            y: yAxis,
            text: labels,
            type: `bar`,
            orientation: `h`
        };

        let layout = {
            title: `Top 10 OTU's Present`
        };

        Plotly.newPlot(`bar`, [traceBar], layout)
    });
};

//Create a bubble chart that displays each sample
function bubbleChart(sample) {
    d3.json(url).then((data) => {
        let sampleData = data.samples;
        let value = sampleData.filter(result => result.id == sample);
        let valueData = value[0];

//Use otu_ids for the x values.
//Use sample_values for the y values.
//Use sample_values for the marker size.
//Use otu_ids for the marker colors.
//Use otu_labels for the text values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        //console.log(otu_ids, otu_labels, sample_values);

        let traceBubble = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: `markers`,
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: `Earth`
            }
        };

        let layout = {
            title: `Bacteria Found in Sample`,
            hovermode: `closest`,
            xaxis: {title: `OTU ID`}
        };

        Plotly.newPlot(`bubble`, [traceBubble], layout)
    });
};

//Update all the plots when a new sample is selected
function updatePlotly(newData) {
    //console.log(newData);

    populateMetadata(newData);
    barChart(newData);
    bubbleChart(newData);
};

init();