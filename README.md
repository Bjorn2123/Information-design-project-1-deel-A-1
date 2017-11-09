# Information-design-project-1-deel-A

## Concept
Bij het vak RfD hadden we een onderwerp toebedeeld gekregen. Mijn onderwerp was voedsel. Opzich heel intressant, maar omdat het onderwerp voor het eerste deel van het project vrij was. Heb ik gekozen voor een onderwerp wat mij wel aansprak, liquidaties in de onderwereld. Ik heb gekozen om dit te doen vanaf het jaar 2000 tot 2010. Mijn idee is om het aantal liquidaties te laten zien in verschillende samenstellingen. Ik laat het aantal liquidaties per jaar zien, Het aantal liquidaties per landdeel en het aantal liquidaties per maand. 

## Technische aspecten
Binnen mijn code heb ik comments geplaatst voor de algemene aspecten zoals bijvoorbeeld het aanroepen van mijn data of het declareren van de waardes voor een grafiek. Hier toon ik enkel en alleen de features die ik aan mijn visualisaties heb toegevoegd.

### De sorteer functie
Als je de checkbox checkt, sorteren de bars op grote.
Hieronder roep ik binnen de html de checkbox aan. Hier zegt hij dat als de button gecheckt is, dat de function dan gaat draaien. En als hij niet meer gecheckt is, dat hij dan weer in zijn oude staat moet terug keren.
```js
d3.select("#InputL").on("change", change1);

    d3.select("#InputL").property("unchecked", true).each(change1);
```
Hieronder staat de function die er voor zorgt dat alles gesorteerd wordt.
```js
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
```
### De vergelijk functie
Als je in de linker grafiek op een bar klikt, worden er in de rechtergrafiek waardes van moord en doodslag laten zien van het jaar waar op je in de linker grafiek op klikt. Dit heb gedaan doormiddel van dit stuk code.
Zoals je ziet maak ik eerst een variabelen aan waar ik de nieuwe data in ga stoppen. 

```js
var data3 = [];
    var totalLiquidation = [];
    var liquidation = '';
    data2.forEach(function (d) {
        totalLiquidation.push(d.Perioden)
    })

    liquidation = totalLiquidation[0];
    data3 = data2.filter(filterLiquidation);
```
Vervolgens vertel ik dat de waardes in de variabelen newData gestopt moeten worden en vervolgens weer in de andere variabelen gestopt moeten worden
```js
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
```
Vervolgens vertel ik dat als men op een van de bars klikt dat dan de function onChange moet gaan draaien.
```js
d3.selectAll(".bar1").on('click', onChange);

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
```
### Tooltip
Ik heb ook een tooltip aangemaakt. Een tooltip is een klein pop-upje dat getoont wordt wanneer je bijvoorbeeld over een barchart hovert.
Als eerste maak ik een nieuwe variabelen aan
```js
var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
```
Vervolgens plak ik hem onder de variabel die bijvoorbeeld alle bars selecteert en vertel wat er in het kleine pop-upje getoont moet worden.
```js
var node = g3.selectAll(".node")
            .data(pack(root).descendants())
            .enter().append("g")
            .attr("class", function (d) {
                return d.children ? "node" : "leaf node";
            })
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("mouseover", function (d) {
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
```
Daarna heb ik alleen nog dit stuk je code aan mijn CSS bestand toegevoegd om de tooltip te stijlen.

```css
div.tooltip {
  position: absolute;
  text-align: center;
  width: 10em;
  height: 2em;
  padding: 1em;
  font: 12px sans-serif;
  background: lightsteelblue;
  border: 0px;
  border-radius: 8px;
  pointer-events: none;
}
```

### Opschonen van de data
Ook heb ik nog mijn data opgeschoond. Dit heb ik gedaan door dit stuk code aan mijn bestand toe te voegen.

Als eerst roep ik mijn data bestand aan
```js
var data2 = d3.text('data3.csv')
    .get(onload2);
```
Vervolgens maak ik de functie aan die de waardes gaat tonen
```js
function onload2(err, doc) {
    if (err) {
        throw err
    }
```
Vervolgens vertel ik wat ik uit het data bestand wil pakken
```js
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
```

## Bronnen
[dataset 1](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=7052_95&D1=89&D2=a&D3=0&D4=50-60&HDR=G1,G2,G3&STB=T&VW=T)

[dataset 2](https://nl.wikipedia.org/wiki/Lijst_van_criminele_liquidaties_in_Nederland)

[Barchart](https://bl.ocks.org/mbostock/3885304)

[Circle chart](https://bl.ocks.org/mbostock/4063530)

[Pie chart](https://bl.ocks.org/mbostock/3887235)


