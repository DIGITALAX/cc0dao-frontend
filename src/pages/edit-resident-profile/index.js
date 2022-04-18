import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  EXCLUSIVE_RARITY,
  COMMON_RARITY,
  SEMI_RARE_RARITY,
} from "@constants/global.constants";

import APIService from "@services/api/api.service";
import api from "@services/api/espa/api.service";

import DesignerProfileTopPart from "@components/DesignerProfile/TopPart";
import DesignerProfileBottomPart from "@components/DesignerProfile/BottomPart";
import Loader from "@components/loader";
import { getAccount } from "@selectors/user.selectors";

import designerActions from "@actions/designer.actions";
import {
  getCurrentResidentInfo,
  getIsLoading,
} from "@selectors/designer.selectors";
import styles from "./styles.module.scss";

const RARITIES = [COMMON_RARITY, EXCLUSIVE_RARITY, SEMI_RARE_RARITY];

const getRarityNumber = (rarity) =>
  RARITIES.findIndex((item) => item == rarity);

const EditDesignerProfile = () => {
  const dispatch = useDispatch();
  const account = useSelector(getAccount);
  const residentInfo = useSelector(getCurrentResidentInfo());
  const isLoading = useSelector(getIsLoading());

  const [materialList, setMaterialList] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);

  async function loadData() {
    const residents =
      (await api.getResidentByWallet(account.toLowerCase())) || [];
    const thumbnails = await api.getAllThumbnails();

    const resident = residents && residents.length > 0 ? residents[0] : null;

    dispatch(designerActions.setCurrentResidentInfo(resident));

    if (!resident) return;

    const thumbnailObj = {};
    const blockedList = [];
    for (const thumbnail in thumbnails.data) {
      const thumbItem = thumbnails.data[thumbnail];
      thumbnailObj[thumbItem.image_url] = thumbItem.thumbnail_url;
      if (thumbItem.blocked) {
        blockedList.push(thumbItem.image_url);
      }
    }

    const idLabel = "Resident ID";

    const result = await APIService.getMaterialVS();
    const { digitalaxMaterialV2S } = result;

    const { digitalaxCC0CollectionGroups } =
      await APIService.getCC0CollectionGroups();

    const auctionItems = [];
    if (resident && resident["residentId"]) {
      digitalaxCC0CollectionGroups.forEach((group) => {
        // auctionItems.push(
        //   ...group.auctions
        //     .filter((auctionItem) => {
        //       return (
        //         auctionItem.designer.name.toLowerCase() ===
        //         designer["designerId"].toLowerCase()
        //       );
        //     })
        //     .map((item) => {
        //       return {
        //         ...item.garment,
        //         isAuction: 1,
        //       };
        //     })
        // );

        group.collections
          .filter((collectionItem) => {
            return (
              collectionItem.resident.name.toLowerCase() ===
              resident["residentId"].toLowerCase()
            );
          })
          .forEach((item) => {
            auctionItems.push(
              ...item.garments.map((garment) => {
                return {
                  ...garment,
                  rarity: getRarityNumber(item.rarity),
                  isAuction: 0,
                  id: item.id,
                };
              })
            );
          });
      });
    }

    setMarketplaceItems(auctionItems);

    const materials = [];
    if (digitalaxMaterialV2S && resident && resident["residentId"]) {
      for (const item of digitalaxMaterialV2S) {
        if (item.attributes.length <= 0) continue;
        try {
          const res = await fetch(item.tokenUri);
          const rdata = await res.json();
          if (!rdata["image_url"] || !rdata[idLabel]) continue;
          if (
            resident["residentId"].toLowerCase() !==
              rdata[idLabel].toLowerCase() &&
            (!resident["newResidentID"] ||
              resident["newResidentID"] === "" ||
              resident["newResidentID"].toLowerCase() !==
                rdata[idLabel].toLowerCase())
          )
            continue;

          let residentId = rdata[idLabel];
          if (!residentId || residentId === undefined || residentId === "")
            continue;

          if (
            blockedList.findIndex((item) => item === rdata["image_url"]) < 0
          ) {
            if (
              resident["newResidentID"] &&
              resident["newResidentID"] !== undefined
            ) {
              residentId = resident["newResidentID"];
            }

            if (
              materials.findIndex(
                (item) => item.image === rdata["image_url"]
              ) >= 0
            )
              continue;
            materials.push({
              ...item,
              name:
                rdata["attributes"] &&
                rdata["attributes"].length > 0 &&
                rdata["attributes"][0].value,
              image: rdata["image_url"],
              thumbnail: thumbnailObj ? thumbnailObj[rdata["image_url"]] : null,
              description: rdata["description"],
            });

            setMaterialList([...materials]);
          }
        } catch (exception) {
          console.log("exception: ", exception);
        }
      }
    }
  }

  useEffect(() => {
    if (!account) return;
    loadData();
  }, [account]);

  if (!account) {
    return (
      <div className={styles.beforeLoading}>
        <div className={styles.ldsEllipsis}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  if (!residentInfo || Object.keys(residentInfo).length <= 0) {
    return (
      <div className={styles.beforeLoading}>
        <div className={styles.ldsEllipsis}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {isLoading && <Loader white size="large" className={styles.loader} />}
      <DesignerProfileTopPart
        isEdit={true}
        residentInfo={residentInfo}
        materialList={materialList}
        marketplaceItems={marketplaceItems}
      />
    </div>
  );
};

export default EditDesignerProfile;
