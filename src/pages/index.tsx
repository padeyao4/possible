import Body from '@/components/Body';
import Header from '@/components/Header';
import { useModel } from 'umi';
import { Project } from '../core/model';
import styles from './index.less';

export default function () {
  const { projects, setProjects, setIndex } = useModel('project');
  const { yesterday, tomorrow, today } = useModel('cusor');

  const handleProjectClick = () => {
    const project = new Project();
    project.actions = [];
    project.color = 'skyblue';
    project.start = new Date();
    project.end = new Date();
    project.goal = '新建项目' + (projects.length + 1);
    setProjects([...projects, project]);
  };

  const handleItemClick = (index: number) => {
    setIndex(index);
  };

  return (
    <section className={styles.main}>
      <div className={styles.side}>
        <div>
          <div>
            <div className={styles.myButton}>我的一天</div>
            <div className={styles.myButton}>任务总览</div>
          </div>
          <hr className={styles.myHr} />
          <div className={styles.scrollPane}>
            {projects.map((project, index) => {
              return (
                <div
                  className={styles.myButton}
                  key={index}
                  onClick={() => handleItemClick(index)}
                >
                  {project.goal}
                </div>
              );
            })}
          </div>
          <hr className={styles.myHr} />
        </div>
        <div>
          <div className={styles.myButton} onClick={handleProjectClick}>
            新建项目
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <Header />
        <Body />
        <div className={styles.footer}>
          <div onClick={today}>回到今天</div>
          <div onClick={yesterday}>左</div>
          <input type="range" max="100" min="1" defaultValue="50"></input>
          <div onClick={tomorrow}>右</div>
          <div>日期选择</div>
        </div>
      </div>
    </section>
  );
}
