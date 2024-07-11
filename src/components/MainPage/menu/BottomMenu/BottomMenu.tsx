import { BsBoxArrowLeft, BsHouseFill, BsPersonFill, BsPlusCircleFill } from "react-icons/bs"
import { useAppDispatch, useAppSelector } from "../../../redux/store/store"
import { recentContent } from "../../../redux/slice/contentSlice"
import { setIsOpen } from "../../../redux/slice/stateSlice"
import { signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "../../../../firebase/firebase"
import { handleUserSign } from "../../../redux/slice/userSlice"
import { Link, useNavigate } from "react-router-dom"
import Styles from "./style.module.scss"


function BottomMenu() {
    const user = useAppSelector(state => state.user.user)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const login = async () => {
        if (!user) {
            try {
                await signInWithPopup(auth, googleProvider)
                dispatch(handleUserSign())
                navigate("/")
            } catch (error) {
                console.log("Oturum açılırken bir hata oluştu: ", error)
            }
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

    return (
        <div className={Styles.utilsBottom}>
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
                    user == null ?
                        <BsPersonFill className={Styles.utilsIcon} />
                        :
                        <Link to={`profile/${user.uid}`} >
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
    )
}

export default BottomMenu