import React, { useState, useEffect } from "react";
import { formatDistance, subDays } from "date-fns";
import githubClient from "../../clients/github";
import { Button, List, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.scss";

function Home() {
  const [repositories, setRepositories] = useState([]);

  const loadRepository = async () => {
    const response = await githubClient.get("/user/installations");
    const promises = response.data.installations.map(installation => {
      return githubClient.get(
        `/user/installations/${installation.id}/repositories`
      );
    });

    const responses = await axios.all(promises);
    let data = [];

    responses.forEach(item => {
      data = [...data, ...item.data.repositories];
    });
    setRepositories(data);
  };

  useEffect(() => {
    loadRepository();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Button
        href={`https://github.com/apps/${process.env.REACT_APP_GITHUB_APP_NAME}/installations/new`}
        size="large"
        icon="github"
        type="primary"
      >
        Add a new repo
      </Button>

      <Row type="flex" justify="center">
        <Col sm={24} md={14} lg={16}>
          {repositories.length !== 0 ? (
            <List
              className="list-container"
              size="large"
              bordered
              dataSource={repositories}
              renderItem={repository => (
                <Link to={`/repo/${repository.owner.login}/${repository.name}`}>
                  <List.Item>
                    <Row>
                      <Col xs={24} sm={4} md={4} lg={4} xl={4}>
                        <img
                          className="repo-icon"
                          src={repository.owner.avatar_url}
                          alt="repo-icon"
                        />
                      </Col>
                      <Col>
                        <p className="repo-name">{repository.name}</p>
                      </Col>
                      <Col>
                        <p className="repo-author">
                          create by {repository.owner.login}{" "}
                          {formatDistance(
                            subDays(new Date(repository.created_at), 3),
                            new Date()
                          )}{" "}
                          ago
                        </p>
                      </Col>
                    </Row>
                  </List.Item>
                </Link>
              )}
            />
          ) : (
            <p className="loading-message">Loading</p>
          )}
        </Col>
      </Row>
    </>
  );
}

export default Home;
