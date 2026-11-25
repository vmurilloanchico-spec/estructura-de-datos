import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { createElement } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Graph } from 'react-d3-graph';
import type { Network } from './model';

@Component({ selector:'network-graph', standalone:true, template:'<div #host class="graph-host"></div>' })
export class NetworkGraph implements AfterViewInit, OnChanges, OnDestroy {
  @Input({required:true}) network!: Network;
  @ViewChild('host') host?: ElementRef<HTMLDivElement>;

  ngAfterViewInit() { this.draw(); }
  ngOnChanges() { if (this.host) this.draw(); }
  ngOnDestroy() { if (this.host) unmountComponentAtNode(this.host.nativeElement); }

  private draw() {
    const {cities, people, friendships} = this.network;
    const nodes = [];
    let height = 230;
    for (const [index, city] of cities.entries()) {
      const x = 48 + index * 220;
      nodes.push({id:city.id, name:city.name, x, y:40, color:'#bd591c', symbolType:'diamond'});
      const residents = people.filter(person => person.cityId === city.id);
      for (const [row, person] of residents.entries()) {
        const y = 120 + row * 74;
        nodes.push({id:person.id, name:person.name, x:x + (row % 2 ? 45 : 8), y, color:'#17685a', symbolType:'circle'});
        height = Math.max(height, y + 50);
      }
    }
    const links = [
      ...people.map(p => ({source:p.cityId, target:p.id, color:'#cd935e'})),
      ...friendships.map(edge => ({...edge, color:'#538e88'}))
    ];
    const width = Math.max(620, cities.length * 220 + 110);
    render(createElement(Graph, {
      id:'friend-network', data:{nodes, links}, config:{
        width, height, staticGraphWithDragAndDrop:true, directed:false,
        node:{size:310, labelProperty:'name', fontSize:13, fontColor:'#163d36'},
        link:{strokeWidth:2}
      }
    }), this.host!.nativeElement);
  }
}
