import { Project } from '@/utils/types';
import { useModel } from 'umi';
import './index.less';
import LifeManage from './LiftManage';
import OneDay from './OneDay';

export default function () {
  const { item, setItem } = useModel('constant');
  const { projects, setProjects } = useModel('project');

  const handleProjectClick = () => {
    const p: Project = {
      id: 1,
      color: '#777',
      detail: 'hello world',
      end: new Date(),
      goal: 'target',
      plans: [],
      start: new Date(),
    };
    setProjects([...projects, p]);
  };

  return (
    <section className="main">
      <div className="side">
        <div>
          <div>
            <div
              className={`button ${item === -2 && 'active'}`}
              onClick={() => setItem(-2)}
            >
              我的一天
            </div>
            <div
              className={`button ${item === -1 && 'active'}`}
              onClick={() => setItem(-1)}
            >
              生活规划
            </div>
          </div>
          <hr />
          <div className="project-list">
            {projects.map((project, idx) => {
              return (
                <div
                  className={`button ${item === idx && 'active'}`}
                  key={idx}
                  onClick={() => setItem(idx)}
                >
                  {project.goal}
                </div>
              );
            })}
          </div>
          <hr />
        </div>
        <div>
          <div className="button" onClick={handleProjectClick}>
            新建项目
          </div>
        </div>
      </div>
      <div className="content">
        {/* todo 是否可以使用link来做 */}
        {item == -2 && <OneDay></OneDay>}
        {item == -1 && <LifeManage />}
        {item == 0 && <div>默认内容</div>}
        {item > 0 && <div>没有内容</div>}
      </div>
    </section>
  );
}
