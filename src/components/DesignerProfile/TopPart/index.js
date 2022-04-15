import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";

import Button from "@components/Button";
import CollectionCard from "@components/collection-card";
import OnChainFashionSubmitForm from "../OnChainFashionSubmitForm";
import PatternCircle from "@components/DesignerProfile/PatternCircle";
import designerActions from "@actions/designer.actions";
import styles from "./styles.module.scss";

const MAX_DESCRIPTION_LENGTH = 672;

const ResidentProfileTopPart = (props) => {
  const { isEdit, residentInfo, marketplaceItems } = props;

  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");
  const [twitterDraft, setTwitterDraft] = useState("");
  const [instagramDraft, setInstagramDraft] = useState("");
  const [tiktokDraft, setTiktokDraft] = useState("");
  const [youtubeDraft, setYoutubeDraft] = useState("");
  const [linkedinDraft, setLinkedinDraft] = useState("");
  const [mirrorDraft, setMirrorDraft] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("--here");
    setAvatarUrl(residentInfo["image_url"]);
  }, [residentInfo["image_url"]]);

  useEffect(() => {
    setTwitterDraft(residentInfo["twitter"]);
    console.log("twitter: ", residentInfo["twitter"]);
  }, [residentInfo["twitter"]]);

  useEffect(() => {
    setInstagramDraft(residentInfo["instagram"]);
  }, [residentInfo["instagram"]]);

  useEffect(() => {
    setMirrorDraft(residentInfo["ThreadMirror"]);
  }, [residentInfo["ThreadMirror"]]);

  useEffect(() => {
    setLinkedinDraft(residentInfo["linkedin"]);
  }, [residentInfo["linkedin"]]);

  useEffect(() => {
    setYoutubeDraft(residentInfo["youtube"]);
  }, [residentInfo["youtube"]]);

  useEffect(() => {
    setTiktokDraft(residentInfo["tiktok"]);
  }, [residentInfo["tiktok"]]);

  // Mod Avatar
  const showBrowserForAvatar = () => {
    document.getElementById("avatar-upload").click();
  };

  const cancelModAvatar = () => {
    setIsEditingAvatar(false);
    setAvatarUrl(residentInfo["image_url"]);
    document.getElementById("avatar-upload").value = "";
  };

  const saveModAvatar = () => {
    let files = document.getElementById("avatar-upload").files;
    if (files.length === 0) {
      cancelModAvatar();
      return;
    }

    dispatch(designerActions.uploadAvatar(files[0]));
    setIsEditingAvatar(false);
    document.getElementById("avatar-upload").value = "";
  };

  const onChangeAvatarFile = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) {
      return;
    }

    setAvatarUrl(URL.createObjectURL(files[0]));
    setIsEditingAvatar(true);
  };

  // Mod Description
  const showEditDescription = () => {
    setDescriptionDraft(residentInfo["description"]);
    setIsEditingDescription(true);
  };

  const saveModDescription = () => {
    residentInfo["description"] = descriptionDraft;
    dispatch(designerActions.updateProfile(residentInfo));
    setIsEditingDescription(false);
  };

  const cancelModDescription = () => {
    setIsEditingDescription(false);
  };

  const onChangeDescription = (e) => {
    setDescriptionDraft(e.target.value.substring(0, MAX_DESCRIPTION_LENGTH));
  };

  // Add more
  const addMore = () => {
    window.open("/minting", "_blank");
  };

  // Social
  const saveSocialLinks = () => {
    residentInfo["twitter"] = twitterDraft.includes("twitter.com")
      ? twitterDraft
      : `https://twitter.com/${twitterDraft}`;
    residentInfo["instagram"] = instagramDraft.includes("https")
      ? instagramDraft
      : `https://${instagramDraft}`;
    residentInfo["linkedin"] = linkedinDraft.includes("https")
      ? linkedinDraft
      : `https://${linkedinDraft}`;
    residentInfo["youtube"] = youtubeDraft.includes("https")
      ? youtubeDraft
      : `https://${youtubeDraft}`;
    residentInfo["tiktok"] = tiktokDraft.includes("https")
      ? tiktokDraft
      : `https://${tiktokDraft}`;
    residentInfo["ThreadMirror"] = mirrorDraft.includes("https")
      ? mirrorDraft
      : `https://${mirrorDraft}`;

    dispatch(designerActions.updateProfile(residentInfo));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.rect1}></div>
      <div className={styles.rect2}></div>
      <img className={styles.userPhoto} src={avatarUrl} />
      <input
        id="avatar-upload"
        type="file"
        onChange={onChangeAvatarFile}
        hidden
        accept=".jpg, .png, .gif"
      />
      {isEdit && !isEditingAvatar && (
        <Button
          className={[styles.modPFPButton, styles.blueButton].join(" ")}
          onClick={() => showBrowserForAvatar()}
        >
          MOD PFP
        </Button>
      )}
      {isEdit && isEditingAvatar && (
        <Button
          className={[styles.modPFPButtonSave, styles.blueButton].join(" ")}
          onClick={() => saveModAvatar()}
        >
          SAVE
        </Button>
      )}
      {isEdit && isEditingAvatar && (
        <Button
          className={[styles.modPFPButtonCancel, styles.blueButton].join(" ")}
          onClick={() => cancelModAvatar()}
        >
          CANCEL
        </Button>
      )}
      <img
        className={styles.claimUsername}
        src="/images/designer-page/claim-username.png"
      />

      <div
        className={[styles.designerName, isEdit ? styles.editing : ""].join(
          " "
        )}
      >
        {residentInfo["residentId"].toUpperCase()}
      </div>

      {isEdit && (
        <Button className={[styles.modNameButton, styles.blueButton].join(" ")}>
          MOD
        </Button>
      )}

      {!isEdit && (
        <div className={styles.socialIcons}>
          {residentInfo["twitter"] && residentInfo["twitter"] !== "" && (
            <a
              href={
                residentInfo["twitter"].includes("https")
                  ? residentInfo["twitter"]
                  : `https://${residentInfo["twitter"]}`
              }
              target="_blank"
            >
              <img src="/images/social-button-circle/twitter.png" />
            </a>
          )}
          {residentInfo["instagram"] && residentInfo["instagram"] !== "" && (
            <a
              href={
                residentInfo["instagram"].includes("https")
                  ? residentInfo["instagram"]
                  : `https://${residentInfo["instagram"]}`
              }
              target="_blank"
            >
              <img src="/images/social-button-circle/instagram.png" />
            </a>
          )}
          {residentInfo["linkedin"] && residentInfo["linkedin"] !== "" && (
            <a
              href={
                residentInfo["linkedin"].includes("https")
                  ? residentInfo["linkedin"]
                  : `https://${residentInfo["linkedin"]}`
              }
              target="_blank"
            >
              <img src="/images/social-button-circle/linkedin.png" />
            </a>
          )}
          {residentInfo["tiktok"] && residentInfo["tiktok"] !== "" && (
            <a
              href={
                residentInfo["tiktok"].includes("https")
                  ? residentInfo["tiktok"]
                  : `https://${residentInfo["tiktok"]}`
              }
              target="_blank"
            >
              <img src="/images/social-button-circle/tiktok.png" />
            </a>
          )}
          {residentInfo["youtube"] && residentInfo["youtube"] !== "" && (
            <a
              href={
                residentInfo["youtube"].includes("https")
                  ? residentInfo["youtube"]
                  : `https://${residentInfo["youtube"]}`
              }
              target="_blank"
            >
              <img src="/images/social-button-circle/youtube.png" />
            </a>
          )}
          {/* {residentInfo["ThreadMirror"] && residentInfo["ThreadMirror"] !== "" && (
            <a
              href={
                residentInfo["ThreadMirror"].includes("https")
                  ? residentInfo["ThreadMirror"]
                  : `https://${residentInfo["ThreadMirror"]}`
              }
              target="_blank"
            >
              <img src="/images/social-button-circle/mirror.png" />
            </a>
          )} */}
        </div>
      )}

      {isEdit && (
        <div className={styles.inputSocialIcons}>
          <div className={styles.inputRow}>
            <img src="/images/social-button-circle/twitter.png" />
            <input
              type="text"
              value={twitterDraft}
              onChange={(e) => setTwitterDraft(e.target.value)}
            />
          </div>
          <div className={styles.inputRow}>
            <img src="/images/social-button-circle/instagram.png" />
            <input
              type="text"
              value={instagramDraft}
              onChange={(e) => setInstagramDraft(e.target.value)}
            />
          </div>
          <div className={styles.inputRow}>
            <img src="/images/social-button-circle/tiktok.png" />
            <input
              type="text"
              value={tiktokDraft}
              onChange={(e) => setTiktokDraft(e.target.value)}
            />
          </div>
          <div className={styles.inputRow}>
            <img src="/images/social-button-circle/youtube.png" />
            <input
              type="text"
              value={youtubeDraft}
              onChange={(e) => setYoutubeDraft(e.target.value)}
            />
          </div>
          <div className={styles.inputRow}>
            <img src="/images/social-button-circle/linkedin.png" />
            <input
              type="text"
              value={linkedinDraft}
              onChange={(e) => setLinkedinDraft(e.target.value)}
            />
          </div>
          {/* <div className={styles.inputRow}>
            <img src="/images/social-button-circle/mirror.png" />
            <input
              type="text"
              value={mirrorDraft}
              onChange={(e) => setMirrorDraft(e.target.value)}
            />
          </div> */}
          <Button
            className={[styles.modSocialSave, styles.blueButton].join(" ")}
            onClick={() => saveSocialLinks()}
          >
            SAVE
          </Button>
        </div>
      )}

      {!isEditingDescription && (
        <div
          className={[
            styles.designerDescription,
            isEdit ? styles.editing : "",
          ].join(" ")}
        >
          {residentInfo["description"].substring(0, MAX_DESCRIPTION_LENGTH)}
        </div>
      )}
      {isEdit && isEditingDescription && (
        <textarea
          className={styles.editDescription}
          onChange={onChangeDescription}
          value={descriptionDraft}
        />
      )}
      {isEdit && !isEditingDescription && (
        <Button
          className={[styles.modDescriptionButton, styles.blueButton].join(" ")}
          onClick={() => showEditDescription()}
        >
          MOD
        </Button>
      )}
      {isEdit && isEditingDescription && (
        <Button
          className={[styles.modDescriptionButtonSave, styles.blueButton].join(
            " "
          )}
          onClick={() => saveModDescription()}
        >
          SAVE
        </Button>
      )}
      {isEdit && isEditingDescription && (
        <Button
          className={[
            styles.modDescriptionButtonCancel,
            styles.blueButton,
          ].join(" ")}
          onClick={() => cancelModDescription()}
        >
          CANCEL
        </Button>
      )}

      {!isEdit && marketplaceItems.length > 0 && (
        <div className={styles.marketplaceSection}>
          <h1>ON-CHAIN CC0</h1>

          <div className={styles.marketplaceItems}>
            {marketplaceItems.map((item, index) => (
              <CollectionCard
                item={item}
                key={
                  item.animation && item.animation != ""
                    ? item.animation
                    : item.image
                }
              />
            ))}
          </div>
        </div>
      )}

      {isEdit && (
        <div className={styles.submitFormWrapper}>
          <h1>ON-CHAIN CC0</h1>
          <OnChainFashionSubmitForm residentId={residentInfo["residentId"]} />
        </div>
      )}
      <div className={styles.bottomWrapper}>
        <div className={styles.rect3}></div>
        <div className={styles.rect4}></div>
      </div>
    </div>
  );
};

export default ResidentProfileTopPart;
