import { BsPersonFill, BsPlusCircleFill, BsHouseFill, BsSearch, BsBoxArrowLeft, BsList } from "react-icons/bs";
import { auth, googleProvider } from "../../../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { handleUserSign } from "../../redux/slice/userSlice";
import Styles from "./style.module.scss";
import { setIsOpen } from "../../redux/slice/stateSlice";
import { recentContent, setContent, setUserContent } from "../../redux/slice/contentSlice";
import TopicsCard from "../body/TopicsCard/TopicsCard";
import Logo from "../../../styles/Logo";

const Menu: React.FC = () => {
    const user = useAppSelector(state => state.user.user)
    const dispatch = useAppDispatch()

    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

    const login = async () => {
        if (!user) {
            try {
                await signInWithPopup(auth, googleProvider)
                dispatch(handleUserSign())
            } catch (error) {
                console.log("Oturum açılırken bir hata oluştu: ", error)
            }
        } else {
            dispatch(setContent(""))
            getUserContent(user.uid)
        }
    }
    const handleSignOut = async () => {
        if (user) {
            try {
                await signOut(auth)
                dispatch(handleUserSign())
            } catch (error) {
                console.log("Oturum sonlandırılırken bir hata oluştu: ", error)
            }
        }
    }

    const getUserContent = (id: string | undefined) => {
        id && dispatch(setUserContent(id))
    }

    useEffect(() => {
        dispatch(handleUserSign())
    }, [dispatch])

    return (
        <div className={Styles.navBar}>
            <div className={Styles.topicMenuContainer} onClick={() => setIsOpenMenu(!isOpenMenu)}>
                <BsList className={Styles.topicsMenuButton} />
                {isOpenMenu && <div className={Styles.topicMenu}>
                    <TopicsCard />
                </div>}
            </div>
            <div className={Styles.navBarContainer}>
                <div className={Styles.logoDiv} onClick={() => dispatch(recentContent())}>
                    <Logo />
                    <div className={Styles.logo}>LinkFlow</div>
                </div>
                <div className={Styles.searchDiv}>
                    <BsSearch className={Styles.searchButton} /><input className={Styles.searchInput} type="search" placeholder="Search" />
                </div>
                <div className={Styles.utils}>
                    <div className={Styles.home} onClick={() => dispatch(recentContent())}>
                        <BsHouseFill className={Styles.utilsIcon} />
                        <p>Home</p>
                    </div>
                    {user && <div className={Styles.add}>
                        <BsPlusCircleFill className={Styles.utilsIcon} onClick={() => dispatch(setIsOpen(true))} />
                        Add
                    </div>}
                    <div className={Styles.profile} onClick={login}>
                        {user == null ? <BsPersonFill className={Styles.utilsIcon} /> : <img src={`${user.photoURL}`} className={Styles.profileStyle} alt={user.displayName} />}
                        {user ? user.displayName.split(" ")[0] : "Log in"}
                    </div>
                    {user &&
                        <div className={Styles.profile} onClick={handleSignOut}>
                            <BsBoxArrowLeft className={Styles.utilsIcon} />
                            Sign Out
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Menu