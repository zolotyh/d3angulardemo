import {Component, ElementRef, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseType, event, select, Selection} from 'd3-selection';
import {cluster, hierarchy} from 'd3-hierarchy';
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

    svg.attr('width', 500);
    svg.attr('height', 500);

    const g = svg.append('g').attr('transform', 'translate(40,0)');

    const tree = cluster()
      .size([this.height, this.width]);

    const root = <any>hierarchy(treeData, function (d: any) {
      return d.children;
    });

    root.x0 = this.height / 2;
    root.y0 = 0;

    tree(root);
    this.createLink(g, root);
    this.cleateNode(g, root);

    const rect = svg.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(zoom()
        .scaleExtent([1 / 2, 4])
        .on('zoom', zoomed));


    function zoomed() {
      g.attr('transform', event.transform);
    }
  }

  private cleateNode(g: Selection<BaseType, any, HTMLElement, any>, root: any) {
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', function (d: any) {
        return 'node' + (d.children ? ' node--internal' : ' node--leaf');
      })
      .attr('transform', function (d: any) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });
    node.append('circle')
      .attr('r', 2.5);
    node.append('text')
      .attr('dy', 3)
      .attr('x', function (d: any) {
        return d.children ? -8 : 8;
      })
      .attr('transform', function () {
        return 'rotate(-40)';
      })
      .style('text-anchor', function (d: any) {
        return d.children ? 'end' : 'start';
      })
      .text(function (d: any) {
        return d.data.name;
      });
  }

  private createLink(g: Selection<BaseType, any, HTMLElement, any>, root: any) {
    const link = g.selectAll('.link')
      .data(root.descendants().slice(1))
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', function (d: any) {
        return 'M' + d.y + ',' + d.x
          + 'C' + (d.parent.y + 100) + ',' + d.x
          + ' ' + (d.parent.y + 100) + ',' + d.parent.x
          + ' ' + d.parent.y + ',' + d.parent.x;
      });
  }
}

