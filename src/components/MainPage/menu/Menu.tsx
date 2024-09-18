import { BsPersonFill, BsPlusCircleFill, BsHouseFill, BsBoxArrowLeft, BsList, BsSearch } from "react-icons/bs"
import { auth, googleProvider } from "../../../firebase/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { useAppDispatch, useAppSelector } from "../../redux/store/store"
import { useEffect, useRef, useState } from "react"
import { handleUserSign } from "../../redux/slice/userSlice"
import { setIsOpen, setIsOpenPost, setIsOpenSnackBar } from "../../redux/slice/stateSlice"
import { recentContent, setCurrentPost } from "../../redux/slice/contentSlice"
import { Link, useNavigate } from "react-router-dom"
import TopicsCard from "../body/TopicsCard/TopicsCard"
import Logo from "../../../styles/Logo"
import Styles from "./style.module.scss"
import { PostData } from "../../../utils/types"

const Menu: React.FC = () => {
    const { user } = useAppSelector(state => state.user)
    const { content } = useAppSelector(state => state.content)

    const dispatch = useAppDispatch()

    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
    const [searchValue, setSearchValue] = useState<string>("")
    const [searchResult, setSearchResult] = useState<Array<PostData>>()

    const topicMenuRef = useRef<HTMLDivElement | null>(null)

    const navigate = useNavigate()

    const login = async () => {
        if (!user) {
            try {
                await signInWithPopup(auth, googleProvider)
                dispatch(handleUserSign())
                navigate("/")
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

    const handlePost = (data: PostData) => {
        dispatch(setIsOpenPost(true))
        dispatch(setCurrentPost(data))
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

    useEffect(() => {
        if (searchValue !== "") {
            const result = content && content.filter((item: PostData) => item.content.title.toLowerCase().includes(searchValue.toLowerCase()))
            setSearchResult(result)
        } else {
            setSearchResult([])
        }
    }, [searchValue, content])

    return (
        <div className={Styles.navBar}>
            <div className={Styles.topicMenuContainer} onClick={() => setIsOpenMenu(!isOpenMenu)} ref={topicMenuRef}>
                <BsList className={Styles.topicsMenuButton} />
                {isOpenMenu && <div className={Styles.topicMenu}>
                    <TopicsCard />
                </div>}
            </div>
            <div className={Styles.navBarContainer} >
                <Link to="/" className={Styles.logoDiv} onClick={() => dispatch(recentContent())}>
                    <Logo />
                    <div className={Styles.logo}>LinkFlow</div>
                </Link>
                <div className={Styles.searchDiv}>
                    <input type="input" className={Styles.searchInput} value={searchValue} onChange={e => setSearchValue(e.target.value)}></input>
                    <BsSearch className={Styles.searchButton} />
                    <div className={Styles.searchResultDiv}>
                        <ul>
                            {searchResult ? searchResult?.map((e) => (
                                <Link to={`/post/${e?.postsCollectionId}/${e?.categoryId}/${e?.postID}`} key={e.postID} onClick={() => handlePost(e)}><li>{e.content.title}</li></Link>
                            )) : ""}
                        </ul>
                    </div>
                </div>
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