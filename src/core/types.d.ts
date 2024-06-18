export type ID = string;

export type Path = { id: string; from: Point; to: Point; [key: string]: any };

export interface Point {
  x: number;
  y: number;
}

// export interface Edge {
//   id: ID;
//   source: ID;
//   target: ID;
// }
