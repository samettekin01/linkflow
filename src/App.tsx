import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './components/redux/store/store';
import { handleCategories } from './components/redux/slice/categoriesSlice';
import Content from './components/MainPage/Content/Content';
import Menu from './components/MainPage/Menu/Menu';
import AddPost from './components/AddPost/AddPost';
import PostCard from './components/PostCard/PostCard';
import Styles from "./styles/style.module.scss"
import EditPost from './components/EditPost/EditPost';

function App() {
  const postStatus = useAppSelector(state => state.post.post)
  const getPostStatus = useAppSelector(state => state.post.getPost)
  const getEditPostStatus = useAppSelector(state => state.post.getEditPost)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(handleCategories())
    if (postStatus || getPostStatus) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [postStatus, getPostStatus, dispatch])
  return (
    <div className={Styles.container}>
      <Menu />
      <div>
        <Content />
      </div>
      {postStatus && <AddPost />}
      {getPostStatus && <PostCard />}
      {getEditPostStatus && <EditPost />}
    </div>
  );
}

export default App;
