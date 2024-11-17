import React, { useState } from "react";
import { communityClickedEmitter } from "./newCommunity.js";
import axios from 'axios';

export const AddNewCommentComponent = ({ post, replyToPost, commentRepliedTo, comment, user }) => {
  console.log("\n AddNewCommentComponent: ", user, "\n");
  const [formInputs, setFormInputs] = useState({
    content: comment ? comment.content : '',
    commentedBy: user.displayName,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };
  const validateInputs = () => {
    const { content } = formInputs;
    if (content.length === 0 || content.length > 500) {
      window.alert("The comment content must be between 1 and 500 characters.");
      return false;
    }
    return true;
  };
  const submitComment = async () => {
    if (!validateInputs()) return;
    try {
      const newComment = {
        content: formInputs.content,
        commentedBy: formInputs.commentedBy,
      };
      console.log('Attempting to submit comment:', newComment);
      console.log('Replying to post:', replyToPost);
      console.log('Post ID:', post._id);
      const comment = await axios.post('http://localhost:8000/comments', newComment);
      let add;
      console.log('Comment ID:', comment.data._id);
      console.log("REPLIED ID:", commentRepliedTo);
      if (replyToPost) {
        console.log("COMMENTING");
        add = await axios.put(`http://localhost:8000/posts/${post._id}/comments`, {
          commentID: comment.data._id
      });
      } else {
        console.log("REPLYING");
        console.log("REPLIED ID:", commentRepliedTo._id);
        add = await axios.put(`http://localhost:8000/comments/${commentRepliedTo._id}/replies`, {
          commentID: comment.data._id
      });
      }
      console.log("New comment added:", comment.data);
      console.log("New comment added to post:", add.data);
      communityClickedEmitter.emit("communityClicked", -6, "", post, false);
    } catch (error) {
      console.error("Error adding comment:", error.response ? error.response.data : error.message);
      window.alert("An error occurred while adding the comment. Please try again.");
    }
  };
  return (
    <form id="new-comment-page-stuff">
      <div className="form-div">
        <label htmlFor="new-comment-content-box">Comment Content: </label>
        <textarea 
          name="content"
          placeholder="Write your comment here..." 
          id="new-comment-content-box"
          value={formInputs.content} 
          onChange={handleInputChange}
        ></textarea>
      </div>
      <button type="button" id="new-comment-submit-button" onClick={submitComment}>
        Submit Comment
      </button>
    </form>
  );
};