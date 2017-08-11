// import * as select from 'd3-selection';
// import {cluster, hierarchy, stratify} from 'd3-hierarchy';
// import {zoom} from 'd3-zoom';
//
// const svg = select('svg'),
//   width = +svg.attr('width'),
//   height = +svg.attr('height'),
//   g = svg.append('g').attr('transform', 'translate(40,0)');
//
// const tree = cluster()
//   .size([height, width]);
//
// const stratify = stratify()
//   .parentId(function (d) {
//     return d.id.substring(0, d.id.lastIndexOf('.'));
//   });
//
// const treeData = {
//   'name': 'first',
//   'children': [
//     {
//       'name': 'second',
//       'children': [
//         {
//           'name': 'three',
//           'children': [
//             {
//               'name': 'co-docker-deploy-image-dvm',
//               'children': [
//
//
//                 {
//                   'name': 'ffffff1',
//                 },
//                 {
//                   'name': 'ffffff2',
//                 },
//               ],
//             },
//           ],
//         },
//       ]
//     },
//   ]
// };
//
// const root = hierarchy(treeData, function (d) {
//   return d.children;
// });
//
// root.x0 = height / 2;
// root.y0 = 0;
//
// tree(root);
//
// const link = g.selectAll('.link')
//   .data(root.descendants().slice(1))
//   .enter().append('path')
//   .attr('class', 'link')
//   .attr('d', function (d) {
//     return 'M' + d.y + ',' + d.x
//       + 'C' + (d.parent.y + 100) + ',' + d.x
//       + ' ' + (d.parent.y + 100) + ',' + d.parent.x
//       + ' ' + d.parent.y + ',' + d.parent.x;
//   });
//
// const node = g.selectAll('.node')
//   .data(root.descendants())
//   .enter().append('g')
//   .attr('class', function (d) {
//     return 'node' + (d.children ? ' node--internal' : ' node--leaf');
//   })
//   .attr('transform', function (d) {
//     return 'translate(' + d.y + ',' + d.x + ')';
//   });
//
// node.append('circle')
//   .attr('r', 2.5);
//
// node.append('text')
//   .attr('dy', 3)
//   .attr('x', function (d) {
//     return d.children ? -8 : 8;
//   })
//   .attr('transform', function (d) {
//     return 'rotate(-40)';
//   })
//   .style('text-anchor', function (d) {
//     return d.children ? 'end' : 'start';
//   })
//   .text(function (d) {
//     return d.data.name;
//   });
//
// svg.append('rect')
//   .attr('width', width)
//   .attr('height', height)
//   .style('fill', 'none')
//   .style('pointer-events', 'all')
//   .call(zoom()
//     .scaleExtent([1 / 2, 4])
//     .on('zoom', zoomed));
//
// function zoomed() {
//   g.attr('transform', zoom.transform);
// }
//
