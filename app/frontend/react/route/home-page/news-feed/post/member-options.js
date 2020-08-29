import React, { useState, useContext, useEffect } from "react";
import { getConfig } from "../../../../config/config";
import { AppContext } from "../../../../store/app-store";
import LoadingIcon from "../../../../layout/icon/loading-icon";
import "./options.css";

const MemberOptions = ({ post }) => {
  const config = getConfig("options");
  const { Request, updatePost, updateProgress, popMessage } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  const handleJoinAndCancelRequest = async () => {
    const url = post.requested ? config.cancel.url : config.join.url;
    const method = post.requested ? config.cancel.method : config.join.method;
    try {
      setLoading(true);
      await Request.send(null, url + post.id, method);
      post.requested = !post.requested;
      setLoading(false);
      updatePost(post);
      updateProgress({ error: "" });
    } catch (error) {
      setLoading(false);
      updateProgress({ error: error.message });
    }
  };
  const handleReportPost = async () => {
    try {
      await Request.send(null, config.report.url + post.id, config.report.method);
      popMessage("Post has been reported");
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };
  const handleCopyPostLink = async () => {
    try {
      await navigator.clipboard.writeText(config.share.url + post.id);
      popMessage("Copied post link");
    } catch (error) {
      updateProgress({ loading: false, error: config.share.error });
    }
  };
  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (!/post dots-icon/gim.test(e.target.className)) setShowList(false);
    });
  }, []);

  return (
    <div className="post options-wrapper">
      <img
        onClick={() => setShowList(!showList)}
        src="/image/dots.svg"
        alt="Post options button"
        className="post dots-icon no-line"
      />

      {post.requested !== undefined && (
        <button className="post join-button" onClick={handleJoinAndCancelRequest}>
          {loading && <LoadingIcon />} {post.requested ? "Cancel" : "Join"}
        </button>
      )}

      {showList && (
        <div className="post options-list" role="list" title="Options list" tabindex="0">
          <button
            onClick={handleReportPost}
            type="button"
            className="post options-item top"
            title="Report post">
            Report
          </button>
          <button
            onClick={handleCopyPostLink}
            type="button"
            className="post options-item"
            title="Share post or Copy the post link">
            Share
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberOptions;
