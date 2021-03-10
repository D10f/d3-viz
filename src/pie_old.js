import * as d3 from 'd3';

// Initial dimensions and center
const dimensions = { height: 300, width: 300, radius: 150 };
const center = { x: dimensions.height / 2 + 5, y: dimensions.width / 2 + 5 };

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dimensions.width + 150)
  .attr('height', dimensions.height + 150);

const graph = svg.append('g')
  .attr('transform', `translate(${center.x}, ${center.y})`);

const pie = d3.pie()
  .sort(null)            // prevent resorting
  .value(d => d.amount); // generates the angles based on this data

const arcPath = d3.arc()
  .outerRadius(dimensions.radius)     // how far the outer radius is from the center
  .innerRadius(dimensions.radius / 2) // 0 to create a full pie chart.

// const angles = pie([
//     { title: 'rent', amount: 500 },
//     { title: 'bills', amount: 210 },
//     { title: 'gaming', amount: 375 }
//   ]);
// console.log(arcPath(angles[0]));

// const createPieChartPath = (data) => {
//   const angles = pie(data);
//   return angles.map(angle => archPath(angle));
// };

const color = d3.scaleOrdinal(d3['schemeSet3']);

export const drawChart = (data) => {

  color.domain(data.map(d => d.title));

  const paths = graph.selectAll('path')
    .data(pie(data));

  // Handle exit selection
  paths.exit()
    .transition().duration(1250)
    .attrTween('d', arcTweenExit)
    .remove();

  // Handle DOM path updates
  paths.attr('d', arcPath)
    .transition().duration(1250)
    .attrTween('d', arcTweenUpdate)

  paths.enter()
    .append('path')
    .attr('class', 'arc')
    .attr('id', d => d.data.id)
    // .attr('d', arcPath)      // After adding the transition, the starting position can be removed
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    .attr('fill', d => color(d.data.title))
    .each(function(d){ this._current = d }) // Used to 'remember' current element position
    .transition().duration(1250)
    .attrTween('d', arcTweenEnter);
};

// Handles enter animations for new elements, including inital render
const arcTweenEnter = (d) => {
  const i = d3.interpolate(d.endAngle, d.startAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// Handles exit animations
const arcTweenExit = (d) => {
  const i = d3.interpolate(d.startAngle, d.endAngle);

  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

// Handles animations for elements that are updated
function arcTweenUpdate(d) {
  // interpolate between the two objects
  const i = d3.interpolate(this._current, d);

  // update current prop with new updated data
  this._current = i(1);

  return function(t) {
    return arcPath(i(t));
  };
}
