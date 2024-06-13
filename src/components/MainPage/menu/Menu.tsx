import { BsPersonFill, BsPlusCircleFill, BsHouseFill, BsSearch, BsBoxArrowLeft } from "react-icons/bs";
import Styles from "./style.module.scss";
import { auth, googleProvider } from "../../../firebase/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { UserInformations } from "../../../utils/types";

const Menu: React.FC = () => {
    const [userState, setUserState] = useState<UserInformations | null>(null)
    const login = () => {
        return signInWithPopup(auth, googleProvider)
    }
    const handleSignOut = () => {
        signOut(auth)
    }
    useEffect(() =>
        onAuthStateChanged(auth, user => {
            if (user) {
                console.log("giriş yapıldı")
                const userInfo: UserInformations = {
                    uid: user.uid,
                    displayName: user.displayName || "No Name",
                    email: user.email || "No Email"
                };
                setUserState(userInfo)
            } else {
                console.log("giriş yapılmamış")
                setUserState(null)
            }
        }), [])
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
                    <p>Home Page</p>
                </div>
                <div className={Styles.add}>
                    <BsPlusCircleFill className={Styles.utilsIcon} />
                    Add
                </div>
                <div className={Styles.profile} onClick={login}>
                    <BsPersonFill className={Styles.utilsIcon} />
                    {userState ? userState.displayName : "Profile"}
                </div>
                <div className={Styles.profile}>
                    <BsBoxArrowLeft className={Styles.utilsIcon} onClick={handleSignOut} />
                    Sign Out
                </div>
            </div>
        </div>
    )
}

export default Menu