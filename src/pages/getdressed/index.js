import { useDispatch, useSelector } from 'react-redux';
import Dropdown from '@components/Dropdown';
import { getAccount } from '@selectors/user.selectors';
import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import { getUser } from '@helpers/user.helpers';
import { openConnectMetamaskModal, openSignupModal } from '@actions/modals.actions';
import dressedActions from '@actions/dressed.actions';
import { getChainId, getExchangeRateETH, getMonaPerEth } from '@selectors/global.selectors';
import {
  POLYGON_MAINNET_CHAINID,
  MUMBAI_TESTNET_CHAINID,
  ETHEREUM_MAINNET_CHAINID,
} from '@constants/global.constants';
import api from '@services/api/espa/api.service';
import apiService from '@services/api/api.service';
import { useRouter } from 'next/router';

const GetDressed = () => {
  const dispatch = useDispatch();
  const [outfit, setOutfit] = useState([]);
  const router = useRouter();
  const [description, setDescription] = useState('');
  const curOutfitVersion = useRef();
  const [outfitVersion, setOutfitVersion] = useState(null);
  const [outfitPosition, setOutfitPosition] = useState([]);
  const [outfitRender, setOutfitRender] = useState(null);
  const [outfitCharacter, setOutfitCharacter] = useState(null);
  const [outfitNetwork, setOutfitNetwork] = useState(null);
  const [outfitStake, setOutfitStake] = useState(null);
  const [outfitPeriod, setOutfitPeriod] = useState(null);
  const [amount, setAmount] = useState(null);
  const [outfitPattern, setOutfitPattern] = useState([]);
  const [estimatedTimeline, setEstimatedTimeline] = useState(0);
  const [success, setSuccess] = useState(false);
  const account = useSelector(getAccount);
  const chainId = useSelector(getChainId);
  const user = useSelector(getUser);
  const monaPerEth = useSelector(getMonaPerEth);
  const exchangeRateETH = useSelector(getExchangeRateETH);
  const [materials, setMaterials] = useState([]);
  const outfits = [
    {
      name: 'Hat',
      img: '/images/dressed/hat 1.png',
    },
    {
      name: 'Dress',
      img: '/images/dressed/dress 1.png',
    },
    {
      name: 'Shirt',
      img: '/images/dressed/casual-t-shirt- 1.png',
    },
    {
      name: 'Pants',
      img: '/images/dressed/trousers 1.png',
    },
    {
      name: 'Shoes',
      img: '/images/dressed/sport-shoe 1.png',
    },
    {
      name: 'Sunglasses',
      img: '/images/dressed/circular-sunglasses 1.png',
    },
    {
      name: 'Accessories',
      img: '/images/dressed/necklace 1.png',
    },
    {
      name: 'Swimwear',
      img: '/images/dressed/bikini-one-piece-swimwear 1.png',
    },
    {
      name: 'Full Outfit',
      img: '/images/dressed/outfit 1.png',
    },
  ];
  const outfitVersions = [
    'High fidelity 3D, 2D art style + in-game',
    'High fidelity 3D + in-game',
    '2D art style + in-game',
    'In-game/mod only',
    'High fidelity 3D only',
    '2D art style only',
    'High fidelity 3D + 2D art style',
  ];
  const outfitPositions = [
    'Decentraland',
    'Cryptovoxels',
    'Roblox',
    'Minecraft',
    'Among Us',
    'Some other game mod I outlined in description box',
  ];
  const outfitRenders = [
    'STILL IMAGE',
    'RUNWAY WALK ANIMATION',
    'TURNTABLE ANIMATION',
    'DANCE ANIMATION',
    'WALK ON SPOT ANIMATION',
  ];
  const outfitCharacters = ['WITH MODEL', 'WITHOUT MODEL'];
  const outfitNetworks = ['Polygon Network', 'Ethereum Network'];
  const outfitStakes = ['YES', 'NO'];
  const outfitPeriods = ['YES', 'No, I’m good'];
  const [pageNumber, setPageNumber] = useState(0);
  const [mainPrice, setMainPrice] = useState(0);
  const [characterPrice, setCharacterPrice] = useState(0);
  const [networkPrice, setNetworkPrice] = useState(0);
  const [periodPrice, setPeriodPrice] = useState(0);
  const [renderPrice, setRenderPrice] = useState(0);
  const [gamePrice, setGamePrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isMonaApproved, setIsMonaApproved] = useState(false);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [file3, setFile3] = useState(null);
  const [lookText, setLookText] = useState('');
  const [designers, setDesigners] = useState([]);
  const [designerList, setDesignerList] = useState([]);
  const prices = [
    {
      Hat: 350,
      Dress: 600,
      Shirt: 450,
      Pants: 370,
      Shoes: 350,
      Sunglasses: 200,
      Jewellery: 250,
      Swimwear: 300,
      'Full Outfit': 1600,
    },
    {
      Hat: 110,
      Dress: 350,
      Shirt: 300,
      Pants: 280,
      Shoes: 250,
      Sunglasses: 150,
      Jewellery: 170,
      Swimwear: 150,
      'Full Outfit': 650,
    },
  ];

  const showOutfitPositions = () => {
    const pos = outfitVersions.indexOf(curOutfitVersion.current);
    return pos !== -1 && pos <= 3;
  };

  const showOutfitRenders = () => {
    const pos = outfitVersions.indexOf(curOutfitVersion.current);
    return pos === 0 || pos === 1 || pos === 4 || pos === 6;
  };

  const showOutfitCharacters = () => {
    const pos = outfitVersions.indexOf(curOutfitVersion.current);
    return pos !== 3 && pos !== -1;
  };

  const checkOutfitVersionType = () => {
    const res = [];
    if (outfitVersion?.includes('High fidelity 3D')) {
      res.push(0);
    }
    if (outfitVersion?.includes('2D art style')) {
      res.push(1);
    }

    return res;
  };

  const calculateTimeline = () => {
    const ids = checkOutfitVersionType();
    let timeline = 0;
    if (ids.includes(0)) {
      timeline = 7;
      if (outfit.includes('Full Outfit') || outfitRender) {
        timeline = 10.5;
      }
      if (outfitCharacter === outfitCharacters[0]) {
        timeline = 14;
      }
      if (outfitPeriod === outfitPeriods[0]) {
        timeline = 4;
      }
    } else if (ids.includes(1)) {
      timeline = 2;
      if (outfitPeriod === outfitPeriods[0]) {
        timeline = 1;
      }
      if (outfitVersion?.includes('game')) {
        timeline = 7;
      }
    } else if (outfitVersion?.includes('game')) {
      timeline = 7;
    }
    setEstimatedTimeline(timeline);
  };

  useEffect(() => {
    calculateTimeline();
  }, [
    outfit,
    outfitVersion,
    outfitCharacter,
    outfitNetwork,
    outfitStake,
    outfitPeriod,
    outfitPosition,
    outfitRender,
  ]);

  const getVal = (value) => {
    if (isNaN(value)) return 0;
    return value;
  };

  useEffect(() => {
    setTotalPrice(
      getVal(mainPrice) +
        getVal(characterPrice) +
        getVal(networkPrice) +
        getVal(periodPrice) +
        getVal(renderPrice) +
        getVal(gamePrice)
    );
  }, [mainPrice, characterPrice, networkPrice, periodPrice, renderPrice, gamePrice]);

  useEffect(() => {
    if (outfitVersion && outfit.length) {
      let price = 0;
      const ids = checkOutfitVersionType();

      ids.forEach((id) => {
        outfit.forEach((fit) => {
          price += getVal(prices[id][fit]);
        });
      });

      setMainPrice(price);
    } else {
      setMainPrice(0);
    }
  }, [outfitVersion, outfit]);

  useEffect(() => {
    const ids = checkOutfitVersionType();
    if (outfitCharacter && (ids.includes(0) || ids.includes(1))) {
      if (outfitCharacter === outfitCharacters[0]) {
        let price = 0;
        if (ids.includes(0)) {
          price += 400;
        }
        if (ids.includes(1)) {
          price += 100;
        }
        setCharacterPrice(price);
      } else {
        setCharacterPrice(0);
      }
    } else {
      setCharacterPrice(0);
    }
  }, [outfitCharacter, outfitVersion]);

  useEffect(() => {
    const ids = checkOutfitVersionType();
    if (outfitNetwork && (ids.includes(0) || ids.includes(1))) {
      if (outfitNetwork === outfitNetworks[1]) {
        setNetworkPrice(50 * ids.length);
      } else {
        setNetworkPrice(0);
      }
    } else {
      setNetworkPrice(0);
    }
  }, [outfitNetwork, outfitVersion]);

  useEffect(() => {
    const ids = checkOutfitVersionType();
    if (outfitPeriod && (ids.includes(0) || ids.includes(1))) {
      if (outfitPeriod === outfitPeriods[0]) {
        let price = 0;
        if (ids.includes(0)) {
          price += 300;
        }
        if (ids.includes(1)) {
          price += 20;
        }
        setPeriodPrice(price);
      } else {
        setPeriodPrice(0);
      }
    } else {
      setPeriodPrice(0);
    }
  }, [outfitPeriod, outfitVersion]);

  useEffect(() => {
    const ids = checkOutfitVersionType();
    if (outfitRender && (ids.includes(0) || ids.includes(1))) {
      if (outfitRender !== outfitRenders[0]) {
        if (ids.includes(0)) {
          let prices = [130, 70, 150, 100];
          setRenderPrice(prices[outfitRenders.indexOf(outfitRender) - 1]);
          return;
        }
      }
      setRenderPrice(0);
    } else {
      setRenderPrice(0);
    }
  }, [outfitRender, outfitVersion]);

  const loadData = async () => {
    const designers = (await api.getAllDesigners()) || [];
    setDesignerList(designers.map((designer) => designer.designerId));
  };

  useEffect(() => {
    loadData();
    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);
  }, []);

  useEffect(() => {
    if (pageNumber !== 13 && success) setSuccess(false);
    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);
  }, [pageNumber]);

  const onKeydown = (e) => {
    if (e.keyCode !== 13) return;
    if (pageNumber >= 13) return;
    handleNext();
  };

  useEffect(() => {
    if (outfitPosition && outfitVersion?.includes('game')) {
      const prices = [600, 200, 200, 200, 200, 200];
      let price = 0;
      outfitPosition.forEach((position) => {
        price += prices[outfitPositions.indexOf(position)] * outfit.length;
      });
      setGamePrice(price);
    } else {
      setGamePrice(0);
    }
  }, [outfitPosition, outfit, outfitVersion]);

  useEffect(() => {
    if (!account) return;
    dressedActions.isApproved(account, chainId).then((isApproved) => {
      setIsMonaApproved(isApproved);
    });
  }, [chainId, account]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const { digitalaxMaterialV2S } = await apiService.getMaterialVS();
      console.log('digitalaxMaterialV2S: ', digitalaxMaterialV2S)
      const mats = digitalaxMaterialV2S.filter((material) =>
        material.attributes.find((item) => item.type === 'Name of Item')
      );
      setMaterials([
        ...new Set(
          mats.map(
            (material, index) =>
              material.attributes.find((item) => item.type === 'Name of Item').value
          )
        ),
      ]);
    };

    fetchMaterials();
  }, []);

  const submitTx = async () => {
    const monaPrice = (totalPrice / (monaPerEth * exchangeRateETH)).toFixed(2);

    try {
      const realPrice = parseFloat(amount) > monaPrice ? amount : monaPrice;
      await dressedActions.sendMona(account, chainId, realPrice);

      const res = await api.saveDressedInfo({
        wallet: account,
        outfit: outfit,
        outfitPattern,
        description,
        outfitVersion,
        outfitPosition,
        outfitRender,
        outfitCharacter,
        outfitNetwork,
        outfitStake,
        outfitPeriod,
        lookText,
        designers,
        file1: file1,
        file2: file2,
        file3: file3,
        amount: realPrice,
      });

      setGamePrice(0);
      setTotalPrice(0);
      setRenderPrice(0);
      setPeriodPrice(0);
      setNetworkPrice(0);
      setCharacterPrice(0);
      setMainPrice(0);
      setSuccess(true);
    } catch (e) {
      console.log({ e });
    }
  };

  const onRequestApprove = async () => {
    // setLoading(true)
    await dressedActions.approveMona(account, chainId);
    const isApproved = await dressedActions.isApproved(account, chainId);
    setIsMonaApproved(isApproved);
    submitTx();
  };

  const onSubmit = async () => {
    if (
      chainId != POLYGON_MAINNET_CHAINID &&
      chainId != MUMBAI_TESTNET_CHAINID &&
      chainId != ETHEREUM_MAINNET_CHAINID
    ) {
      toast('Please switch to Polygon or Ethereum Network.');
      return;
    }

    if (!account) {
      dispatch(openConnectMetamaskModal());
      return;
    }

    if (!user) {
      dispatch(openSignupModal());
      return;
    }
    if (!mainPrice) {
      window.alert('You must select at least one outfit and outfit version.');
      return;
    }

    if (!isMonaApproved) {
      onRequestApprove();
      return;
    }

    submitTx();
  };

  const fileChange = async (e, fileIndex) => {
    let files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) {
      return;
    }

    const url = await dressedActions.uploadImage(files[0]);

    if (fileIndex === 1) setFile1(url);
    if (fileIndex === 2) setFile2(url);
    if (fileIndex === 3) setFile3(url);

    return url;
  };

  const handlePrev = () => {
    if (pageNumber <= 7 && pageNumber >= 5) {
      console.log({ show: showOutfitRenders() });
      if (pageNumber === 7 && showOutfitCharacters()) {
        setPageNumber(6);
        return;
      }
      if (pageNumber >= 6 && showOutfitRenders()) {
        setPageNumber(5);
        return;
      }
      if (pageNumber >= 5 && showOutfitPositions()) {
        setPageNumber(4);
        return;
      }
      setPageNumber(3);
      return;
    }
    setPageNumber(pageNumber - 1);
  };

  const handleNext = () => {
    if (pageNumber >= 3 && pageNumber <= 5) {
      console.log(outfitVersion);
      if (pageNumber === 3 && showOutfitPositions()) {
        setPageNumber(4);
        return;
      }
      if (pageNumber <= 4 && showOutfitRenders()) {
        setPageNumber(5);
        return;
      }
      if (pageNumber <= 5 && showOutfitCharacters()) {
        setPageNumber(6);
        return;
      }
      setPageNumber(7);
      return;
    }
    setPageNumber(pageNumber + 1);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        {pageNumber === 0 && (
          <>
            <div className={styles.title}>Get Dressed by the GDN for the Metaverse</div>
            <div className={styles.subTitle}>
              Welcome to the bespoke metaverse tailor shop! Get measured by our web3 tailors and
              rock styles across the digi-fizzy realms. Take a look at the menu of what’s in season
              and tell us how good you want to look. The metaverse awaits your style.
            </div>
            <div className={styles.pinkTitle}>
              All looks include the 3D source file and are sent as a 721 NFT. If you choose to
              include an open source patterns, materials or textures, 1155 NFTs are also linked
              under the{' '}
              <a
                href="https://designers.digitalax.xyz/fractional/"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                Fractional Garment Ownership standard.{' '}
              </a>{' '}
              <br />
              <br />
              You can also choose specific designers to stitch your outfit!
            </div>
          </>
        )}
        {pageNumber === 1 && (
          <div className={styles.row}>
            <div className={styles.label}>
              Choose the parts of your outfit you’d like to have tailored.
            </div>
            <div className={styles.outfitsWrapper}>
              {outfits.map((item) => (
                <div
                  className={styles.outfitsItem}
                  key={item.name}
                  onClick={() => {
                    if (outfit.includes(item.name)) {
                      setOutfit(outfit.filter((fit) => fit !== item.name));
                    } else {
                      setOutfit([...outfit, item.name]);
                    }
                  }}
                >
                  <div
                    className={cn(
                      styles.imageWrapper,
                      outfit.includes(item.name) ? styles.active : styles.deactive
                    )}
                  >
                    <img src={item.img} alt="" />
                    <div className={styles.outfitName}>{item.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {pageNumber === 2 && (
          <>
            <div className={styles.row}>
              <div className={styles.descriptionLabel}>
                Give us a brief description and overview of how you’d like to be dressed & where we
                should take inspiration from.
              </div>
              <textarea
                className={styles.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.fileLabel}>
                Upload some reference images & inspiration for your outfit.
              </div>
              <div className={styles.fileuploads}>
                <button className={styles.fileupload}>
                  {file1 ? (
                    <img src={file1} />
                  ) : (
                    <div className={styles.uploadbutton}> file upload </div>
                  )}
                  <input type="file" onChange={(e) => fileChange(e, 1)} />
                </button>
                <button className={styles.fileupload}>
                  {file2 ? (
                    <img src={file2} />
                  ) : (
                    <div className={styles.uploadbutton}> file upload </div>
                  )}
                  <input type="file" onChange={(e) => fileChange(e, 2)} />
                </button>
                <button className={styles.fileupload}>
                  {file3 ? (
                    <img src={file3} />
                  ) : (
                    <div className={styles.uploadbutton}> file upload </div>
                  )}
                  <input type="file" onChange={(e) => fileChange(e, 3)} />
                </button>
              </div>
            </div>
          </>
        )}
        {pageNumber === 3 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                What versions of your outfit would you like? For high fidelity versions of your NFT
                check out the DIGITALAX Marketplace{' '}
                <a href="https://fashion.digitalax.xyz/" target="_blank">
                  {' '}
                  here
                </a>{' '}
                for examples, for 2D examples see{' '}
                <a href="https://fashion.digitalax.xyz/marketplace/all/0/" target="_blank">
                  here
                </a>
                .
              </div>
              <Dropdown
                options={outfitVersions}
                value={outfitVersion}
                onChange={(v) => {
                  setOutfitVersion(v);
                  curOutfitVersion.current = v;
                  console.log('this is outfit version select', v);
                }}
              />
            </div>
          </div>
        )}
        {pageNumber === 4 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Where would you like to wear your outfit? Take your style across the metaverse into
                different game and social environments.
              </div>
              <Dropdown
                multi
                options={outfitPositions}
                value={outfitPosition}
                onChange={(v) => {
                  if (outfitPosition.includes(v))
                    setOutfitPosition([...outfitPosition.filter((position) => position !== v)]);
                  else setOutfitPosition([...outfitPosition, v]);
                }}
              />
            </div>
          </div>
        )}
        {pageNumber === 5 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Would like the high fidelity art collectible version to be still or animation
                render? See some different render and animation types{' '}
                <a href="https://fashion.digitalax.xyz/" target="_blank">
                  here
                </a>
                .
              </div>
              <Dropdown
                options={outfitRenders}
                value={outfitRender}
                onChange={(v) => setOutfitRender(v)}
              />
            </div>
          </div>
        )}
        {pageNumber === 6 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Do you want just the garment or it worn by a model/character?
                <span className={styles.tooltip}>
                  <img src="/images/dressed/question.png" alt="" />
                  <div className={styles.body}>
                    This is in reference to the high fidelity 3D or 2D art collectible render.
                  </div>
                </span>
              </div>
              <Dropdown
                options={outfitCharacters}
                value={outfitCharacter}
                onChange={(v) => setOutfitCharacter(v)}
              />
            </div>
          </div>
        )}
        {pageNumber === 7 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Include patterns, materials or textures from the open source 1155 on-chain
                libraries? You can{' '}
                <a href="https://designers.digitalax.xyz/opensourcelibraries/" target="_blank">
                  view all open source prints here.
                </a>{' '}
                Search by print name below.
                <span className={styles.subLabel}>
                  You can include up to 15. Each print is an 1155 NFT and is included in your order
                  on-chain under the{' '}
                  <a href="https://designers.digitalax.xyz/fractional/" target="_blank">
                    Fractional Garment Ownership Standard
                  </a>
                  , whereby the master garment ERC-721 NFT owns a balance of 1155 Child NFTs.
                </span>
              </div>
              <Dropdown
                options={materials}
                value={outfitPattern}
                onChange={(v) => {
                  if (outfitPattern.includes(v))
                    setOutfitPattern([...outfitPattern.filter((material) => material !== v)]);
                  else setOutfitPattern([...outfitPattern, v]);
                }}
                multi
                ascending
                searchable
                placeholder="Enter the name/s of the pattern, material, texture from the library. "
              />
            </div>
          </div>
        )}
        {pageNumber === 8 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Estimated Delivery is{' '}
                <span>
                  {estimatedTimeline >= 7
                    ? `${estimatedTimeline / 7 === 1 ? '1 week' : `${estimatedTimeline / 7} weeks`}`
                    : `${estimatedTimeline === 1 ? '1 day' : `${estimatedTimeline} days`}`}
                </span>
                . Would you like to accelerate the delivery?
              </div>
              <Dropdown
                options={outfitPeriods}
                value={outfitPeriod}
                onChange={(v) => setOutfitPeriod(v)}
              />
            </div>
          </div>
        )}
        {pageNumber === 9 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Would you like the NFT to be minted on Ethereum or Polygon network? It will be
                airdropped to you on the network of your choice. You can also bridge it between
                networks using our multi-token bridge{' '}
                <a href="https://fashion.digitalax.xyz/bridge/" target="_blank">
                  here
                </a>
                .
              </div>
              <Dropdown
                options={outfitNetworks}
                value={outfitNetwork}
                onChange={(v) => setOutfitNetwork(v)}
              />
            </div>
          </div>
        )}
        {pageNumber === 10 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Would you like to be able to stake your NFT for crypto yield? You can stake your NFT
                in our staking contracts on Polygon or Ethereum and earn $MONA token.
                <br />
                <span className={styles.subLabel}>#Wear2Earn #Wear2DeFi</span>
              </div>
              <Dropdown
                options={outfitStakes}
                value={outfitStake}
                onChange={(v) => setOutfitStake(v)}
              />
            </div>
          </div>
        )}
        {pageNumber === 11 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Which LOOK text would you like included in your outfit? Specify the LookBook number
                and the specific text phrase.
                <span className={styles.subLabel}>
                  {' '}
                  You can learn more about the LOOK composable generated text experiment{' '}
                  <a href="https://www.digitalax.xyz/look" target="_blank">
                    here
                  </a>
                  .{' '}
                </span>
              </div>
              <input
                placeholder="i.e. LookBook 1301, Ring T-Shirt."
                type="text"
                className={styles.input}
                value={lookText}
                onChange={(e) => setLookText(e.target.value)}
              />
            </div>
          </div>
        )}
        {pageNumber === 12 && (
          <div className={styles.row}>
            <div className={styles.optionItem}>
              <div className={styles.optionLabel}>
                Are there any specific GDN Designers that you would like to have work on this
                garment?
                <span className={styles.subLabel}>
                  {' '}
                  You can check out all of the cool fashion anarchy the GDN is brewing up{' '}
                  <a href="https://designers.digitalax.xyz/global/" target="_blank">
                    here
                  </a>
                  , and see what specific designers are up to!{' '}
                </span>
                You can choose between one or more designers to collaborate on your garment.
              </div>
              <Dropdown
                options={designerList}
                value={designers}
                multi
                searchable
                ascending
                placeholder="Search by designer name"
                onChange={(v) => {
                  if (designers.includes(v))
                    setDesigners([...designers.filter((designer) => designer !== v)]);
                  else setDesigners([...designers, v]);
                }}
              />
            </div>
          </div>
        )}
        {pageNumber === 13 && (
          <>
            <div className={styles.row}>
              <div className={styles.amountLabel}>
                Every item has a reserve price, for your order it is{' '}
                <span>{(totalPrice / (monaPerEth * exchangeRateETH)).toFixed(2)} $MONA</span>, bid
                up to tempt the best tailors!
              </div>
              <input
                type="number"
                step="0.01"
                min={(totalPrice / (monaPerEth * exchangeRateETH)).toFixed(2)}
                className={styles.input}
                placeholder="Enter an amount above reserve"
                value={amount}
                onBlur={(e) => {
                  const maxValue = (totalPrice / (monaPerEth * exchangeRateETH)).toFixed(2);
                  if (amount < maxValue) {
                    setAmount(maxValue);
                  }
                }}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.submitLabel}>
                You can choose to pay on Ethereum or Polygon network. Prices might be slightly
                different due to the live oracle.
              </div>
              <button type="button" className={styles.submit} onClick={onSubmit}>
                {isMonaApproved ? 'Submit Purchase & Get Dressed!' : 'Approve Mona Spend'}
              </button>
              {success && <div className={styles.success}>
                Success! Check out some more web3 fashion <a href="https://fashion.digitalax.xyz/" target="_blank">here</a>!
              </div>}
            </div>
          </>
        )}
        {pageNumber === 0 ? (
          <button type="button" className={styles.nextButton} onClick={handleNext}>
            Get Dressed!
          </button>
        ) : (
          <div className={styles.pageActionsWrapper}>
            {pageNumber !== 13 ? (
              <>
                <div className={styles.actionsRow}>
                  <button type="button" className={styles.nextButton} onClick={handleNext}>
                    Continue Stitching
                  </button>
                  <div className={styles.nextButtonTip}>
                    Press Enter
                    <img src="/images/dressed/enter 1.png" />
                  </div>
                </div>
                <div className={styles.actionsRow}>
                  <button type="button" className={styles.returnButton} onClick={handlePrev}>
                    Return
                    <img src="/images/dressed/go-back-arrow 1.png" />
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.actionsRow}>
                <button type="button" className={styles.returnButton} onClick={handlePrev}>
                  Return
                  <img src="/images/dressed/go-back-arrow 1.png" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetDressed;
