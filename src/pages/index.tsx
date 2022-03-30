import Body from '@/components/Body';
import Header from '@/components/Header';
import React, { useState } from 'react';
import { Model, Project } from '../models/model';
import styles from './index.less';


export default function () {

  const [model, setModel] = useState(new Model())

  const handleProjectClick = () => {
    const project = new Project()
    project.actions = []
    project.color = "skyblue"
    project.start = model.current
    project.end = model.current
    project.goal = "新建项目" + (model.projects.length + 1)
    model.projects = [...model.projects, project]
    setModel({ ...model })
  }

  const handleItemClick = (index: number) => {
    model.projectIndex = index
    console.log(index)
    console.log(model.projects[model.projectIndex])
    setModel({ ...model })
  }

  return (
    <section style={{
      display: 'grid',
      gridTemplateColumns: '280px auto'
    }}>
      <div className={styles.leftSide}>
        <div>
          <div>
            <div className={styles.myButton}>
              我的一天
            </div>
            <div className={styles.myButton}>
              任务总览
            </div>
          </div>
          <hr className={styles.myHr} />
          <div className={styles.scrollPane}>
            {model.projects?.map((project, index) => {
              return <div className={styles.myButton} key={index} onClick={() => handleItemClick(index)}>{project.goal}</div>
            })}
          </div>
          <hr className={styles.myHr} />
        </div>
        <div >
          <div className={styles.myButton} onClick={handleProjectClick}>
            新建项目
          </div>
        </div>
      </div>
      <div className={styles.bodyScrollPane}>
        <Header model={model} />
        <Body model={model} />
      </div>
    </section >
  );
}
