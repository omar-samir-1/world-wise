import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import styles from "./SocialLinks.module.css";

function SocialLinks() {
  return (
    <div className={styles.container}>
      <span>
        <FaInstagram className={styles.logo} />
      </span>
      <span>
        <FaTwitter className={styles.logo} />
      </span>
      <span>
        <FaYoutube className={styles.logo} />
      </span>
    </div>
  );
}

export default SocialLinks;
