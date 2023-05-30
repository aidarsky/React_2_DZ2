import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/posts');
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`https://dummyjson.com/posts/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Список постов</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
          <button onClick={() => deletePost(post.id)}>Удалить</button>
          <button onClick={() => navigate(`/posts/${post.id}`)}>Редактировать</button>
        </div>
      ))}
    </div>
  );
};

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const createPost = async () => {
    try {
      const response = await axios.post('https://dummyjson.com/posts', { title, body });
      console.log(response.data);
      navigate('/posts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Создать пост</h1>
      <form onSubmit={(e) => { e.preventDefault(); createPost(); }}>
        <input type="text" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Текст поста" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

const EditPost = ({ postId }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`https://dummyjson.com/posts/${postId}`);
      const { title, body } = response.data;
      setTitle(title);
      setBody(body);
    } catch (error) {
      console.error(error);
    }
  };

  const updatePost = async () => {
    try {
      await axios.put(`https://dummyjson.com/posts/${postId}`, { title, body });
      navigate('/posts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Редактировать пост</h1>
      <form onSubmit={(e) => { e.preventDefault(); updatePost(); }}>
        <input type="text" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Текст поста" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
};

const DeletePost = ({ postId }) => {
  const navigate = useNavigate();

  const deletePost = async () => {
    try {
      await axios.delete(`https://dummyjson.com/posts/${postId}`);
      navigate('/posts');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Удалить пост</h1>
      <p>Вы действительно хотите удалить пост?</p>
      <button onClick={deletePost}>Удалить</button>
    </div>
  );
};

export const App = () => (
  <Router>
    <Routes>
      <Route path="/posts" element={<PostList />} />
      <Route path="/posts/create" element={<CreatePost />} />
      <Route path="/posts/:postId" element={<EditPost />} />
      <Route path="/posts/:postId/delete" element={<DeletePost />} />
    </Routes>
  </Router>
);