import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseType, event, select, Selection} from 'd3-selection';
import {cluster, hierarchy, HierarchyCircularNode} from 'd3-hierarchy';
import {zoom} from 'd3-zoom';


const treeData = {
  'name': 'first',
  'children': [
    {
      'name': 'second',
      'children': [
        {
          'name': 'three',
          'children': [
            {
              'name': 'co-docker-deploy-image-dvm',
              'children': [


                {
                  'name': 'ffffff1',
                },
                {
                  'name': 'ffffff2',
                },
              ],
            },
          ],
        },
      ]
    },
    {
      'name': 'second',
      'children': [
        {
          'name': 'three',
          'children': [
            {
              'name': 'co-docker-deploy-image-dvm',
              'children': [


                {
                  'name': 'ffffff1',
                },
                {
                  'name': 'ffffff2',
                },
              ],
            },
          ],
        },
      ]
    },
  ]
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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
    const rootElem = select(this.parentNativeElement);
    const svg = this.svg = rootElem.select('svg');

    this.setSize(svg);


    const root = this.createCluster();
    this.enableZoom(svg, root);


  }

  private enableZoom(svg: Selection<BaseType, any, HTMLElement, any>, root: any) {
    const g = svg.append('g').attr('transform', 'translate(40,0)');

    const zoomed = () => {
      g.attr('transform', event.transform);
    };

    this.addPaths(g, root);
    this.createnodeSelection(g, root);

    const rect = svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(zoom()
        .scaleExtent([1 / 2, 4])
        .on('zoom', zoomed));
  }

  private createCluster() {
    const clusterImpl = cluster()
      .size([this.height, this.width]);

    const root = <any>hierarchy(treeData, function (d: any) {
      return d.children;
    });

    root.x0 = this.height / 2;
    root.y0 = 100;

    clusterImpl(root);
    return root;
  }

  private setSize(svg: Selection<BaseType, any, HTMLElement, any>) {
    svg.attr('width', this.width);
    svg.attr('height', this.height);
  }

  private createnodeSelection(g: Selection<BaseType, any, HTMLElement, any>, root: any) {

    const nodeSelection = g.selectAll('.node').data(root.descendants())
      .enter()
      .append('g');

    this.addClasses(nodeSelection);
    this.addCircle(nodeSelection);
    this.addText(nodeSelection);
  }

  private addClasses(nodeSelection: Selection<BaseType, any, BaseType, any>) {
    nodeSelection
      .attr('class', function (d: SVGSVGElement) {
        return 'node' + (d.children ? ' node--internal' : ' node--leaf');
      })
      .attr('transform', function (d: SVGSVGElement) {
        console.log(d);
        return 'translate(' + d.y + ',' + d.x + ')';
      });
  }

  private addText(nodeSelection: Selection<BaseType, any, BaseType, any>) {
    nodeSelection.append('text')
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

  private addCircle(nodeSelection: Selection<BaseType, any, BaseType, any>) {
    nodeSelection.append('circle')
      .attr('r', 2.5);
  }

  private addPaths(g: Selection<BaseType, any, HTMLElement, any>, root: any) {
    g.selectAll('.link')
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

