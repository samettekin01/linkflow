import { BsBoxArrowLeft, BsHouseFill, BsPersonFill, BsPlusCircleFill } from "react-icons/bs"
import { useAppDispatch, useAppSelector } from "../../../redux/store/store"
import { recentContent, setUserContent } from "../../../redux/slice/contentSlice"
import { setIsOpen } from "../../../redux/slice/stateSlice"
import { signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "../../../../firebase/firebase"
import Styles from "./style.module.scss"
import { handleUserSign } from "../../../redux/slice/userSlice"


function BottomMenu() {
    const user = useAppSelector(state => state.user.user)
    const dispatch = useAppDispatch()

    const login = async () => {
        if (!user) {
            try {
                await signInWithPopup(auth, googleProvider)
                dispatch(handleUserSign())
            } catch (error) {
                console.log("Oturum açılırken bir hata oluştu: ", error)
            }
        } else {
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

    return (
        <div className={Styles.utilsBottom}>
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
    )
}

export default BottomMenu