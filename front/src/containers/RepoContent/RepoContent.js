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
  const [createdAt, setDate] = useState("");
  const { token } = useAuth();
  const code = jwt_decode(token);
  const { userId } = code;

  const loadRepository = async () => {
    setLoading(true);
    const response = await apiClient.get(`/users/${userId}/repositories`);
    setData(response.data[3]);
    setDate(fromUnixTime(response.data[0].createdAt));
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

            <p className="repo-author">by {data.author}</p>
            <p className="repo-updated">
              <span
                style={{ verticalAlign: "middle" }}
                role="img"
                aria-label="light"
              >
                ⏱
              </span>{" "}
              {formatDistance(subDays(new Date(createdAt), 3), new Date())} ago
            </p>
          </div>

          <div className="package-list">
            <p className="package-title">Packagers List :</p>
            {data.dependencies &&
              Object.keys(data.dependencies).map(key => {
                return (
                  <p className="package-name" key={key}>
                    {key}
                  </p>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}

export default RepoContent;
