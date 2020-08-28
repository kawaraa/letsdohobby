import React, { useContext, useState, useEffect } from "react";
import { getConfig } from "../../../../config/config";
import { AppContext } from "../../../../store/app-store";
import "./options.css";

const UserOptions = ({ post }) => {
  const config = getConfig("options");
  const [showOptions, setShowOptions] = useState(false);
  const { Request, updateProgress, removePost, setEditingPost, popMessage } = useContext(AppContext);

  const handleDelete = async () => {
    try {
      if (!window.confirm(config.confirmMessage)) return;
      updateProgress({ loading: true });
      await Request.send(null, config.delete.url + post.id, config.delete.method);
      removePost(post.id);
      updateProgress({ loading: false, error: "" });
    } catch (error) {
      updateProgress({ loading: false, error: error.message });
    }
  };

  const handleCopyPostLink = async () => {
    try {
      await navigator.clipboard.writeText(config.share.url + post.id);
      popMessage("Copied post link");
    } catch (error) {
      updateProgress({ error: config.share.error });
    }
  };

  useEffect(() => {
    window.addEventListener("click", ({ target: { className } }) => {
      if (!/post dots-icon/gim.test(className)) setShowOptions(false);
    });
  }, []);

  return (
    <div className="post options-wrapper">
      <img
        onClick={() => setShowOptions(!showOptions)}
        src="/image/dots.svg"
        alt="Post options button"
        className="post dots-icon no-line"
      />

      {showOptions && (
        <div className="post options-list" role="list" title="Options list" tabindex="0">
          <button
            onClick={() => setEditingPost(post.id)}
            type="button"
            className="post options-item top"
            title="Edit post">
            Edit
          </button>
          <button onClick={handleDelete} className="post options-item" type="button" title="Delete">
            Delete
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

export default UserOptions;
