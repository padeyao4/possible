import { Project } from '@/core/model';
import { useCallback, useState } from 'react';

export default () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const getProjectByIndex = useCallback(() => {
    if (projects.length == 0 || index == null) {
      return null;
    } else {
      return projects[index];
    }
  }, [projects, index]);

  return {
    projects,
    setProjects,
    index,
    setIndex,
    getProjectByIndex,
  };
};
