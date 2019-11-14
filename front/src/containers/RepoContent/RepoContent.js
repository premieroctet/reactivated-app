import React, { useEffect, useState } from "react";
import githubClient from "../../clients/github";
import { formatDistance, subDays } from "date-fns";
import "./RepoContent.scss";

function RepoContent(props) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    match: { params }
  } = props;

  const loadRepository = async () => {
    setLoading(true);
    const response = await githubClient.get(
      `/repos/${params.owner}/${params.repo}`
    );
    setData(response.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRepository();

    // eslint-disable-next-line
  }, []);
  console.log(data);
  console.log(data.updated_at);
  return (
    <div className="repo-content">
      {loading ? (
        <p className="repo-title">Loading...</p>
      ) : (
        <>
          <p className="repo-title">{data.name}</p>
          <p className="repo-title">
            {data.updated_at}{" "}
            {/*formatDistance(subDays(new Date(data.updated_at), 3), new Date())*/}
          </p>
        </>
      )}
    </div>
  );
}

export default RepoContent;
