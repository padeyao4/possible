export type ID = string;

export interface Point {
  x: number;
  y: number;
}

export type Path = {
  id: ID;
  from: Point;
  to: Point;
};
