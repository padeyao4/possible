import { FunctionComponent } from 'react';
import { NavLink, useModel } from 'umi';
import './index.less';

interface LayoutProps {}

const Layout: FunctionComponent<LayoutProps> = (props) => {
  const { projects } = useModel('project');

  return (
    <>
      <section className="main">
        <div className="side">
          <div>
            <NavLink to="/today" className="button">
              我的一天
            </NavLink>
            <NavLink to="/life" className="button">
              生活规划
            </NavLink>
            <hr />
            <div className="project-list">
              {projects.map((project, idx) => {
                return (
                  <NavLink
                    to={`/project/:${project}`}
                    className="button"
                    activeClassName="active"
                    key={idx}
                  >
                    {project.title}
                  </NavLink>
                );
              })}
            </div>
            <hr />
          </div>
          <NavLink to="/create" className="button" activeClassName="active">
            新建项目
          </NavLink>
        </div>
        <div>{props.children}</div>
      </section>
    </>
  );
};

export default Layout;
