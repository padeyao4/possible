export interface LinkedNode<T> {
  pre: LinkedNode<T> | null
  next: LinkedNode<T> | null
  value: T
}

export interface Value {
  index: number
  data: number
}

/**
 * [1,10]
 */
export class SegmentManage {}
