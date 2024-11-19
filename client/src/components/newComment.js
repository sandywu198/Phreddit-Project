import React, { useState } from "react";
import { communityClickedEmitter } from "./newCommunity.js";
import { GetCommentThreadsArrayFunction } from "./postSortingFunctions.js";
import axios from 'axios';

export const AddNewCommentComponent = ({ post, replyToPost, commentRepliedTo, comment, user, admin }) => {
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
  const deleteComment = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if(confirmDelete){
      try{
        // delete comment ids in posts and comments
        axios.get("http://localhost:8000/posts").then(postsRes => {
          axios.get("http://localhost:8000/communities").then(communitiesRes => {
            axios.get("http://localhost:8000/comments").then(commentsRes => {
              const commentThreadsArray = GetCommentThreadsArrayFunction(communitiesRes.data, postsRes.data, commentsRes.data, 'All Posts', []);
              console.log("\n commentThreadsArray: ", commentThreadsArray, "\n");
              const commentsToDelete = commentThreadsArray.filter(thread => thread[0].postThreadNode.id === comment.id)[0];
              console.log("\n commentsToDelete: ", commentsToDelete, "\n");
              for(let c = 0; c < commentsToDelete.length; c++){
                console.log("\n deleting... ", commentsToDelete[c].postThreadNode.id, "\n");
                axios.delete(`http://localhost:8000/comments/${commentsToDelete[c].postThreadNode.id}`)
                  .then(response => {
                    console.log('Comment removed:', response.data);
                  })
                  .catch(error => {
                    console.error('Error removing comment:', error.response ? error.response.data : error.message);
                  }); 
                console.log("\n comment deleted \n");
              }
              for(let c = 0; c < commentsToDelete.length; c++){
                const postsToUpdate = postsRes.data.filter(post1 => post1.commentIDs.includes(commentsToDelete[c].postThreadNode.id));
                console.log("\n postsToUpdate: ", postsToUpdate, "\n");
                for(let p = 0; p < postsToUpdate.length; p++){
                  axios.patch(`http://localhost:8000/posts/${postsToUpdate[p].id}/comments/${commentsToDelete[c].postThreadNode.id}`) 
                    .then(response => {
                      console.log('Comment removed:', response.data);
                    })
                    .catch(error => {
                      console.error('Error removing comment:', error.response ? error.response.data : error.message);
                    });
                }
              }
              communityClickedEmitter.emit("communityClicked", -8, "", null, false, null, user, admin);
            })
          })
        })
      } catch (error){
        console.log("\n error: ", error, "\n");
      }
    } else{
      console.log("\n user canceled deleting the comment\n");
    }
  }
  const submitComment = async () => {
    if (!validateInputs()) return;
    try {
      if(comment){
        const updated = {
          content: formInputs.content,
        };
        const response = await axios.patch(`http://localhost:8000/comments/${comment.id}`, updated);
        console.log('Updated Comment:', response.data);
        communityClickedEmitter.emit("communityClicked", -8, "", null, false, null, user, admin);
      } else{
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
      }
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
      <button type="button" id="new-comment-delete-button" onClick={deleteComment}>
        Delete Comment
      </button>
    </form>
  );
};