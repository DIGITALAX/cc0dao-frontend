import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { EXCLUSIVE_RARITY, COMMON_RARITY, SEMI_RARE_RARITY } from '@constants/global.constants'

import APIService from '@services/api/api.service'
import api from '@services/api/espa/api.service'

import DesignerProfileTopPart from '@components/DesignerProfile/TopPart'
import DesignerProfileBottomPart from '@components/DesignerProfile/BottomPart'
import Loader from '@components/loader'
import { getAccount } from '@selectors/user.selectors'

import designerActions from '@actions/designer.actions'
import { getCurrentDesignerInfo, getIsLoading } from '@selectors/designer.selectors'
import styles from './styles.module.scss'


const RARITIES = [
  COMMON_RARITY, EXCLUSIVE_RARITY, SEMI_RARE_RARITY
]

const getRarityNumber = rarity => RARITIES.findIndex(item => item == rarity)

const EditDesignerProfile = () => {
  const dispatch = useDispatch()
  const account = useSelector(getAccount)
  const designerInfo = useSelector(getCurrentDesignerInfo())
  const isLoading = useSelector(getIsLoading())

  const [materialList, setMaterialList] = useState([])
  const [marketplaceItems, setMarketplaceItems] = useState([])

  async function loadData() {
    const designers = await api.getDesignerByWallet(account.toLowerCase()) || []
    const thumbnails = await api.getAllThumbnails()

    const designer = designers && designers.length > 0 ? designers[0] : null
    
    dispatch(designerActions.setCurrentDesignerInfo(designer))

    if (!designer) return
      
    const thumbnailObj = {}
    const blockedList = []
    for (const thumbnail in thumbnails.data) {
      const thumbItem = thumbnails.data[thumbnail]
      thumbnailObj[thumbItem.image_url] = thumbItem.thumbnail_url
      if (thumbItem.blocked) {
        blockedList.push(thumbItem.image_url)
      }
    }

    const idLabel = 'Designer ID'

    const result = await APIService.getMaterialVS()
    const { digitalaxMaterialV2S } = result

    const { digitalaxCollectionGroups } = await APIService.getCollectionGroups()

    const auctionItems = []
    if (designer && designer['designerId']) {
      digitalaxCollectionGroups.forEach(group => {
        auctionItems.push(
          ...group.auctions.filter(
            auctionItem => {
              return auctionItem.designer.name.toLowerCase() === designer['designerId'].toLowerCase()
            }
          ).map(item => {
            return {
              ...item.garment,
              isAuction: 1
            }
          })
        )
  
        group.collections.filter(
          collectionItem => {
            return collectionItem.designer.name.toLowerCase() === designer['designerId'].toLowerCase()
          }
        ).forEach(item => {
          auctionItems.push(
            ...item.garments.map(garment => { return {...garment, rarity: getRarityNumber(item.rarity), isAuction: 0, id: item.id}})
          )
        })
      })
    }

    setMarketplaceItems(auctionItems)
    // console.log('auctionItems: ', auctionItems)

    const materials = []
    // console.log('digitalaxMaterialV2S: ', digitalaxMaterialV2S)
    let noThumbnailData = []
    // console.log('designer id: ', designerInfo['Designer ID'])
    if (digitalaxMaterialV2S && designer && designer['deisngerId']) {
      for (const item of digitalaxMaterialV2S) {
        if (item.attributes.length <= 0) continue
        try {
          const res = await fetch(item.tokenUri)
          // console.log('--- item res: ', res)
          const rdata = await res.json()
          // console.log('--- item rdata: ', rdata)
          if (!rdata['image_url'] || !rdata[idLabel]) continue
          if (
            designer['designerId'].toLowerCase() !== rdata[idLabel].toLowerCase()
            && (!designer['newDesignerID'] || designer['newDesignerID'] === '' || 
            designer['newDesignerID'].toLowerCase() !== rdata[idLabel].toLowerCase())
          ) continue

          let designerId = rdata[idLabel]
          if (!designerId || designerId === undefined || designerId === '') continue

          if (blockedList.findIndex(item => item === rdata['image_url']) < 0) {
            if (designer['newDesignerID'] && designer['newDesignerID'] !== undefined) {
              designerId = designer['newDesignerID']
            }

            // console.log('--rdata: ', rdata)
            if (materials.findIndex(item => item.image === rdata['image_url']) >= 0) continue
            materials.push({
              ...item,
              name:
                rdata['attributes'] && rdata['attributes'].length > 0 && rdata['attributes'][0].value,
              image: rdata['image_url'],
              thumbnail: thumbnailObj ? thumbnailObj[rdata['image_url']] : null,
              description: rdata['description']
            })

            setMaterialList([...materials])
          }
        } catch (exception) {
          console.log('exception: ', exception)
        }
      }
    }
  }

  useEffect(() => {
    if (!account) return
    loadData()
  }, [account])

  if (!account) {
    return (
      <div className={styles.beforeLoading}>
        <div className={styles.ldsEllipsis}><div></div><div></div><div></div><div></div></div>
      </div>
    )
  }

  if (!designerInfo || Object.keys(designerInfo).length <= 0) {
    return (
      <div className={styles.beforeLoading}>
        <div className={styles.ldsEllipsis}><div></div><div></div><div></div><div></div></div>
      </div>
    )
  }

  // console.log('materialList: ', materialList)

  return (
    <div className={styles.wrapper}>
      {isLoading && <Loader white size='large' className={styles.loader} />}
      <DesignerProfileTopPart 
        isEdit={true}
        designerInfo={designerInfo}
        materialList={materialList}
        marketplaceItems={marketplaceItems}
      />
      <DesignerProfileBottomPart 
        designerInfo={designerInfo}
        isEditable={true}
      />
    </div>
  )
}

export default EditDesignerProfile