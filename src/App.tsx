import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './components/redux/store/store';
import { handleCategories } from './components/redux/slice/categoriesSlice';
import Content from './components/MainPage/content/Content';
import Menu from './components/MainPage/menu/Menu';
import AddPost from './components/AddPost/AddPost';
import PostCard from './components/PostCard/PostCard';
import Styles from "./styles/style.module.scss"

function App() {
  const postStatus = useAppSelector(state => state.post.post)
  const getPostStatus = useAppSelector(state => state.post.getPost)
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
    </div>
  );
}

export default App;
