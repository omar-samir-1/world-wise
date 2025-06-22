import { useEffect, useState } from "react";
import styles from "./Avatar.module.css";

const avatarTypes = [
  ["Adventurer", "https://api.dicebear.com/7.x/adventurer/svg?seed="],
  [
    "Adventurer Neutral",
    "https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=",
  ],
  ["Avataaars ", "https://api.dicebear.com/7.x/avataaars/svg?seed="],
  ["Big Ears ", "https://api.dicebear.com/7.x/big-ears/svg?seed="],
  [
    "Big Ears Neutral",
    "https://api.dicebear.com/7.x/big-ears-neutral/svg?seed=",
  ],
  ["Big Smile", "https://api.dicebear.com/7.x/big-smile/svg?seed="],
  ["Bottts", "https://api.dicebear.com/7.x/bottts/svg?seed="],
  ["Croodles", "https://api.dicebear.com/7.x/croodles/svg?seed="],
  [
    "Croodles Neutral ",
    "https://api.dicebear.com/7.x/croodles-neutral/svg?seed=",
  ],
  ["Fun Emoji ", "https://api.dicebear.com/7.x/fun-emoji/svg?seed="],
  ["Lorelei", "https://api.dicebear.com/7.x/lorelei/svg?seed="],
  ["Miniavs", "https://api.dicebear.com/7.x/miniavs/svg?seed="],
  ["Notionists", "https://api.dicebear.com/7.x/notionists/svg?seed="],
  [
    "Notionists Neutral ",
    "https://api.dicebear.com/7.x/notionists-neutral/svg?seed=",
  ],
  ["Open Peeps", "https://api.dicebear.com/7.x/open-peeps/svg?seed="],
  ["Personas", "https://api.dicebear.com/7.x/personas/svg?seed="],
  ["Pixel Art", "https://api.dicebear.com/7.x/pixel-art/svg?seed="],
  [
    "Pixel Art Neutral",
    "https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=",
  ],
];

export function AvatarGenerator({ onChooseAvatar, isRegistering }) {
  const [theIndexOfTheTypeOfTheAvatar, setTheIndexOfTheTypeOfTheAvatar] =
    useState(0);
  const [seed, setSeed] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const theTypeOfTheAvatar = avatarTypes[theIndexOfTheTypeOfTheAvatar];

  useEffect(
    function () {
      onChooseAvatar(theTypeOfTheAvatar[1] + `${seed}`);
    },
    [theIndexOfTheTypeOfTheAvatar, seed, onChooseAvatar, theTypeOfTheAvatar]
  );

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div
          className={styles.avatarContainer}
          style={{ border: "2px solid white" }}
        >
          <img
            src={theTypeOfTheAvatar[1] + `${seed}`}
            alt="Avatar"
            className={styles.avatar}
          />
        </div>
        {isConfirmed ? (
          <>
            <p className={styles.reChooseText}>✅ This is your chosen avatar</p>
            <button
              disabled={isRegistering}
              onClick={() => setIsConfirmed(false)}
              className={
                isRegistering ? styles.disabledReChooseBtn : styles.reChooseBtn
              }
            >
              Re-choose your avatar
            </button>
          </>
        ) : (
          <>
            <div className={styles.entry}>
              <p className={styles.chooseAvatarTypeText}>
                Choose an avatar type
              </p>
              <select
                disabled={isRegistering}
                className={`${styles.optionsContainer} ${
                  isRegistering ? styles.disabled : ""
                }`}
                id="avatarSelect"
                value={theIndexOfTheTypeOfTheAvatar}
                onChange={(e) => {
                  setTheIndexOfTheTypeOfTheAvatar(e.target.value);
                  setSeed(0);
                }}
              >
                <option value="0">Adventurer</option>
                <option value="1">Adventurer Neutral</option>
                <option value="2">Avataaars</option>
                <option value="3">Big Ears</option>
                <option value="4">Big Ears Neutral</option>
                <option value="5">Big Smile</option>
                <option value="6">Bottts</option>
                <option value="7">Croodles</option>
                <option value="8">Croodles Neutral</option>
                <option value="9">Fun Emoji</option>
                <option value="10">Lorelei </option>
                <option value="11">Miniavs </option>
                <option value="12">Notionists </option>
                <option value="13">Notionists Neutral </option>
                <option value="14">Open Peeps </option>
                <option value="15">Personas </option>
                <option value="16">Pixel Art </option>
                <option value="17">Pixel Art Neutral </option>
              </select>
            </div>
            <button
              disabled={isRegistering}
              onClick={() => setSeed(seed + 1)}
              className={`${
                isRegistering
                  ? styles.disbledGenerateAvatarBtn
                  : styles.generateAvatarBtn
              }`}
            >
              Generate a new look for this avatar type!
            </button>
            <button
              className={`${
                isRegistering
                  ? styles.disbledConfirmButton
                  : styles.confirmButton
              }`}
              disabled={isRegistering}
              onClick={() => {
                setIsConfirmed(true);
              }}
            >
              Confirm this avatar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const Avatar = ({ url }) => {
  return (
    <div className={styles.avatarContainer}>
      <img
        src={url}
        alt="Avatar"
        className={styles.avatar}
        style={{ transform: "translateY(-10%)" }}
      />
    </div>
  );
};

export default Avatar;
