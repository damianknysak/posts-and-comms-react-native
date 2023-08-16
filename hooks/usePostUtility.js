import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
const PostUtilityContext = createContext({});

export const PostUtilityProvider = ({ children }) => {
  const { API_URI, token, user } = useAuth();

  const getResponse = async (uri, method, requestData = null) => {
    const response = await fetch(uri, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Connection: "keep-alive",
        Authorization: `Bearer ${token}`,
      },
      body: requestData && JSON.stringify(requestData),
    });

    return response;
  };

  const getPosts = async (
    postsList,
    setPostsList,
    setPostsLoading,
    setPaginationLinks,
    uri = `${API_URI}/posts`,
    firstLoad = true
  ) => {
    try {
      setPostsLoading(true);
      console.log("getPosts");
      const response = await getResponse(uri, "GET");

      if (response.status == 429) {
        console.log("Too many requests");
        setPostsList(postsList);
        setPostsLoading(false);
        return;
      }
      const responseJson = await response.json();

      if (responseJson.links) {
        setPaginationLinks(responseJson.links);
      } else {
        setPaginationLinks(null);
      }

      const posts = responseJson.data;
      firstLoad ? setPostsList(posts) : setPostsList([...postsList, ...posts]);

      setPostsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const addLikeToPost = async (postId, reaction) => {
    try {
      const uri = `${API_URI}/posts/${postId}/like`;
      const response = await getResponse(uri, "POST", { reaction: reaction });

      if (response.ok) {
        console.log("Like added");
        return true;
      } else {
        console.log("Like add fail");
        console.log(response.status);
        return false;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const dislikePost = async (postId) => {
    try {
      const uri = `${API_URI}/posts/${postId}/dislike`;
      const response = await getResponse(uri, "DELETE");

      if (response.status == 200) {
        console.log("Disliked Post");
        return true;
      } else {
        console.log("Failed disliking post");
        console.log(response.status);
        return false;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const checkIfUserLikedPosts = async (postId) => {
    try {
      const uri = `${API_URI}/likedposts?userId[eq]=${user.id}&postId[eq]=${postId}`;

      const response = await getResponse(uri, "GET");
      const responseJson = await response.json();
      if (responseJson && responseJson.data && responseJson.data.length > 0) {
        return responseJson.data[0].reaction;
      } else {
        return null;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getPost = async (setPost, setPostLoading, postId) => {
    try {
      setPostLoading(true);
      console.log("getPost");
      const uri = `${API_URI}/posts/${postId}`;
      const response = await getResponse(uri, "GET");
      const responseJson = await response.json();

      const posts = responseJson.data;
      setPost(posts);

      setPostLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const addPost = async (title, slug, image) => {
    try {
      console.log(image);
      let uploadData = new FormData();
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "multipart/form-data");
      myHeaders.append("Authorization", `Bearer ${token}`);

      uploadData.append("image", {
        type: "image/jpeg",
        uri: image,
        name: "upload.jpg",
      });
      uploadData.append("title", title);
      uploadData.append("slug", slug);

      const response = await fetch(`${API_URI}/posts/add`, {
        method: "POST",
        headers: myHeaders,
        body: uploadData,
      });
      const data = await response.json();
      return response.status;
    } catch (e) {
      console.error(e);
    }
  };

  const deletePost = async (postId) => {
    try {
      const uri = `${API_URI}/posts/delete/${postId}`;

      const response = await getResponse(uri, "DELETE");
      if (response.status == 200) {
        console.log("Deleted Post");
      } else {
        console.log("Failed deleting post");
        console.log(response.status);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editPost = async (postId, title, slug, image) => {
    try {
      console.log(image);
      let uploadData = new FormData();
      let myHeaders = new Headers();
      myHeaders.append("Content-Type", "multipart/form-data");
      myHeaders.append("Authorization", `Bearer ${token}`);
      if (image) {
        uploadData.append("image", {
          type: "image/jpeg",
          uri: image,
          name: "upload.jpg",
        });
      }

      uploadData.append("title", title);
      uploadData.append("slug", slug);

      const response = await fetch(`${API_URI}/posts/edit/${postId}`, {
        method: "POST",
        headers: myHeaders,
        body: uploadData,
      });
      console.log(JSON.stringify(response));
      const data = await response.json();
      return response.status;
    } catch (e) {
      console.error(e);
    }
  };

  const addComment = async (postId, comment) => {
    try {
      const uri = `${API_URI}/posts/${postId}/comment`;
      const response = await getResponse(uri, "POST", { comment: comment });

      if (response.status == 201) {
        console.log("Success Adding Comment");
      } else {
        console.log("Something went wrong adding comment");
        console.log(response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getComments = async (
    postId,
    commentsList,
    setCommentsList,
    setCommsLoading,
    setPaginationLinks,
    uri = `${API_URI}/comments?postId[eq]=${postId}`,
    firstLoad = true
  ) => {
    try {
      setCommsLoading(true);

      const response = await getResponse(uri, "GET");
      const responseJson = await response.json();

      setPaginationLinks(responseJson.links);

      const comments = responseJson.data;
      firstLoad
        ? setCommentsList(comments)
        : setCommentsList([...commentsList, ...comments]);
      setCommsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const uri = `${API_URI}/posts/remove-comment/${commentId}`;

      const response = await getResponse(uri, "DELETE");

      if (response.ok) {
        console.log("Success deleting Comment");
        return true;
      } else {
        console.log("Something went wrong deleting Comment");
        console.log(response);
        return false;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const editComment = async (commentId, postId, authorId, comment) => {
    try {
      const uri = `${API_URI}/posts/edit-comment/${commentId}`;
      const response = await getResponse(uri, "PUT", {
        comment: comment,
        authorId: authorId,
        postId: postId,
      });

      if (response.ok) {
        console.log("Success editing Comment");
        return true;
      } else {
        console.log("Something went wrong editing Comment");
        console.log(response);
        return false;
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PostUtilityContext.Provider
      value={{
        getPosts,
        getPost,
        addPost,
        deletePost,
        editPost,
        addLikeToPost,
        dislikePost,
        checkIfUserLikedPosts,
        addComment,
        getComments,
        deleteComment,
        editComment,
      }}
    >
      {children}
    </PostUtilityContext.Provider>
  );
};

export default function usePostUtility() {
  return useContext(PostUtilityContext);
}
