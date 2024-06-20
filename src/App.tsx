import Content from './components/MainPage/content/Content';
import Menu from './components/MainPage/menu/Menu';
import { useAppDispatch, useAppSelector } from './components/redux/store/store';
import AddPost from './components/AddPost/AddPost';
import Styles from "./styles/style.module.scss"
import { useEffect } from 'react';
import { handleCategories } from './components/redux/slice/categoriesSlice';

function App() {
  const postState = useAppSelector(state => state.post.post)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(handleCategories())
    if (postState) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [postState, dispatch])
  return (
    <div className={Styles.container}>
      <Menu />
      <div>
        <Content />
      </div>
      {postState && <AddPost />}
    </div>
  );
}

export default App;
