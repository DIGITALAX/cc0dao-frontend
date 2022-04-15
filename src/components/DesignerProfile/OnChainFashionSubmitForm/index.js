import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import Button from "@components/Button";
import {
  EXCLUSIVE_RARITY,
  COMMON_RARITY,
  SEMI_RARE_RARITY,
} from "@constants/global.constants";
import api from "@services/api/espa/api.service";
import { getUser } from "@helpers/user.helpers";
import designerActions from "@actions/designer.actions";
import styles from "./styles.module.scss";
import Dropdown from "@components/Dropdown";

import { uploadFile as uploadFileToPinata } from "@utils/pinata";

const QuestionMark = (props) => {
  const { children } = props;

  return (
    <span className={styles.questionMarkWrapper}>
      <div className={styles.questionCircle}>?</div>
      <div className={styles.questionText}>{children}</div>
    </span>
  );
};

const OnChainFashionSubmitForm = (props) => {
  const { residentId } = props;

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemEditionNo, setItemEditionNo] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemType, setItemType] = useState("");
  const [itemAttachFGO, setItemAttachFGO] = useState("");
  const [sourceFileName, setSourceFileName] = useState("");
  const [renderFileName1, setRenderFileName1] = useState("");
  const [renderFileName2, setRenderFileName2] = useState("");
  const [renderFileName3, setRenderFileName3] = useState("");
  const [renderFileName4, setRenderFileName4] = useState("");
  const [renderFileName5, setRenderFileName5] = useState("");
  const [auctionTime, setAuctionTime] = useState(0);
  const [type, setType] = useState([]);
  const [rarity, setRarity] = useState(COMMON_RARITY);

  const types = [
    "IN-GAME",
    "PHYSICAL",
    "AR FILTER",
    "DIGITAL DRESSING",
    "Extra Unlockables",
  ];

  const dispatch = useDispatch();

  const onChangeSourceFile = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const pathItems = e.target.value.split("\\");
    setSourceFileName(pathItems[pathItems.length - 1]);
  };

  const openSourceFile = () => {
    document.getElementById("source-upload").click();
  };

  const validateOnChainForm = () => {
    if (
      !itemName ||
      itemName.split(" ").findIndex((item) => item !== "") === -1
    ) {
      setItemName("");
      document.getElementById("item-name").focus();
      toast("Please input item name.");
      return false;
    }
    if (
      !itemDescription ||
      itemDescription.split(" ").findIndex((item) => item !== "") === -1
    ) {
      setItemDescription("");
      document.getElementById("item-description").focus();
      toast("Please input description.");
      return false;
    }
    if (
      !itemEditionNo ||
      itemEditionNo.split(" ").findIndex((item) => item !== "") === -1
    ) {
      setItemEditionNo("");
      document.getElementById("item-edition-no").focus();
      toast("Please input edition no.");
      return false;
    }
    if (
      !itemPrice ||
      itemPrice.split(" ").findIndex((item) => item !== "") === -1
    ) {
      setItemPrice("");
      document.getElementById("item-price").focus();
      toast("Please input price(s).");
      return false;
    }
    if (
      !itemType ||
      itemType.split(" ").findIndex((item) => item !== "") === -1
    ) {
      setItemType("");
      document.getElementById("item-type").focus();
      toast("Please input type.");
      return false;
    }

    // const sourceUpload = document.getElementById('source-upload')
    // if (sourceUpload.files.length === 0) {
    //   toast('Please choose source file.')
    //   return false
    // }

    const render1Upload = document.getElementById("render1-upload");
    if (render1Upload.files.length === 0) {
      toast("Please choose at least one render file.");
      return false;
    }

    return true;
  };

  const uploadFile = async (file) => {
    try {
      dispatch(designerActions.setIsloading(true));
      const url = await uploadFileToPinata(file);
      console.log("uploaded: ", url);
      dispatch(designerActions.setIsloading(false));
      return url;
    } catch (e) {
      dispatch(designerActions.setIsloading(false));
      return null;
    }
  };

  const resetOnFashionItem = () => {
    setItemName("");
    setItemDescription("");
    setItemEditionNo("");
    setItemPrice("");
    setItemType("");
    setItemAttachFGO("");
    setSourceFileName("");
    setRenderFileName1("");
    setRenderFileName2("");
    setRenderFileName3("");
    setRenderFileName4("");
    setRenderFileName5("");
    setRarity(COMMON_RARITY);

    document.getElementById(`source-upload`).value = "";
    document.getElementById(`render1-upload`).value = "";
    document.getElementById(`render2-upload`).value = "";
    document.getElementById(`render3-upload`).value = "";
    document.getElementById(`render4-upload`).value = "";
    document.getElementById(`render5-upload`).value = "";
  };

  const submitForm = async () => {
    const sourceUpload = document.getElementById("source-upload");
    const render1Upload = document.getElementById("render1-upload");
    const render2Upload = document.getElementById("render2-upload");
    const render3Upload = document.getElementById("render3-upload");
    const render4Upload = document.getElementById("render4-upload");
    const render5Upload = document.getElementById("render5-upload");

    const sourceUrl = await uploadFile(sourceUpload.files[0]);
    // console.log('sourceUrl: ', sourceUrl)

    const render1Url = await uploadFile(render1Upload.files[0]);
    // console.log('render1Url: ', render1Url)

    let render2Url = "";
    if (render2Upload.files.length > 0) {
      render2Url = await uploadFile(render2Upload.files[0]);
    }
    let render3Url = "";
    if (render3Upload.files.length > 0) {
      render3Url = await uploadFile(render3Upload.files[0]);
    }
    let render4Url = "";
    if (render4Upload.files.length > 0) {
      render4Url = await uploadFile(render4Upload.files[0]);
    }
    let render5Url = "";
    if (render5Upload.files.length > 0) {
      render5Url = await uploadFile(render5Upload.files[0]);
    }

    const user = getUser();

    // register into fauna
    const message = await api.registerOnChainCC0Item({
      wallet: user.wallet,
      randomString: user.randomString,
      residentId,
      itemName,
      description: itemDescription,
      rarity,
      editionNo: itemEditionNo,
      price: itemPrice,
      auctionTime: auctionTime,
      type: itemType,
      sourceType: type,
      sourceFile: sourceUrl,
      renderFiles: [render1Url, render2Url, render3Url, render4Url, render5Url],
      attachFGO: itemAttachFGO,
    });

    if (message) {
      resetOnFashionItem();
      toast("Successfully submitted the On-Chain fashion item.");
    }
  };

  const onSend = () => {
    const completed = validateOnChainForm();
    if (!completed) return;
    submitForm();
  };

  const onChangeRenderFile = (e, number) => {
    let files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const pathItems = e.target.value.split("\\");
    if (number === 1) {
      setRenderFileName1(pathItems[pathItems.length - 1]);
    } else if (number === 2) {
      setRenderFileName2(pathItems[pathItems.length - 1]);
    } else if (number === 3) {
      setRenderFileName3(pathItems[pathItems.length - 1]);
    } else if (number === 4) {
      setRenderFileName4(pathItems[pathItems.length - 1]);
    } else if (number === 5) {
      setRenderFileName5(pathItems[pathItems.length - 1]);
    }
  };

  const openRenderFile = (number) => {
    // console.log('obj: ', document.getElementById(`render${number}-upload`))
    document.getElementById(`render${number}-upload`).click();
  };

  return (
    <div className={styles.wrapper}>
      <p className={styles.description}>
        Upload items to be listed on the DIGITALAX polygon indie web3 fashion
        marketplace to be listed as NFTs. DIGITALAX takes on the minting fee.
        The DIGITALAX treasury takes 15% from the total sale.{" "}
      </p>
      <div className={styles.formWrapper}>
        <div className={styles.leftSide}>
          <div className={styles.leftTop}>
            <div className={styles.label}>ITEM NAME</div>
            <input
              id="item-name"
              className={styles.marginBottom50}
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <div className={styles.label}>DESCRIPTION</div>
            <textarea
              id="item-description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
            />
          </div>
          <div className={styles.leftBottom}>
            <div className={styles.rarityWrapper}>
              <div className={styles.label}>rarity</div>
              <Button
                className={rarity === EXCLUSIVE_RARITY ? styles.selected : ""}
                onClick={() => setRarity(EXCLUSIVE_RARITY)}
              >
                Exclusive
              </Button>
              <Button
                className={rarity === SEMI_RARE_RARITY ? styles.selected : ""}
                onClick={() => setRarity(SEMI_RARE_RARITY)}
              >
                SEMI-RARE
              </Button>
              <Button
                className={rarity === COMMON_RARITY ? styles.selected : ""}
                onClick={() => setRarity(COMMON_RARITY)}
              >
                COMMON
              </Button>
            </div>
            <div className={styles.editionWrapper}>
              <div className={styles.label}>
                EDITION NO.
                <QuestionMark>HOW MANY EDITIONS? 1? 20? 1000?</QuestionMark>
              </div>
              <input
                id="item-edition-no"
                className={styles.marginBottom30}
                type="text"
                value={itemEditionNo}
                onChange={(e) => setItemEditionNo(e.target.value)}
              />
              <div className={styles.label}>PRICE($)</div>
              <input
                id="item-price"
                className={styles.marginBottom30}
                type="text"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
              />
              <div className={styles.label}>
                TYPE
                <QuestionMark>
                  AUCTIONS ARE ONLY EXCLUSIVE, OTHER RARITIES CAN BE INSTANT BUY
                </QuestionMark>
              </div>
              <div className={styles.marginBottom30}>
                <Dropdown
                  color="blue"
                  options={["INSTANT BUY", "AUCTION"]}
                  value={itemType}
                  onChange={(value) => setItemType(value)}
                  id="item-type"
                />
              </div>
              {itemType === "AUCTION" && (
                <>
                  <div className={styles.label}>
                    AUCTION TIME
                    <QuestionMark>
                      ENTER THE LENGTH OF AUCTION YOU WANT I.E. 48 HOURS.
                    </QuestionMark>
                  </div>
                  <input
                    id="auction-time"
                    className={styles.marginBottom30}
                    type="text"
                    value={auctionTime}
                    onChange={(e) => setAuctionTime(e.target.value)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.label}>
            SOURCE FILE
            <QuestionMark>
              Open source fashion. Upload the source file i.e. zprj, blend, fbx
            </QuestionMark>
          </div>
          <input
            id="source-upload"
            type="file"
            onChange={onChangeSourceFile}
            hidden
            accept="*.*"
          />
          <Button
            className={styles.uploadButton}
            background="black"
            onClick={openSourceFile}
          >
            FILE UPLOAD
          </Button>
          <div className={styles.fileName}>
            {sourceFileName && sourceFileName !== ""
              ? sourceFileName
              : "No file chosen"}
          </div>
          <div className={[styles.label, styles.marginTop22].join(" ")}>
            RENDERS
            <QuestionMark>COMPRESS FILES TO BELOW 50MB</QuestionMark>
          </div>
          <div className={styles.renderRow}>
            <div className={styles.uploadItem}>
              <input
                id="render1-upload"
                type="file"
                onChange={(e) => onChangeRenderFile(e, 1)}
                hidden
                accept=".mp4, .png, .jpg, .gif"
              />
              <Button
                className={styles.uploadButton}
                background="black"
                onClick={() => openRenderFile(1)}
              >
                FILE UPLOAD
              </Button>
              <div className={styles.fileName}>
                {renderFileName1 && renderFileName1 !== ""
                  ? renderFileName1
                  : "No file chosen"}
              </div>
            </div>
            <div className={styles.uploadItem}>
              <input
                id="render2-upload"
                type="file"
                onChange={(e) => onChangeRenderFile(e, 2)}
                hidden
                accept=".mp4, .png, .jpg, .gif"
              />
              <Button
                className={styles.uploadButton}
                background="black"
                onClick={() => openRenderFile(2)}
              >
                FILE UPLOAD
              </Button>
              <div className={styles.fileName}>
                {renderFileName2 && renderFileName2 !== ""
                  ? renderFileName2
                  : "No file chosen"}
              </div>
            </div>
          </div>
          <div className={styles.renderRow}>
            <div className={styles.uploadItem}>
              <input
                id="render3-upload"
                type="file"
                onChange={(e) => onChangeRenderFile(e, 3)}
                hidden
                accept=".mp4, .png, .jpg, .gif"
              />
              <Button
                className={styles.uploadButton}
                background="black"
                onClick={() => openRenderFile(3)}
              >
                FILE UPLOAD
              </Button>
              <div className={styles.fileName}>
                {renderFileName3 && renderFileName3 !== ""
                  ? renderFileName3
                  : "No file chosen"}
              </div>
            </div>
            <div className={styles.uploadItem}>
              <input
                id="render4-upload"
                type="file"
                onChange={(e) => onChangeRenderFile(e, 4)}
                hidden
                accept=".mp4, .png, .jpg, .gif"
              />
              <Button
                className={styles.uploadButton}
                background="black"
                onClick={() => openRenderFile(4)}
              >
                FILE UPLOAD
              </Button>
              <div className={styles.fileName}>
                {renderFileName4 && renderFileName4 !== ""
                  ? renderFileName4
                  : "No file chosen"}
              </div>
            </div>
          </div>
          <div className={styles.renderRow}>
            <div className={styles.uploadItem}>
              <input
                id="render5-upload"
                type="file"
                onChange={(e) => onChangeRenderFile(e, 5)}
                hidden
                accept=".mp4, .png, .jpg, .gif"
              />
              <Button
                className={styles.uploadButton}
                background="black"
                onClick={() => openRenderFile(5)}
              >
                FILE UPLOAD
              </Button>
              <div className={styles.fileName}>
                {renderFileName5 && renderFileName5 !== ""
                  ? renderFileName5
                  : "No file chosen"}
              </div>
            </div>
          </div>
          <div className={[styles.label, styles.marginTop22].join(" ")}>
            ATTACH FGO
            <QuestionMark>LIST NAME OF FGO PATTERNS TO ATTACH</QuestionMark>
          </div>
          <input
            className={styles.marginBottom30}
            type="text"
            value={itemAttachFGO}
            onChange={(e) => setItemAttachFGO(e.target.value)}
          />
          <div className={[styles.label, styles.marginTop22].join(" ")}>
            SELECT ALL THAT APPLY
          </div>

          <div className={styles.buttonRow}>
            <Dropdown
              multi
              color="blue"
              options={types}
              value={type}
              onChange={(option) => {
                if (type.includes(option)) {
                  setType([...type.filter((value) => value !== option)]);
                } else {
                  setType([...type, option]);
                }
              }}
            />
            <Button className={styles.sendButton} onClick={onSend}>
              Send OFF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnChainFashionSubmitForm;
