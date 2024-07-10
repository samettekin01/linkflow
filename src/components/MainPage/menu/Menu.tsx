import { BsPersonFill, BsPlusCircleFill, BsHouseFill, BsBoxArrowLeft, BsList } from "react-icons/bs"
import { auth, googleProvider } from "../../../firebase/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { useAppDispatch, useAppSelector } from "../../redux/store/store"
import { useEffect, useRef, useState } from "react"
import { handleUserSign } from "../../redux/slice/userSlice"
import { setIsOpen, setIsOpenSnackBar } from "../../redux/slice/stateSlice"
import { recentContent } from "../../redux/slice/contentSlice"
import TopicsCard from "../body/TopicsCard/TopicsCard"
import Logo from "../../../styles/Logo"
import { Link } from "react-router-dom"
import Styles from "./style.module.scss"

const Menu: React.FC = () => {
    const user = useAppSelector(state => state.user.user)

    const dispatch = useAppDispatch()

    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)

    const topicMenuRef = useRef<HTMLDivElement | null>(null)

    const login = async () => {
        if (!user) {
            try {
                await signInWithPopup(auth, googleProvider)
                dispatch(handleUserSign())
            } catch (error) {
                console.log("An error occurred while logging in: ", error)
                dispatch(setIsOpenSnackBar({ message: "An error occurred while logging in:", status: true }))
            }
        }
    }
    const handleSignOut = async () => {
        if (user) {
            try {
                await signOut(auth)
                dispatch(handleUserSign())
            } catch (error) {
                dispatch(setIsOpenSnackBar({ message: "An error occurred while logging in:", status: true }))
                console.log("An error occurred while terminating the session: ", error)
            }
        }
    }

    useEffect(() => {
        dispatch(handleUserSign())
        const handleOutsideClick = (e: MouseEvent) => {
            if (topicMenuRef.current && !topicMenuRef.current.contains(e.target as Node)) {
                setIsOpenMenu(false)
            }
        }
        if (isOpenMenu) {
            document.addEventListener("mousedown", handleOutsideClick)
        } else {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [dispatch, isOpenMenu])

    return (
        <div className={Styles.navBar}>
            <div className={Styles.topicMenuContainer} onClick={() => setIsOpenMenu(!isOpenMenu)} ref={topicMenuRef}>
                <BsList className={Styles.topicsMenuButton} />
                {isOpenMenu && <div className={Styles.topicMenu}>
                    <TopicsCard />
                </div>}
            </div>
            <div className={Styles.navBarContainer}>
                <Link to="/" className={Styles.logoDiv} onClick={() => dispatch(recentContent())}>
                    <Logo />
                    <div className={Styles.logo}>LinkFlow</div>
                </Link>
                <div className={Styles.utils}>
                    <Link to="/" className={Styles.home} onClick={() => dispatch(recentContent())}>
                        <BsHouseFill className={Styles.utilsIcon} />
                        <p>Home</p>
                    </Link>
                    {user && <div className={Styles.add}>
                        <BsPlusCircleFill className={Styles.utilsIcon} onClick={() => dispatch(setIsOpen(true))} />
                        Add
                    </div>}
                    <div className={Styles.profile} onClick={login}>
                        {
                            user === null ?
                                <BsPersonFill className={Styles.utilsIcon} />
                                :
                                <Link to={`/profile/${user.uid}`}>
                                    <img src={`${user.photoURL}`} className={Styles.profileStyle} alt={user.displayName} />
                                </Link>
                        }
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