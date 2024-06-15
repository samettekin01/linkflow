import Content from './components/MainPage/content/Content';
import Menu from './components/MainPage/menu/Menu';
import { useAppSelector } from './components/redux/store/store';
import PostScreen from './components/PostScreen/PostScrenn';
import Styles from "./styles/style.module.scss"
import { useEffect } from 'react';

function App() {
  const postState = useAppSelector(state => state.post.post)
  useEffect(() => {
    if (postState) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }, [postState])
  return (
    <div className={Styles.container}>
      <Menu />
      <div>
        <Content />
      </div>
      {postState && <PostScreen />}
    </div>
  );
}

export default App;
