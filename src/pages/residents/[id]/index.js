import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  EXCLUSIVE_RARITY,
  COMMON_RARITY,
  SEMI_RARE_RARITY,
} from "@constants/global.constants";
import secondDesignerData from "src/data/second-designers.json";

import APIService from "@services/api/api.service";
import api from "@services/api/espa/api.service";

import styles from "./styles.module.scss";
import ResidentProfileTopPart from "@components/DesignerProfile/TopPart";

const RARITIES = [COMMON_RARITY, EXCLUSIVE_RARITY, SEMI_RARE_RARITY];

const getRarityNumber = (rarity) =>
  RARITIES.findIndex((item) => item == rarity);

const ResidentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [residentInfo, setResidentInfo] = useState(null);
  const [marketplaceItems, setMarketplaceItems] = useState([]);

  async function loadData() {
    const residents = (await api.getAllResidents()) || [];

    // console.log('designers: ', designers)
    const resident = residents.find(
      (item) =>
        item.residentId.toLowerCase() === id.toLowerCase() ||
        (item.newResidentID &&
          item.newResidentID.toLowerCase() === id.toLowerCase())
    );

    setResidentInfo(resident);
    const secondaryProducts = secondDesignerData.filter((data) =>
      data.designer.find(
        (designerItem) =>
          designerItem.toLowerCase() === designer?.designerId?.toLowerCase() ||
          (designer?.newDesignerID &&
            designer.newDesignerID.toLowerCase() === designerItem.toLowerCase())
      )
    );

    const { digitalaxCollectionGroups } =
      await APIService.getCollectionGroups();
    const { digitalaxModelCollectionGroups } =
      await APIService.getModelCollectionGroups();
    // console.log('digitalaxCollectionGroups: ', digitalaxCollectionGroups)
    const auctionItems = [];
    const secondaryAuctions = secondaryProducts.filter(
      (item) => item.isAuction == 1
    );
    const secondaryCollections = secondaryProducts.filter(
      (item) => item.isAuction == 0
    );
    digitalaxCollectionGroups.forEach((group) => {
      if (
        group?.auctions &&
        !(group?.auctions?.length === 1 && group?.auctions[0].id === "0")
      ) {
        auctionItems.push(
          ...group?.auctions
            ?.filter((auctionItem) => {
              return (
                auctionItem.designer.name.toLowerCase() ===
                  designer["designerId"].toLowerCase() ||
                secondaryAuctions.find(
                  (secondary) => secondary.id == auctionItem.id
                )
              );
            })
            .map((item) => {
              // console.log('item: ', item)
              return {
                ...item.garment,
                isAuction: 1,
              };
            })
        );
      }
      // console.log('-- current designer: ', designer)
      if (
        !(group.collections.length === 1 && group.collections[0].id === "0")
      ) {
        group.collections
          .filter((collectionItem) => {
            //   console.log(`designer: ${collectionItem.designer.name.toLowerCase()},current: ${designer['newDesignerID'].toLowerCase()}, check: ${
            //     collectionItem.designer.name.toLowerCase() == designer['newDesignerID'].toLowerCase()
            // } `)
            return (
              collectionItem.designer?.name.toLowerCase() ===
                designer["designerId"].toLowerCase() ||
              (designer["newDesignerID"] &&
                designer["newDesignerID"] !== "" &&
                collectionItem.designer.name.toLowerCase() ===
                  designer["newDesignerID"].toLowerCase()) ||
              secondaryCollections.find(
                (secondary) =>
                  secondary.id == collectionItem.id &&
                  secondary.rarity == getRarityNumber(collectionItem.rarity)
              )
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
      }
    });

    digitalaxModelCollectionGroups.forEach((group) => {
      // console.log('-- current designer: ', designer)
      if (
        !(group.collections.length === 1 && group.collections[0].id === "0")
      ) {
        group.collections
          .filter((collectionItem) => {
            console.log(`collectionItem: `, collectionItem);
            return (
              collectionItem.designer?.name.toLowerCase() ===
                designer["designerId"].toLowerCase() ||
              (designer["newDesignerID"] &&
                designer["newDesignerID"] !== "" &&
                collectionItem.designer?.name.toLowerCase() ===
                  designer["newDesignerID"].toLowerCase()) ||
              secondaryCollections.find(
                (secondary) =>
                  secondary.id == collectionItem.id &&
                  secondary.rarity == getRarityNumber(collectionItem.rarity)
              )
            );
          })
          .forEach((item) => {
            auctionItems.push(
              ...item.garments.map((garment) => {
                return {
                  ...garment,
                  isModel: true,
                  rarity: getRarityNumber(item.rarity),
                  isAuction: 0,
                  id: item.id,
                };
              })
            );
          });
      }
    });

    setMarketplaceItems(auctionItems);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!residentInfo) {
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
      <ResidentProfileTopPart
        isEdit={false}
        designerInfo={residentInfo}
        marketplaceItems={marketplaceItems}
      />
    </div>
  );
};

export default ResidentPage;
