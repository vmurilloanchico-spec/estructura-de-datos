export interface City { id: string; name: string }
export interface Person { id: string; name: string; age: number; cityId: string }
export interface Friendship { source: string; target: string }
export interface Network { cities: City[]; people: Person[]; friendships: Friendship[] }

export const initialNetwork: Network = {
  cities: [{id:'c1',name:'Cali'},{id:'c2',name:'Bogotá'},{id:'c3',name:'Medellín'}],
  people: [
    {id:'p1',name:'Ana',age:21,cityId:'c1'}, {id:'p2',name:'Mateo',age:24,cityId:'c1'},
    {id:'p3',name:'Sara',age:20,cityId:'c2'}, {id:'p4',name:'Daniel',age:23,cityId:'c3'}
  ],
  friendships: [{source:'p1',target:'p3'},{source:'p3',target:'p4'},{source:'p1',target:'p2'}]
};
