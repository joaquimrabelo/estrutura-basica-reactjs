import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';
import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  open_issues: number;
  stargazers_count: number;
  forks: number;
}

interface Issue {
  id: number;
  title: string;
  user: {
    login: string;
  };
  html_url: string;
}

const Repository: React.FC = () => {
  const { params } = useRouteMatch<RepositoryParams>();
  const repositoryName = params.repository;
  const [repository, setRepository] = useState<Repository>(() => {
    const storagedRepositories = localStorage.getItem(
      '@GithubExplorer:respositories',
    );
    if (storagedRepositories) {
      const repositories = JSON.parse(storagedRepositories);
      return repositories.find(
        (repo: Repository) => repo.full_name === repositoryName,
      );
    }
    return {};
  });

  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    api.get(`repos/${repositoryName}/issues`).then((response) => {
      setIssues(response.data);
    });
  }, [repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>
      <RepositoryInfo>
        <header>
          <img src={repository.owner.avatar_url} alt={repository.full_name} />
          <div>
            <strong>{repository.full_name}</strong>
            <p>{repository.description}</p>
          </div>
        </header>
        <ul>
          <li>
            <strong>{repository.stargazers_count}</strong>
            <span>Stars</span>
          </li>
          <li>
            <strong>{repository.forks}</strong>
            <span>Forks</span>
          </li>
          <li>
            <strong>{repository.open_issues}</strong>
            <span>Issues Abertas</span>
          </li>
        </ul>
      </RepositoryInfo>

      <Issues>
        {issues.map((issue) => (
          <a key={issue.id} target="_blank" href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;
