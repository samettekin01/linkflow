import { FaGithub } from 'react-icons/fa'
import Styles from './style.module.scss'

function Github() {
    return (
        <div
            className={Styles.github}
        >
            <a
                href='https://github.com/samettekin01'
                target='_blank'
                rel='noreferrer'
                className={Styles.githubIcon}
            >
                <FaGithub
                    className={Styles.githubIcon} />
            </a>
        </div>
    )
}

export default Github