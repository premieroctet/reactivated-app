import React, { useEffect, useState } from "react";
import apiClient from "../../clients/api";
import { useAuth } from "../../contexts/auth-context";
import jwt_decode from "jwt-decode";
import { formatDistance, subDays } from "date-fns";
import fromUnixTime from "date-fns/fromUnixTime";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./RepoContent.scss";

function RepoContent(props) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("green");

  const { token } = useAuth();
  const code = jwt_decode(token);
  const { userId } = code;
  const { id } = props.match.params;

  const loadRepository = async () => {
    setLoading(true);
    const response = await apiClient.get(`/users/${userId}/repositories/${id}`);
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRepository();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="repo-content">
      {loading ? (
        <p className="repo-title">Loading...</p>
      ) : (
        <>
          <Link to="/">
            <Button size="large" icon="github" type="primary">
              Return to repo list
            </Button>
          </Link>

          <div>
            <a href={data.repoUrl}>
              <img className="repo-icon" src={data.repoImg} alt="repo-icon" />
            </a>
            <p className="repo-title">{data.name}</p>

            <p className="repo-author">
              by <b>{data.author}</b>
            </p>
            <p className="repo-updated">
              <span
                style={{ verticalAlign: "middle" }}
                role="img"
                aria-label="light"
              >
                ⏱
              </span>{" "}
              {formatDistance(
                subDays(new Date(fromUnixTime(data.createdAt)), 3),
                new Date()
              )}{" "}
              ago
            </p>
          </div>
          {data.dependencies && (
            <div className="package-list">
              <p className="name-content">Dependency</p>
              <p className="required-content">Required</p>
              <p className="stable-content">Stable</p>
              <p className="latest-content">Latest</p>
              <p className="status-content">Status</p>
              {Object.keys(data.dependencies).map(key => {
                return (
                  <div className="package-item" key={key}>
                    <p className="package-name">{key}</p>
                    <p className="package-required">
                      {data.dependencies[key].required}
                    </p>
                    <p className="package-stable">
                      {data.dependencies[key].stable}
                    </p>
                    <p className="package-latest">
                      {data.dependencies[key].latest}
                    </p>
                    <div className={`package-status ${status}`}></div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RepoContent;
