import Body from '@/components/Body';
import Header from '@/components/Header';
import { useModel } from 'umi';
import { Project } from '../core/model';
import './index.less';

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

  return (
    <section className="main">
      <div className="side">
        <div>
          <div>
            <div className="button" onClick={() => setIndex(-2)}>
              我的一天
            </div>
            <div className="button" onClick={() => setIndex(-1)}>
              任务总览
            </div>
          </div>
          <hr />
          <div className="scrollPane">
            {projects.map((project, index) => {
              return (
                <div
                  className="button"
                  key={index}
                  onClick={() => setIndex(index)}
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
        <Header />
        <Body />
        <div className="footer">
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
