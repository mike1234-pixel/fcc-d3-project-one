fetch(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }
    // Examine the text in the response
    response.json().then((data) => {
      console.log(data);

      let dataset = data.data;

      const svgHeight = 600;
      const svgWidth = 1000;

      const maxDate = d3.max(dataset, (d) => d[0]); // sorting by date, which is the first value in each array
      const minDate = d3.min(dataset, (d) => d[0]);

      const maxGDPValue = d3.max(dataset, (d) => d[1]); // sorting by date, which is the first value in each array
      const minGDPValue = d3.min(dataset, (d) => d[1]);

      const padding = 100;

      var yearsDate = data.data.map((item) => {
        return new Date(item[0]);
      });

      var xMax = new Date(d3.max(yearsDate));
      xMax.setMonth(xMax.getMonth() + 3);
      var xScale = d3
        .scaleTime()
        .domain([d3.min(yearsDate), xMax])
        .range([padding, svgWidth - padding]);

      var yScale = d3
        .scaleLinear() // y scale is for gdp (vertical axis)
        .domain([minGDPValue, maxGDPValue])
        .range([svgHeight, 0]);

      // PADDING NEEDED ON THE HEIGHT

      const svg = d3
        .select("body")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight + padding);

      var tooltip = d3
        .select(".visHolder")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

      svg
        .selectAll() // rather than select an h2 i just want to create three h3s with no initial hard coded node
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => {
          return d[0];
        })
        .attr("data-gdp", (d) => {
          return d[1];
        })
        .attr("width", "5px") // width of rect
        .attr("height", (d) => {
          return d[1] / 30;
          return d[1];
        })
        .attr("x", (d, i) => {
          //   return xScale(parseInt(d[0].replace(/-/g, ""))); // position of rect on x-axis (horizontally)
          return xScale(yearsDate[i]);
        })
        .attr("y", (d) => {
          return svgHeight - d[1] / 30;
        })
        .attr("fill", "#1b262c")
        .attr("id", (d) => d[1])
        .on("mouseover", (d, i) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(d[0] + "<br>" + "$" + d[1] + " Billion")
            .attr("data-date", d[0]);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(200).style("opacity", 0);
        });

      // create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`)
        .call(yAxis);

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${svgHeight})`)
        .call(xAxis);
    });
  })
  .catch((err) => {
    console.log("Fetch Error :-S", err);
  });
