import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  FormControl,
  ClickAwayListener,
  Popper,
  Tooltip,
  InputBase,
  Fade,
  Select,
  MenuItem,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Input from '../../components/Input';
import { upload as UploadToPinata } from '../../utils/pinata';
import { getAccount } from '@selectors/user.selectors';
import { EXCLUSIVE_RARITY, COMMON_RARITY, SEMI_RARE_RARITY } from '@constants/global.constants';
import styles from './styles.module.scss';

const abi = [
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'garmentTokenId', type: 'uint256' }],
    name: 'GarmentCreated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'accessControls',
    outputs: [{ internalType: 'contract DigitalaxAccessControls', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: '_uri', type: 'string' }],
    name: 'createNewChild',
    outputs: [{ internalType: 'uint256', name: 'childTokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_childTokenUri', type: 'string' },
      { internalType: 'uint256', name: '_childTokenAmount', type: 'uint256' },
    ],
    name: 'createNewChildWithVerifiedRole',
    outputs: [{ internalType: 'uint256', name: 'childTokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string[]', name: '_uris', type: 'string[]' }],
    name: 'createNewChildren',
    outputs: [{ internalType: 'uint256[]', name: 'childTokenIds', type: 'uint256[]' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: '_garmentTokenUri', type: 'string' },
      { internalType: 'address', name: '_designer', type: 'address' },
      { internalType: 'string[]', name: '_childTokenUris', type: 'string[]' },
      { internalType: 'uint256[]', name: '_childTokenAmounts', type: 'uint256[]' },
      { internalType: 'address', name: '_beneficiary', type: 'address' },
    ],
    name: 'createNewChildrenWithBalanceAndGarment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: '_childTokenUris', type: 'string[]' },
      { internalType: 'uint256[]', name: '_childTokenAmounts', type: 'uint256[]' },
      { internalType: 'address', name: '_beneficiary', type: 'address' },
    ],
    name: 'createNewChildrenWithBalances',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: '_childTokenUris', type: 'string[]' },
      { internalType: 'uint256[]', name: '_childTokenAmounts', type: 'uint256[]' },
    ],
    name: 'createNewChildrenWithVerifiedRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'garmentToken',
    outputs: [{ internalType: 'contract DigitalaxGarmentNFT', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract DigitalaxGarmentNFT', name: '_garmentToken', type: 'address' },
      { internalType: 'contract DigitalaxMaterials', name: '_materials', type: 'address' },
      {
        internalType: 'contract DigitalaxAccessControls',
        name: '_accessControls',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'materials',
    outputs: [{ internalType: 'contract DigitalaxMaterials', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'garmentTokenUri', type: 'string' },
      { internalType: 'address', name: 'designer', type: 'address' },
      { internalType: 'uint256[]', name: 'childTokenIds', type: 'uint256[]' },
      { internalType: 'uint256[]', name: 'childTokenAmounts', type: 'uint256[]' },
      { internalType: 'address', name: 'beneficiary', type: 'address' },
    ],
    name: 'mintParentWithChildren',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'garmentTokenUri', type: 'string' },
      { internalType: 'address', name: 'designer', type: 'address' },
      { internalType: 'address', name: 'beneficiary', type: 'address' },
    ],
    name: 'mintParentWithoutChildren',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const address = '0xED1cACcB23e4eC422ca56Ba4FB0fEA14822337fd';

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

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

function Minting(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const account = useSelector(getAccount);

  console.log('account: ', account);

  const [status, setStatus] = useState(0);

  const [designerId, setDesignerId] = useState('');
  const [issueNo, setIssueNo] = useState('');
  const [pattern, setPattern] = useState('pattern');
  const [traits, setTraits] = useState('');
  const [degree, setDegree] = useState('Common');
  const [description, setDescription] = useState('');
  const [renderFile, setRenderFile] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [itemName, setItemName] = useState('');

  const [istooltip, setIstooltip] = React.useState(false);

  const handleTooltip = () => {
    setIstooltip(!istooltip);
  };
  const handleLeave = () => {
    setIstooltip(false);
  };
  const screenWidth = useWindowDimensions().width;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    screenWidth > 472 ? setIsMobile(false) : setIsMobile(true);
  }, [screenWidth]);

  const handleSourceFileChange = (e) => {
    setSourceFile(e.target.files[0]);
  };

  const handleRenderFileChange = (e) => {
    setRenderFile(e.target.files[0]);
  };

  const handleContributeClick = async () => {
    if (
      designerId === '' ||
      issueNo === '' ||
      pattern === '' ||
      traits === '' ||
      !renderFile ||
      description === '' ||
      itemName === ''
    ) {
      setStatus(-1);
      return;
    }
    setStatus(1);
    try {
      const metaJson = {
        'Designer ID': designerId,
        description: description,
        external_url: 'http://designers.digitalax.xyz/',
        attributes: [
          {
            trait_type: 'Pattern, Material, Texture Name',
            value: pattern,
          },
          {
            trait_type: 'Issue No.',
            value: issueNo,
          },
          {
            trait_type: 'Unique Traits',
            value: traits,
          },
          {
            trait_type: 'Degree of Exclusivity',
            value: degree,
          },
          {
            trait_type: 'Name of Item',
            value: itemName,
          },
        ],
      };

      const url = await UploadToPinata(metaJson, renderFile, sourceFile);
      console.log('url: ', url);
      if (!url) {
        return;
      }
      const contract = new window.web3.eth.Contract(abi, address);
      console.log('this is before mint', address);
      console.log('this is before mint account: ', account);
      let response = await contract.methods
        .createNewChildWithVerifiedRole(url, 1)
        .send({ from: account });

      console.log('===createChild response: ', response);
      setStatus(2);
    } catch (error) {
      console.log('===error: ', error);
    }
  };

  // const handleHover = (text) => (event) => {
  //   setAnchorEl(event.currentTarget)
  //   setOpen((prev) => !prev)
  //   setText(text)
  // }

  const setValue = (func, value) => {
    if (!value.includes('"')) {
      func(value);
    }
  };

  return (
    <div className="mintingdiv">
      <Popper open={open} anchorEl={anchorEl} placement="right" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <span>{text}</span>
          </Fade>
        )}
      </Popper>
      <div className="bg-black mintingcontainer">
        {!isMobile ? (
          <div className="mt-10">
            <p
              className="font-inter font-black whitespace-normal text-gradient"
              style={{ fontSize: '86px' }}
            >
              Contribute to Open
            </p>
            <p
              className="font-inter font-black whitespace-normal text-gradient"
              style={{ fontSize: '86px' }}
            >
              Source On-Chain
            </p>
            <p
              className="font-inter font-black whitespace-normal text-gradient"
              style={{ fontSize: '86px' }}
            >
              Libraries
            </p>
          </div>
        ) : (
          <>
            <div className="mt-10 mintingheader">
              <p
                className="font-inter font-black whitespace-normal text-gradient"
                style={{ fontSize: '50px' }}
              >
                Contribute to
              </p>
              <p
                className="font-inter font-black whitespace-normal text-gradient"
                style={{ fontSize: '50px' }}
              >
                Open Source
              </p>
              <p
                className="font-inter font-black whitespace-normal text-gradient"
                style={{ fontSize: '50px' }}
              >
                On-Chain
              </p>
              <p
                className="font-inter font-black whitespace-normal text-gradient"
                style={{ fontSize: '50px' }}
              >
                Libraries
              </p>
            </div>
            <div className="greenbox" />
            <div className="violetbox" />
          </>
        )}

        <div className="mintingtext">
          <p className="text-gray-50 minttext">
            Enter the information in the fillout boxes below to mint your 1155 NFT and contribute to
            our open sourced material, pattern, texture on-chain libraries. Your contribution can be
            used in master garments by other designers, artists, creators— it is open sourced. Open
            source doesn’t mean without monetisation. Our infrastructure is being built to
            eventually support automated fractional royalties for any designer as they contribute to
            open source libraries that can be leveraged in both the digital and physical dimensions.
            A decentralised commercial model.
          </p>
          <p className="text-gray-50 minttext mt-5">
            Although we can’t automatically enforce in smart contract code this fractional
            cross-chain, cross-realm royalty distribution as of yet, we still are continuing to
            prove out the model and hope that those that use these open source prints contribute a
            fractional portion of the sales back to the DIGITALAX, as we have done and plan to do
            for anyone contributing to our on-chain libraries going forward. Your NFT is minted on
            Matic Network for 99% more energy efficiency than the Ethereum or Bitcoin blockchains.
            Through our MultiToken bridge these NFTs can be bridged back to Ethereum for additional
            interoperability and functionalities.
          </p>
        </div>

        {!isMobile ? (
          <div className="flex flex-col w-1/2 mt-12 mb-20">
            <div className="flex justify-center">
              <div className="w-1/2 flex flex-col mr-10">
                <Input
                  label="Designer ID"
                  required="true"
                  description="Creator Name or pseudonym."
                  value={designerId}
                  onChange={(e) => setValue(setDesignerId, e.target.value)}
                />
                {/* <Input
                  label="Pattern, Material, Texture"
                  value={pattern}
                  onChange={(e) => setValue(setPattern, e.target.value)}
                /> */}
                <FormControl variant="filled" fullWidth>
                  <Select
                    id="itemType"
                    className="mt-16 border-1 border-third bg-white h-9 text-left"
                    style={{ color: 'white' }}
                    value={pattern}
                    inputProps={{
                      classes: {
                        root: styles.rootClass,
                        icon: styles.arrowClass,
                      },
                    }}
                    label="Pattern or Material"
                    onChange={(e) => setValue(setPattern, e.target.value)}
                  >
                    <MenuItem value={'pattern'}>Pattern</MenuItem>
                    <MenuItem value={'material'}>Material</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="filled" fullWidth>
                  <Select
                    id="degreeOfExclusivity"
                    className="mt-16 border-1 border-third bg-white h-9 text-left"
                    style={{ color: 'white' }}
                    value={degree}
                    inputProps={{
                      classes: {
                        root: styles.rootClass,
                        icon: styles.arrowClass,
                      },
                    }}
                    label="Degree of Exclusivity"
                    onChange={(e) => setValue(setDegree, e.target.value)}
                  >
                    <MenuItem value={COMMON_RARITY}>Common</MenuItem>
                    <MenuItem value={SEMI_RARE_RARITY}>Semi-Rare</MenuItem>
                    <MenuItem value={EXCLUSIVE_RARITY}>Exclusive</MenuItem>
                  </Select>
                </FormControl>
                <Input
                  label="Name of Item"
                  value={itemName}
                  onChange={(e) => setValue(setItemName, e.target.value)}
                />
              </div>
              <div className="w-1/2 flex flex-col">
                <Input
                  value={issueNo}
                  onChange={(e) => setValue(setIssueNo, e.target.value)}
                  label="Issue No."
                  required="true"
                  description="Provide an issue number for your own cataloging & on-chain sorting as you grow your contributions overtime. "
                />
                <Input
                  value={traits}
                  onChange={(e) => setValue(setTraits, e.target.value)}
                  label="Unique Traits"
                  required="true"
                  description="Anything else that you want minted on chain with the contribution. Separate by commas."
                />
                <div className="flex flex-col mt-10 w-full">
                  <div className="flex">
                    <span className="font-inter font-extrabold text-gray-50 text-sm mb-2">
                      Rendered File Upload
                    </span>
                    <LightTooltip title="Files accepted PNG, JPEG" placement="right">
                      <span className="questionMark">?</span>
                    </LightTooltip>
                  </div>
                  <label
                    for="renderFile"
                    className="border-2 border-third bg-white rounded-2xl py-1 px-6 max-w-max font-inter text-xs font-medium"
                  >
                    Choose File
                  </label>
                  <InputBase
                    type="file"
                    id="renderFile"
                    inputProps={{
                      accept: '.jpg, .png, .jpeg',
                    }}
                    className="border-1 w-180 border-third bg-white h-9 w-2/3 hidden"
                    style={{ display: 'none' }}
                    onChange={handleRenderFileChange}
                  />
                  <span
                    className="font-medium font-inter text-xxs mx-16 mt-2 whitespace-nowrap"
                    style={{ color: '#868686' }}
                  >
                    {renderFile ? renderFile.name : 'No file Chosen'}
                  </span>
                </div>
                {pattern === 'material' && (
                  <div className="flex flex-col mt-10 w-full">
                    <div className="flex">
                      <span className="font-inter font-extrabold text-gray-50 text-sm mb-2">
                        Source File Upload
                      </span>
                      <LightTooltip title="Files accepted PNG, JPEG, ZIP" placement="right">
                        <span className="questionMark">?</span>
                      </LightTooltip>
                    </div>
                    <label
                      for="sourceFile"
                      className="border-2 border-third bg-white rounded-2xl py-1 px-6 max-w-max font-inter text-xs font-medium"
                    >
                      Choose File
                    </label>
                    <InputBase
                      type="file"
                      id="sourceFile"
                      inputProps={{
                        accept: '.jpg, .png, .jpeg, .zip',
                      }}
                      className="border-1 w-180 border-third bg-white h-9 w-2/3 hidden"
                      style={{ display: 'none' }}
                      onChange={handleSourceFileChange}
                    />
                    <span
                      className="font-medium font-inter text-xxs mx-16 mt-2 whitespace-nowrap"
                      style={{ color: '#868686' }}
                    >
                      {sourceFile ? sourceFile.name : 'No file Chosen'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-col mt-16">
                <span className="font-inter font-extrabold text-gray-50 text-sm mb-2">
                  Description
                </span>
                <InputBase
                  value={description}
                  onChange={(e) => setValue(setDescription, e.target.value)}
                  className="text-black border-1 border-third bg-white"
                  rows={5}
                  multiline
                  style={{ paddingLeft: 12 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mobileform">
            <div className="flex justify-center">
              <div className="w-full flex flex-col">
                <div style={{ marginTop: 37 }}>
                  <Input
                    label="Designer ID"
                    required="true"
                    description="Creator Name or pseudonym."
                    value={designerId}
                    onChange={(e) => setValue(setDesignerId, e.target.value)}
                  />
                </div>
                <div style={{ marginTop: 35 }}>
                  <Input
                    value={issueNo}
                    onChange={(e) => setValue(setIssueNo, e.target.value)}
                    label="Issue No."
                    required="true"
                    description="Provide an issue number for your own cataloging & on-chain sorting as you grow your contributions overtime. "
                  />
                </div>
                <div style={{ marginTop: 35 }}>
                  <FormControl variant="filled" fullWidth>
                    <Select
                      id="itemType"
                      className="mt-10 border-1 border-third bg-white h-9 text-left"
                      style={{ color: 'white' }}
                      value={pattern}
                      inputProps={{
                        classes: {
                          root: styles.rootClass,
                          icon: styles.arrowClass,
                        },
                      }}
                      label="Pattern or Material"
                      onChange={(e) => setValue(setPattern, e.target.value)}
                    >
                      <MenuItem value={'pattern'}>Pattern</MenuItem>
                      <MenuItem value={'material'}>Material</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                {/* <div style={{ marginTop: 35 }}>
                  <Input
                    label="Pattern, Material, Texture"
                    value={pattern}
                    onChange={(e) => setValue(setPattern, e.target.value)}
                  />
                </div> */}
                <div style={{ marginTop: 35 }}>
                  <Input
                    value={traits}
                    onChange={(e) => setValue(setTraits, e.target.value)}
                    label="Unique Traits"
                    required="true"
                    description="Anything else that you want minted on chain with the contribution. Separate by commas."
                  />
                </div>

                <div style={{ marginTop: 35 }}>
                  <FormControl variant="filled" fullWidth>
                    <Select
                      id="degreeOfExclusivity"
                      className="mt-10 border-1 border-third bg-white h-9 text-left"
                      style={{ color: 'white' }}
                      value={degree}
                      inputProps={{
                        classes: {
                          root: styles.rootClass,
                          icon: styles.arrowClass,
                        },
                      }}
                      label="Degree of Exclusivity"
                      onChange={(e) => setValue(setDegree, e.target.value)}
                    >
                      <MenuItem value={COMMON_RARITY}>Common</MenuItem>
                      <MenuItem value={SEMI_RARE_RARITY}>Semi-Rare</MenuItem>
                      <MenuItem value={EXCLUSIVE_RARITY}>Exclusive</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div style={{ marginTop: 32 }}>
                  <div className="flex flex-col mt-10 w-full">
                    <div className="flex">
                      <span
                        className="font-inter font-extrabold text-gray-50 mb-2"
                        style={{ fontSize: 14, lineHeight: '22px' }}
                      >
                        Rendered File Upload
                      </span>

                      <ClickAwayListener onClickAway={handleLeave}>
                        <Tooltip
                          title="Files accepted PNG, JPG"
                          placement="right-end"
                          open={istooltip}
                          classes={{ popper: classes.mobilePopper, tooltip: classes.tooltip }}
                        >
                          <span className="questionMark" onClick={handleTooltip}>
                            ?
                          </span>
                        </Tooltip>
                      </ClickAwayListener>
                    </div>
                    <label
                      for="renderFile"
                      className="border-2 file-border bg-white rounded-2xl py-1 px-6 max-w-max font-inter font-medium"
                      style={{ fontSize: 10 }}
                    >
                      Choose File
                    </label>
                    <InputBase
                      type="file"
                      id="renderFile"
                      className="border-1 w-180 border-third bg-white h-9 w-2/3 hidden"
                      style={{ display: 'none' }}
                      onChange={handleRenderFileChange}
                    />
                    <span
                      className="font-medium font-inter text-xxs mx-16 mt-2 whitespace-nowrap"
                      style={{ color: '#868686', fontSize: 10 }}
                    >
                      {renderFile ? renderFile.name : 'No file Chosen'}
                    </span>
                  </div>
                </div>

                {pattern === 'material' && (
                  <div style={{ marginTop: 32 }}>
                    <div className="flex flex-col mt-10 w-full">
                      <div className="flex">
                        <span
                          className="font-inter font-extrabold text-gray-50 mb-2"
                          style={{ fontSize: 14, lineHeight: '22px' }}
                        >
                          Source File Upload
                        </span>

                        <ClickAwayListener onClickAway={handleLeave}>
                          <Tooltip
                            title="Files accepted PNG, JPG, ZIP"
                            placement="right-end"
                            open={istooltip}
                            classes={{ popper: classes.mobilePopper, tooltip: classes.tooltip }}
                          >
                            <span className="questionMark" onClick={handleTooltip}>
                              ?
                            </span>
                          </Tooltip>
                        </ClickAwayListener>
                      </div>
                      <label
                        for="sourceFile"
                        className="border-2 file-border bg-white rounded-2xl py-1 px-6 max-w-max font-inter font-medium"
                        style={{ fontSize: 10 }}
                      >
                        Choose File
                      </label>
                      <InputBase
                        type="file"
                        id="sourceFile"
                        className="border-1 w-180 border-third bg-white h-9 w-2/3 hidden"
                        style={{ display: 'none' }}
                        onChange={handleSourceFileChange}
                      />
                      <span
                        className="font-medium font-inter text-xxs mx-16 mt-2 whitespace-nowrap"
                        style={{ color: '#868686', fontSize: 10 }}
                      >
                        {sourceFile ? sourceFile.name : 'No file Chosen'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="w-1/2 flex flex-col mr-10 w-full">
                <Input
                  label="Name of Item"
                  value={itemName}
                  onChange={(e) => setValue(setItemName, e.target.value)}
                />
              </div>
              <div className="flex flex-col" style={{ marginTop: 61 }}>
                <span
                  className="font-inter font-extrabold text-gray-50 mb-2"
                  style={{ fontSize: 14, lineHeight: '22px', marginBottom: 9 }}
                >
                  Description
                </span>
                <InputBase
                  value={description}
                  onChange={(e) => setValue(setDescription, e.target.value)}
                  className="text-black border-1 border-third bg-white"
                  rows={5}
                  multiline
                  style={{ paddingLeft: 12, height: 209 }}
                />
              </div>
              <button
                onClick={handleContributeClick}
                className="font-black text-base font-inter px-4 bg-fourth rounded-xl max-w-min"
                style={{
                  color: '#DB00FF',
                  marginTop: 38,
                  paddingTop: 7,
                  paddingBottom: 8,
                  fontSize: 15,
                }}
              >
                Contribute
              </button>
            </div>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={handleContributeClick}
            className="font-black text-base font-inter p-2 px-4 bg-fourth rounded-xl mt-12 max-w-min"
            style={{ color: '#DB00FF' }}
          >
            Contribute
          </button>
        )}

        <div>
          {status === -1 && <h2 style={{ color: 'red' }}>Please fill all fields</h2>}
          {status === 1 && <h2 style={{ color: 'white' }}>Processing</h2>}
          {status === 2 && <h2 style={{ color: 'green' }}>Success</h2>}
        </div>
      </div>
    </div>
  );
}
const useStyles = makeStyles({
  mobilePopper: {
    fontSize: 8,
    width: 204,
  },
  tooltip: {
    backgroundColor: 'white',
    color: '#111111',
    fontFamily: 'inter',
    lineHeight: '8px',
    width: 162,
    fontSize: 8,
    padding: '4px 8px',
    textAlign: 'center',
    borderRadius: 0,
    marginLeft: 8,
  },
});
export default Minting;
