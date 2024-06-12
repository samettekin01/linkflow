import { BsPersonFill, BsPlusCircleFill, BsHouseFill, BsSearch } from "react-icons/bs";
import Styles from "./style.module.scss";

const Menu: React.FC = () => {
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
                <div className={Styles.profile}>
                    <BsPersonFill className={Styles.utilsIcon} />
                    Profile
                </div>
            </div>
        </div>
    )
}

export default Menu