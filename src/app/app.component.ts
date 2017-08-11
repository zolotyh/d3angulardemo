import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseType, event, select, Selection} from 'd3-selection';
import {cluster, hierarchy, HierarchyCircularNode} from 'd3-hierarchy';
import {zoom} from 'd3-zoom';
import treeData from './data';


@Component({
  selector: 'app-root',
  template: '<svg />',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  private parentNativeElement: any;
  private width = 500;
  private height = 500;
  private svg;


  constructor(element: ElementRef) {
    this.parentNativeElement = element.nativeElement;
  }

  ngOnDestroy(): void {
    this.svg.remove();
  }

  ngOnInit(): void {
    const svg = this.svg = this.setSvg();
    const root = this.createHierarchy();

    const zoomElem = this.createZoomElem(svg);
    this.drawDiagram(zoomElem, this.initViewTree(root));

    this.enableZoom(svg, zoomElem);
  }

  private createZoomElem(svg: Selection<BaseType, any, HTMLElement, any>) {
    return svg.append('g')
      .attr('transform', 'translate(40,0)');
  }

  private initViewTree(root: any) {
    const viewTree = cluster().size([this.height, this.width]);
    viewTree(root);
  }

  private setSvg() {
    const rootElem = select(this.parentNativeElement);
    const svg = rootElem.select('svg');
    this.setSize(svg);
    return svg;
  }

  private enableZoom(svg: Selection<BaseType, any, HTMLElement, any>, zoomElem: Selection<BaseType, any, HTMLElement, any>) {
    svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(zoom()
        .scaleExtent([1 / 2, 4])
        .on('zoom', () => {
          zoomElem.attr('transform', event.transform);
        }));
  }

  private createHierarchy() {
    return <any>hierarchy(treeData, function (d: any) {
      return d.children;
    });
  }

  private setSize(svg: Selection<BaseType, any, HTMLElement, any>) {
    svg.attr('width', this.width);
    svg.attr('height', this.height);
  }

  private drawDiagram(selection: Selection<BaseType, any, HTMLElement, any>, root: any) {
    this.addPaths(selection, root);

    const nodesList = this.createNodeList(selection, root);
    
    this.addClasses(nodesList);
    this.addCircle(nodesList);
    this.addText(nodesList);
  }

  private createNodeList(selection: Selection<BaseType, any, HTMLElement, any>, root: any) {
    return selection.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g');
  }

  private addClasses(selection: Selection<BaseType, any, BaseType, any>) {
    selection
      .attr('class', function (d: SVGSVGElement) {
        return 'node' + (d.children ? ' node--internal' : ' node--leaf');
      })
      .attr('transform', function (d: SVGSVGElement) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });
  }

  private addText(selection: Selection<BaseType, any, BaseType, any>) {
    selection.append('text')

      .attr('dy', 3)
      .attr('x', function (d: SVGSVGElement) {
        return d.children ? -8 : 8;
      })
      .attr('transform', () => 'rotate(-40)')

      .style('text-anchor', (d: SVGSVGElement) => d.children ? 'end' : 'start')

      .text(function (d: any) {
        return d.data.name;
      });
  }

  private addCircle(selection: Selection<BaseType, any, BaseType, any>) {
    selection.append('circle')
      .attr('r', 2.5);
  }

  private addPaths(selection: Selection<BaseType, any, HTMLElement, any>, root: any) {
    selection.selectAll('.link')
      .data(root.descendants().slice(1))
      .enter().append('path')

      .attr('class', 'link')
      .attr('d', function (d: HierarchyCircularNode<SVGLineElement>) {
        return 'M' + d.y + ',' + d.x
          + 'C' + (d.parent.y + 100) + ',' + d.x
          + ' ' + (d.parent.y + 100) + ',' + d.parent.x
          + ' ' + d.parent.y + ',' + d.parent.x;
      });
  }
}

