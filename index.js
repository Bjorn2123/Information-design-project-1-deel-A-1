/* global d3 */

///////////////////////Links///////////////////////////////////////////////////////////////////////////////
//Hier declareer ik de waardes van de linker barchart
var svgLeft = d3.select("#left"),
    marginL = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 100
    },
    widthL = +svgLeft.attr("width") - marginL.left - marginL.right,
    heightL = +svgLeft.attr("height") - marginL.top - marginL.bottom;

var xL = d3.scaleBand().rangeRound([0, widthL]).padding(0.1),
    yL = d3.scaleLinear().rangeRound([heightL, 0]);

var gL = svgLeft.append("g")
    .attr("transform", "translate(" + marginL.left + "," + marginL.top + ")");

//Rechts
//Hier declareer ik de waardes van de rechter barchart
var svgRight = d3.select("#right"),
    marginR = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 100
    },
    widthR = +svgRight.attr("width") - marginR.left - marginR.right,
    heightR = +svgRight.attr("height") - marginR.top - marginR.bottom;

var xR = d3.scaleBand().rangeRound([0, widthR]).padding(0.1),
    yR = d3.scaleLinear().rangeRound([heightR, 0]);

var gR = svgRight.append("g")
    .attr("transform", "translate(" + marginR.left + "," + marginR.top + ")");


//Hier roep het bestand aan waar de data voor de linker barchart vandaan gehaald moet worden.
var data = d3.text('data1.csv')
    .get(onload1);

function onload1(err, doc) {
    if (err) {
        throw err
    }

    //Hier vertel vanuit waar hij de data moet aanroepen en welke regels hij moet aanroepen.
    var header1 = doc.indexOf('Perioden');
    var data1 = d3.csvParseRows(doc, map1).slice(1, 12);

    function map1(d) {
        return {
            Perioden: (d[0]),
            Aantal: Number(d[1])
        }
    }

// Hier vertel ik wat er op de X en op de Y as weergegeven moet worden.
    xL.domain(data1.map(function (d) {
        return d.Perioden;
    }));
    yL.domain([0, d3.max(data1, function (d) {
        return d.Aantal;
    })]);

    gL.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + heightL + ")")
        .call(d3.axisBottom(xL));

    gL.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yL).ticks(6))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    gL.selectAll(".bar1")
        .data(data1)
        .enter().append("rect")
        .attr("class", "bar1")
        .attr("x", function (d) {
            return xL(d.Perioden);
        })
        .attr("y", function (d) {
            return yL(d.Aantal);
        })
        .attr("width", xL.bandwidth())
        .attr("height", function (d) {
            return heightL - yL(d.Aantal);
        });
    
    
//Hier begint de code voor de sorteer functie, ik roep hier de checkbutton aan.
    d3.select("#InputL").on("change", change1);

//Hier controleert hij of de checkbutton gechecked is, zo ja, dan gaat de functie hieronder lopen. Is hij niet meer gechecked, dan gaat hij weer terug naar de oude staat.
    d3.select("#InputL").property("unchecked", true).each(change1);


    function change1() {

        var x0 = xL.domain(data1.sort(this.checked ?
                    function (a, b) {
                        return b.Aantal - a.Aantal;
                    } :
                    function (a, b) {
                        return d3.ascending(a.Perioden, b.Perioden);
                    })
                .map(function (d) {
                    return d.Perioden;
                }))
            .copy();


        svgLeft.selectAll(".bar1")
            .sort(function (a, b) {
                return x0(a.Perioden) - x0(b.Perioden);
            });

        var transition = svgLeft.transition().duration(750),
            delay = function (d, i) {
                return i * 50;
            };

        transition.selectAll(".bar1")
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.Perioden);
            });


        transition.selectAll(".axis--x")
            .call(d3.axisBottom(xL))
            .selectAll("g")
            .delay(delay);
    }
};

///////////////////////Rechts///////////////////////////////////////////////////////////////////////////////

//Hier roep ik de data voor de rechter grafiek aan.
var data2 = d3.text('data3.csv')
    .get(onload2);

function onload2(err, doc) {
    if (err) {
        throw err
    }

    //Hier schoon ik de data voor de rechter grafiek op,
    var header2 = doc.indexOf('Onderwerpen_1');
    var end = doc.indexOf('Centraal Bureau voor de Statistiek') - 3;
    doc = doc.substring(header2, end).trim();
    doc = doc.replace(/;+/g, ',')
    doc = doc.replace(/ +/g, ',')
    var data2 = d3.csvParseRows(doc, map).slice(1, 12);


    function map(d) {
        return {
            Perioden: (d[2]),
            Totaal: Number(d[4]),
            Mannen: Number(d[5]),
            Vrouwen: Number(d[6])
        }
    }


    //Hier maak ik een variabelen aan waar de data voor de rechtergrafiek in zit.
    var data3 = [];
    var totalLiquidation = [];
    var liquidation = '';
    data2.forEach(function (d) {
        totalLiquidation.push(d.Perioden)
    })

    liquidation = totalLiquidation[0];
    data3 = data2.filter(filterLiquidation);
    
    //Hieronder zoek ik binnen mijn data.csv file en pak ik de waardes die ik nodig heb voor mijn rechter grafiek

    var totaalObject = {};
    var mannenObject = {};
    var vrouwenObject = {};
    var newData = [];
    totaalObject["name"] = 'Totaal';
    totaalObject["number"] = data3[0].Totaal;
    mannenObject["name"] = 'Mannen';
    mannenObject["number"] = data3[0].Mannen;
    vrouwenObject["name"] = 'Vrouwen';
    vrouwenObject["number"] = data3[0].Vrouwen;
    newData.push(totaalObject);
    newData.push(mannenObject);
    newData.push(vrouwenObject);

    
    //Hieronder vertel ik dat newData in de rechter grafiek laten zien moet worden

    xR.domain(newData.map(function (d) {
        return d.name;
    }));
    yR.domain([0, 212]);


    gR.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + heightR + ")")
        .call(d3.axisBottom(xR));

    gR.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yR).ticks(7))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency")

    gR.selectAll(".bar2")
        .data(newData)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", function (d) {
            return xR(d.name);
        })
        .attr("y", function (d) {
            return yR(d.number);
        })
        .attr("width", xR.bandwidth())
        .attr("height", function (d) {
            return heightR - yR(d.number);
        });



// hieronder maak ik een click event aan die er voor gaat zorgen dat als ik op een bar klik, dat de data van het aantal slachtoffers van moord en doodslag wordt laten zien.

    d3.selectAll(".bar1").on('click', onChange);
    
    // In de function hieronder wordt er een class active toegevoegd die er voor zorgt dat de data uit de geklikte bar 'active' wordt en getoond wordt.

    function onChange(e) {
        liquidation = e.Perioden;
        this.classList.add("active");
        data3 = [];
        newData = [];
        data3 = data2.filter(filterLiquidation);
        totaalObject["name"] = 'Totaal';
        totaalObject["number"] = data3[0].Totaal;
        mannenObject["name"] = 'Mannen';
        mannenObject["number"] = data3[0].Mannen;
        vrouwenObject["name"] = 'Vrouwen';
        vrouwenObject["number"] = data3[0].Vrouwen;
        newData.push(totaalObject);
        newData.push(mannenObject);
        newData.push(vrouwenObject);


        var barElement = gR.selectAll(".bar2")
            .data(newData);
        barElement.transition().duration(750)
            .attr("class", "bar2")
            .attr("x", function (d) {
                return xR(d.name);
            })
            .attr("y", function (d) {
                return yR(d.number);
            })
            .attr("width", xR.bandwidth())
            .attr("height", function (d) {
                return heightR - yR(d.number);
            });
    }

    function filterLiquidation(d) {
        return (d.Perioden === liquidation);
    };

    ///////////////////////circle///////////////////////////////////////////////////////////////////////////////
    
    //Hieronder declareer ik de waarde van de cirkel
    var circle = d3.select("#circle"),
        diameter = +circle.attr("width"),
        g3 = circle.append("g").attr("transform", "translate(2,2)"),
        format = d3.format(",d");

    //hieronder maak ik de variabelen aan voor de tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var pack = d3.pack()
        .size([diameter - 4, diameter - 4]);
    
    //Hieronder roep ik het bestand aan waar mijn data in zit.

    d3.json("data1.json", function (error, root) {
        if (error) throw error;

        root = d3.hierarchy(root)
            .sum(function (d) {
                return d.size;
            })
            .sort(function (a, b) {
                return b.value - a.value;
            });

        
        var node = g3.selectAll(".node")
            .data(pack(root).descendants())
            .enter().append("g")
            .attr("class", function (d) {
                return d.children ? "node" : "leaf node";
            })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("mouseover", function (d) {//Hier vertel ik waar de data die de tooltip moet laten zien vandaan gehaald moet worden.
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html((d.data.name) + "<br/>" + d.value)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        node.append("circle")
            .attr("r", function (d) {
                return d.r;
            });

        node.filter(function (d) {
                return !d.children;
            }).append("text")
            .attr("dy", "0.3em")
            .text(function (d) {
                return d.data.name.substring(0, d.r / 3);
            });
    });

};

///////////////////////Pie///////////////////////////////////////////////////////////////////////////////

//Hier declareer ik de waarde van de pie chart

var pie = d3.select("#pie"),
    width = +pie.attr("width"),
    height = +pie.attr("height"),
    radius = Math.min(width, height) / 2,
    g4 = pie.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//Hieronder vertel ik welke kleuren de piechart moet laten zien, ik heb 12 maanden in mijn pie chart, dus ook 12 kleuren. De eerste kleur wordt aan de eerste waar gegeven.
var color = d3.scaleOrdinal(["#009933", "#3333ff", "#ff4d4d", "#ac7339", "#ac00e6", "#ff3333", "#cccc00", "#ff3399", "#40ff00", "#b3b3ff", "#0088cc", "#0077b3"]);

var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

 //hieronder maak ik de variabelen aan voor de tooltip
    
var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

d3.csv("data4.csv", function(d) {
  d.count = +d.count;
  return d;
}, function(error, data) {
  if (error) throw error;
    
    

  var arc = g4.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")
        .on("mouseover", function (d) {//Hier vertel ik waar de data die de tooltip moet laten zien vandaan gehaald moet worden.
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html((d.data.month) + "<br/>" + d.data.count)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

  arc.append("path")
      .attr("d", path)
      .attr("fill", function(d) { return color(d.data.month); });


});
