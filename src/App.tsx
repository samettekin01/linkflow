import Content from './components/MainPage/content/Content';
import Menu from './components/MainPage/menu/Menu';
import Styles from "./styles/style.module.scss";
import { useAppDispatch, useAppSelector } from './components/redux/store/store';
import { useEffect } from 'react';
import { handleComments } from './components/redux/slice/contentSlice';

function App() {
  const dispatch = useAppDispatch();
  const { comments } = useAppSelector(state => state.comments)
  useEffect(() => {
    dispatch(handleComments())
  }, [dispatch])

  console.log(comments)
  return (
    <div className={Styles.container}>
      <Menu />
      <div>
        <Content />
      </div>
    </div>
  );
}

export default App;
