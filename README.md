# Information-design-project-1-deel-A

## Concept
Bij het vak RfD hadden we een onderwerp toebedeeld gekregen. Mijn onderwerp was voedsel. Opzich heel intressant, maar omdat het onderwerp voor het eerste deel van het project vrij was. Heb ik gekozen voor een onderwerp wat mij wel aansprak, liquidaties in de onderwereld. Ik heb gekozen om dit te doen vanaf het jaar 2000 tot 2010. Mijn idee is om het aantal liquidaties te laten zien in verschillende samenstellingen. Ik laat het aantal liquidaties per jaar zien, Het aantal liquidaties per landdeel en het aantal liquidaties per maand. 

## Technische aspecten
Binnen mijn code heb ik comments geplaatst voor de algemene aspecten zoals bijvoorbeeld het aanroepen van mijn data of het declareren van de waardes voor een grafiek. Hier toon ik enkel en alleen de features die ik aan mijn visualisaties heb toegevoegd.

### De sorteer functie
Als je de checkbox checkt, sorteren de bars op grote

```js
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
```
