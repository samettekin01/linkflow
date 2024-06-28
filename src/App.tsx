import { useEffect } from 'react';
import { useAppSelector } from './components/redux/store/store';
import Content from './components/MainPage/content/Content';
import Menu from './components/MainPage/menu/Menu';
import AddPost from './components/AddPost/AddPost';
import PostCard from './components/PostCard/PostCard';
import Styles from "./styles/style.module.scss"
import EditPost from './components/EditPost/EditPost';
import BottomMenu from './components/MainPage/menu/BottomMenu/BottomMenu';

function App() {
  const postStatus = useAppSelector(state => state.post.post)
  const getPostStatus = useAppSelector(state => state.post.getPost)
  const getEditPostStatus = useAppSelector(state => state.post.getEditPost)

  useEffect(() => {
    if (postStatus || getPostStatus || getEditPostStatus) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [postStatus, getPostStatus, getEditPostStatus])
  return (
    <div className={Styles.container}>
      <Menu />
      <Content />
      {postStatus && <AddPost />}
      {getPostStatus && <PostCard />}
      {getEditPostStatus && <EditPost />}
      <BottomMenu />
    </div>
  );
}

export default App;
