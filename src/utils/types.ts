export interface Plan {
  id: number;
  content: string;
  date: number;
  /**
   * 用来记录计划完成的情况
   */
  record: string;
}

export interface Project {
  id: number;
  title: string;
  detail: string;
  /**
   * 记录最早的计划,(包含)
   */
  start: Date;
  /**
   * 记录最晚的计划,(不包含)
   */
  end: Date;
  color: string;
  plans: Plan[];
}
