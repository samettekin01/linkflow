import { BsPersonFill, BsPlusCircleFill, BsHouseFill, BsSearch, BsBoxArrowLeft } from "react-icons/bs";
import { auth, googleProvider } from "../../../firebase/firebase";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { UserInformations } from "../../../utils/types";
import Styles from "./style.module.scss";

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
                const userInfo: UserInformations = {
                    uid: user.uid,
                    displayName: user.displayName || "No Name",
                    email: user.email || "No Email",
                    photoURL: user.photoURL || "No Photo"
                };
                setUserState(userInfo)
            } else {
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
                    {userState === null ? <BsPersonFill className={Styles.utilsIcon} /> : <img src={`${userState.photoURL}`} className={Styles.profileStyle} alt="profile" />}
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