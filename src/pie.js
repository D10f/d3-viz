import * as d3 from 'd3';
import { removeExp } from './index';

const LEGEND_MARGINS = 150;

const dimensions = { height: 300, width: 300, radius: 150 };
const center = { x: dimensions.width / 2 + 5, y: dimensions.height / 2 + 5};

// Select an element from the DOM and append the SVG
const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dimensions.width + LEGEND_MARGINS)
  .attr('height', dimensions.height + LEGEND_MARGINS)

// Group information together and move it into the center of the SVG el
const graph = svg.append('g')
  .attr('transform', `translate(${center.x}, ${center.y})`)

// Takes some data and returns a series of start/end angle values based on it.
const pie = d3.pie()
  .sort(null)
  .value(d => d.amount)

// obtain the SVG path points based on the angles array;
const arcPath = d3.arc()
  .outerRadius(dimensions.radius)
  .innerRadius(dimensions.radius / 2)

// Create an ordinal scale to map colors to our expenses (later, by category)
const color = d3.scaleOrdinal(d3['schemeSet3']);

export const drawPieChart = (data) => {

  color.domain(data.map(d => d.category))

  // extract angle info based on the data
  const angles = pie(data);

  // join data to the path elements
  const paths = graph.selectAll('path')
    .data(angles)

  // Handle exit selection (elements to be removed)
  paths.exit()
    .transition().duration(750)
    .attrTween('d', arcTweenExit)
    .remove()

  // Handle updates (existing elements)
  paths.attr('d', arcPath)
    // .attr('fill', d => color(d.data.category))
    .transition().duration(750)
    .attrTween('d', arcTweenUpdate)

  // Handle enter selection (new elements to be added)
  paths.enter()
    .append('path')
    .attr('stroke', '#444')
    .attr('fill', d => color(d.data.category))
    .attr('stroke-width', 2)
    .each(function(d) { this._current = d })
    .transition().duration(750)
    .attrTween('d', arcTweenEnter)

  // add events
  graph.selectAll('path')
    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut)
    .on('click', handleClick)
};

const handleMouseOver = (d, i, n) => {
  // Selects the element triggering this event to gain access to d3 methods on it
  d3.select(n[i])
    .transition('changeFillOnHover').duration(100)
    .attr('opacity', '0.75')
};

const handleMouseOut = (d, i, n) => {
  d3.select(n[i])
    .transition('changeFillOnHover').duration(100)
    .attr('opacity', '1')
    // .attr('opacity', color(d.data.category))
};

const handleClick = d => {
  const id = d.data.id;
  removeExp(id);
};

const arcTweenEnter = (d) => {
  const i = d3.interpolate(d.endAngle, d.startAngle);
  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};
const arcTweenExit = (d) => {
  const i = d3.interpolate(d.startAngle, d.endAngle);
  return function(t) {
    d.startAngle = i(t);
    return arcPath(d);
  };
};
function arcTweenUpdate (d) {
  const i = d3.interpolate(this._current, d);
  this._current = i(1);
  return function(t) {
    return arcPath(i(t));
  };
};
