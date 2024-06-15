import { BsPersonFill, BsPlusCircleFill, BsHouseFill, BsSearch, BsBoxArrowLeft } from "react-icons/bs";
import { auth, googleProvider } from "../../../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "../../redux/store/store";
import { useEffect } from "react";
import { handleUserSign } from "../../redux/slice/userSlice";
import Styles from "./style.module.scss";

const Menu: React.FC = () => {
    const userState = useAppSelector(state => state.user.user)
    const dispatch = useAppDispatch()

    const login = async () => {
        try {
            await signInWithPopup(auth, googleProvider)
            dispatch(handleUserSign())
        } catch (error) {
            console.log("Oturum açılırken bir hata oluştu: ", error)
        }
    }
    const handleSignOut = async () => {
        try {
            await signOut(auth)
            dispatch(handleUserSign())
        } catch (error) {
            console.log("Oturum sonlandırılırken bir hata oluştu: ", error)
        }
    }

    useEffect(() => {
        dispatch(handleUserSign())
    }, [dispatch])

    return (
        <div className={Styles.navBar}>
            <div className={Styles.menu}></div>
            <div className={Styles.logoDiv}>
                <div className={Styles.logo}>Linkup</div>
            </div>
            <div className={Styles.searchDiv}>
                <BsSearch className={Styles.searchButton} /><input className={Styles.searchInput} type="search" placeholder="Search" />
            </div>
            <div className={Styles.utils}>
                <div className={Styles.home}>
                    <BsHouseFill className={Styles.utilsIcon} />
                    <p>Home</p>
                </div>
                <div className={Styles.add}>
                    <BsPlusCircleFill className={Styles.utilsIcon} />
                    Add
                </div>
                <div className={Styles.profile} onClick={login}>
                    {userState == null ? <BsPersonFill className={Styles.utilsIcon} /> : <img src={`${userState.photoURL}`} className={Styles.profileStyle} alt="profile" />}
                    {userState ? userState.displayName.split(" ")[0] : "Profile"}
                </div>
                {userState &&
                    <div className={Styles.profile} onClick={handleSignOut}>
                        <BsBoxArrowLeft className={Styles.utilsIcon} />
                        Sign Out
                    </div>
                }
            </div>
        </div>
    )
}

export default Menu