import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import CircleMenu from '@components/circle-menu';
import APIService from '@services/api/api.service';
import api from '@services/api/espa/api.service';
import styles from './styles.module.scss';

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;

  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

function Libraries(props) {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const screenWidth = useWindowDimensions().width;
  const [isMobile, setIsMobile] = useState(false);
  const [searchPattern, setSearchPattern] = useState('');

  useEffect(() => {
    // console.log('screen Width = >', screenWidth);
    screenWidth > 796 ? setIsMobile(false) : setIsMobile(true);
  }, [screenWidth]);

  async function getData() {
    const designers = (await api.getAllDesigners()) || [];
    const thumbnails = (await api.getAllThumbnails()) || [];

    const thumbnailObj = {};
    const blockedList = [];
    for (const thumbnail in thumbnails.data) {
      const thumbItem = thumbnails.data[thumbnail];
      thumbnailObj[thumbItem.image_url] = thumbItem.thumbnail_url;
      if (thumbItem.blocked) {
        blockedList.push(thumbItem.image_url);
      }
    }

    // setThumbnailList(thumbnailObj)

    const idLabel = 'Designer ID';

    const result = await APIService.getMaterialVS();
    const { digitalaxMaterialV2S } = result;
    let data = {};
    // console.log('digitalaxMaterialV2S: ', digitalaxMaterialV2S)
    let noThumbnailData = [];

    if (digitalaxMaterialV2S) {
      for (const item of digitalaxMaterialV2S) {
        if (item.attributes.length <= 0) continue;
        // console.log('--- item: ', item)
        const res = await fetch(item.tokenUri);
        // console.log('--- item res: ', res)
        const rdata = await res.json();
        // console.log('--- item rdata: ', rdata)
        if (!rdata['image_url'] || !rdata[idLabel]) continue;
        const designerObj = designers.find(
          (designerItem) =>
            (designerItem.designerId &&
              designerItem.designerId.toLowerCase() === rdata[idLabel].toLowerCase()) ||
            (designerItem.newDesignerID &&
              designerItem.newDesignerID.toLowerCase() === rdata[idLabel].toLowerCase())
        );
        if (!designerObj || designerObj === undefined || designerObj === '') continue;
        let designerId = designerObj.designerId;

        if (blockedList.findIndex((item) => item === rdata['image_url']) < 0) {
          const designerItem = designers.find(
            (item) => item.designerId.toLowerCase() === designerId.toLowerCase()
          );
          // console.log('designerItem: ', designerItem)
          if (designerItem['newDesignerID'] && designerItem['newDesignerID'] !== undefined) {
            designerId = designerItem['newDesignerID'];
          }
          if (!data[designerId]) {
            data[designerId] = [];
          }
          if (data[designerId].findIndex((item) => item.image === rdata['image_url']) >= 0) {
            continue;
          }

          if (!thumbnailObj[rdata['image_url']]) {
            noThumbnailData.push({
              designerId,
              image_url: rdata['image_url'],
              thumbnail: '',
            });
          }

          data[designerId].push({
            ...item,
            name:
              rdata['attributes'] && rdata['attributes'].length > 0 && rdata['attributes'][0].value,
            image: rdata['image_url'],
            source: rdata['source_url'],
            thumbnail: thumbnailObj ? thumbnailObj[rdata['image_url']] : null,
            description: rdata['description'],
          });
          setItems({ ...data });
        }
      }

      console.log('noThumbnailData: ', JSON.stringify(noThumbnailData));
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  const filterItems = () => {
    const designers = Object.keys(items);
    // setLoading(true);
    const filteredDesigners = designers.filter((designer) =>
      designer.toLowerCase().includes(searchPattern.trim().toLowerCase())
    );
    if (filteredDesigners.length) {
      // setLoading(false);
      return filteredDesigners;
    }
    const filteredItems = designers.filter((designer) => {
      return !!items[designer].find((item) => {
        const nameItem = item.attributes.find((attribute) => attribute.type === 'Name of Item');
        return (
          nameItem && nameItem.value.toLowerCase().includes(searchPattern.trim().toLowerCase())
        );
      });
    });
    if (filteredItems.length) {
      // setLoading(false);
      return filteredItems;
    }
    // setLoading(false);
    return [];
  };

  return (
    <div style={{ marginBottom: 30 }}>
      {!isMobile ? (
        <>
          <div className="flex my-5 items-center">
            <img src="/images/on-chain.png" className="onchainimg" alt="" />
            <img src="/images/opensource.png" className="opensourceimg" alt="" />
          </div>
          <div className="flex my-5 items-center">
            <img src="/images/llss.png" className="llssimg" alt="" />
            <img src="/images/nft.png" className="nftimg" alt="" />
            <img src="/images/libraries.png" className="librariesimg" alt="" />
          </div>
          <div className="flex justify-center my-10 w-full">
            <img src="/images/texture.png" alt="" />
            <img src="/images/material.png" className="mx-10 materialimg" alt="" />
            <img src="/images/pattern.png" alt="" />
          </div>
          <div className="flex my-16">
            <img src="/images/designer_contribution.png" className="mx-auto" alt="" />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col my-5 items-center opensourceheader">
            <img src="/images/on-chain.png" className="onchainimg" alt="" />
            <img src="/images/llss.png" className="llssimg" alt="" />
            <img src="/images/nft.png" className="nftimg" alt="" />
            <img src="/images/opensource.png" className="opensourceimg" alt="" />
            <img src="/images/libraries.png" className="librariesimg" alt="" />
            <img src="/images/texture.png" alt="" className="flex" />
            <img src="/images/material.png" className="materialimg" alt="" />
            <img src="/images/pattern.png" alt="" className="flex" />
            <img src="/images/designer.png" alt="" className="flex" />
            <img
              src="/images/contribution.png"
              alt=""
              className="flex"
              style={{ marginTop: '-21px' }}
            />
          </div>
        </>
      )}
      <div className={styles.patternsSearchWrapper}>
        <p>
          Search the Entire On-Chain 1155 NFT Open Source Libraries. Search by Print or Designer
          Name. This library is currently being used in the{' '}
          <a href="https://designers.digitalax.xyz/getdressed/" target="_blank">
            Metaverse Boutique
          </a>
          ,{' '}
          <a href="https://www.digitalax.xyz/look" target="_blank">
            LOOK Experiment
          </a>{' '}
          &{' '}
          <a href="https://fashion.digitalax.xyz/" target="_blank">
            Web3 Fashion Marketplace
          </a>
          .
        </p>
        <input
          className={styles.patternSearch}
          value={searchPattern}
          onChange={(e) => setSearchPattern(e.target.value)}
          placeholder="Start Searching Here."
        />
      </div>
      {loading ? (
        <>
          <div className={styles.loadingWrapper}>
            <video autoPlay muted loop className={styles.loadingVideo}>
              <source src="/video/init-loading.mp4" type="video/mp4" />
            </video>
          </div>
        </>
      ) : (
        <>
          {!isMobile ? (
            <Grid container item xs={12}>
              {filterItems().map((key, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Grid container item xs={4} justify="center" key={`circle-${index}`}>
                  <CircleMenu items={items[key]} keyName={key} direction={'Right'} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <div style={{ width: 375, maxWidth: 375 }}>
              <div className="opensourcecontent">
                {/* <Grid container item xs={12}> */}
                {filterItems().map((key, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Grid container item xs={12} justify="center" key={`circle-${index}`}>
                    <CircleMenu items={items[key]} keyName={key} direction="Right" />
                  </Grid>
                ))}
                {/* </Grid> */}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Libraries;
