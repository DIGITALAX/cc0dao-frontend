import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import { toast } from 'react-toastify';

import api from '@services/api/espa/api.service';
import designerActions from '@actions/designer.actions';

import Button from '@components/Button';
import ChooseFont from '../ChooseFont';
import styles from './styles.module.scss';

const BottomPart = (props) => {
  const { designerInfo, isEditable } = props;

  const [selectedTarget, setSelectedTarget] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [web3FashionItems, setWeb3FashionItems] = useState([]);
  const [isShowTextAdd, setIsShowTextAdd] = useState(false);
  const [isShowImageAdd, setIsShowImageAdd] = useState(false);
  const [isShowVideoAdd, setIsShowVideoAdd] = useState(false);
  const [isShowEmbededVideoAdd, setIsShowEmbededVideoAdd] = useState(false);
  const [imageFileName, setImageFileName] = useState('');
  const [videoFileName, setVideoFileName] = useState('');
  const [embededVideoFileName, setEmbededVideoFileName] = useState('');
  const [addTextDraft, setAddTextDraft] = useState('');
  const [isTextEdit, setIsTextEdit] = useState(false);
  const [scale, setScale] = useState(1);
  const [wrapperHeight, setWrapperHeight] = useState(800);

  const [showFont, setShowFont] = useState(false);
  const [currentTargetForFont, setCurrentTargetForFont] = useState(null);

  const selectoRef = useRef(null);
  const moveableRef = useRef(null);
  const [frameMap] = useState(() => new Map());

  const dispatch = useDispatch();

  function handleResize() {
    setSelectedTarget([]);
    setScale(window.innerWidth / 1920);
    const maxYValue = getMaxYValue();
    setWrapperHeight((maxYValue + 100) * scale);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return (_) => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    try {
      const web3Items = JSON.parse(designerInfo['web3FashionItems']);
      setWeb3FashionItems(web3Items);
      handleResize();
    } catch (e) {}
  }, [designerInfo['web3FashionItems']]);

  const Removable = {
    name: 'removable',
    props: {},
    events: {},
    render(moveable, React) {
      const rect = moveable.getRect();
      const { pos2 } = moveable.state;

      // use css for able
      const RemovableViewer = moveable.useCSS(
        'div',
        `
      {
        position: absolute;
        left: 0px;
        top: 0px;
        will-change: transform;
        transform-origin: 0px 0px;
      }
  
      .removable-button, .editable-button, .clone-button {
        position: relative;
        width: 24px;
        height: 24px;
        margin-bottom: 4px;
        background: #4af;
        border-radius: 4px;
        appearance: none;
        border: 0;
        color: white;
        font-weight: bold;
      }

      .editable-button {
        padding: 4px;
      }
  
      .removable-button::before, .removable-button::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 16px;
        height: 2px;
        background: #fff;
        border-radius: 1px;
        cursor: pointer;
      }
      
      .removable-button::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      .clone-button::before, .clone-button::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(90deg);
        width: 16px;
        height: 2px;
        background: #fff;
        border-radius: 1px;
        cursor: pointer;
      }
      
      .clone-button::after {
        transform: translate(-50%, -50%) rotate(180deg);
      }
      `
      );

      const isText =
        selectedIndex.length > 0 &&
        web3FashionItems[selectedIndex[0]] &&
        web3FashionItems[selectedIndex[0]].type === 'text';
      const isGroup = selectedIndex.length > 1;

      // Add key (required)
      // Add class prefix moveable-(required)
      return (
        <RemovableViewer
          key="removable-viewer"
          className={'moveable-removable'}
          style={{
            transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
            color: 'red',
          }}
        >
          <button
            className="removable-button"
            onClick={() => {
              const newWeb3FashionItems = [];

              web3FashionItems.forEach((item, index) => {
                if (selectedIndex.findIndex((selected) => selected == index) === -1) {
                  newWeb3FashionItems.push(item);
                }
              });

              setWeb3FashionItems(newWeb3FashionItems);
              setSelectedTarget([]);
            }}
          ></button>
          {!isGroup && isText && (
            <button
              className="editable-button"
              onClick={() => {
                setIsTextEdit(true);
              }}
            >
              <img src="/images/designer-page/edit.svg" />
            </button>
          )}
          {!isGroup && (
            <button
              className="clone-button"
              onClick={() => {
                const newItem = Object.assign({}, web3FashionItems[selectedIndex[0]]);
                const regex = /translate\([^)]+\)/g;
                newItem.style = {
                  ...newItem.style,
                  transform: newItem.style.transform.replace(regex, `translate(0, 0)`),
                };
                web3FashionItems.splice(selectedIndex[0] + 1, 0, newItem);

                setWeb3FashionItems(web3FashionItems);
                setSelectedTarget([]);
              }}
            ></button>
          )}
        </RemovableViewer>
      );
    },
  };

  const onClickTarget = (target, index) => {
    if (target.parentElement.classList && target.parentElement.classList.contains('target')) {
      setSelectedTarget([target.parentElement]);
      setSelectedIndex([index]);
      setIsTextEdit(false);
      return;
    }

    if (!target.classList || !target.classList.contains('target')) return;

    setSelectedTarget([target]);
    setSelectedIndex([index]);
    setIsTextEdit(false);
  };

  const onClickImage = () => {
    setIsShowImageAdd(true);
    setIsShowVideoAdd(false);
    setIsShowEmbededVideoAdd(false);
    setIsShowTextAdd(false);
    setSelectedTarget([]);
  };

  const onClickVideo = () => {
    setIsShowImageAdd(false);
    setIsShowEmbededVideoAdd(false);
    setIsShowVideoAdd(true);
    setIsShowTextAdd(false);
    setSelectedTarget([]);
  };

  const onClickEmbededVideo = () => {
    setIsShowImageAdd(false);
    setIsShowVideoAdd(false);
    setIsShowEmbededVideoAdd(true);
    setIsShowTextAdd(false);
    setSelectedTarget([]);
  };

  const onClickText = () => {
    setIsShowImageAdd(false);
    setIsShowVideoAdd(false);
    setIsShowEmbededVideoAdd(false);
    setIsShowTextAdd(true);
    setSelectedTarget([]);
  };

  const updateText = (text, index) => {
    web3FashionItems[index].value = text;
    setWeb3FashionItems([...web3FashionItems]);
  };

  const uploadFile = async (file) => {
    try {
      dispatch(designerActions.setIsloading(true));
      let url = await api.getPresignedGeneralUrl(file.type, file.name);
      if (url) {
        const result = await api.uploadImageToS3(url, file);
        if (result) {
          const queryIndex = url.indexOf('?');
          if (queryIndex >= 0) {
            url = url.slice(0, queryIndex);
          }
          dispatch(designerActions.setIsloading(false));
          return url;
        }
      }
      dispatch(designerActions.setIsloading(false));
      return null;
    } catch (e) {
      dispatch(designerActions.setIsloading(false));
      return null;
    }
  };

  const onClickAddText = () => {
    // validation
    const arrRemoveSpaces = addTextDraft.split(' ');
    if (arrRemoveSpaces.findIndex((item) => item !== '') === -1) {
      document.getElementById('text-add-item').focus();
      setAddTextDraft('');
      toast('Please input some text.');
      return;
    }

    const itemStyle = document.getElementById('text-add-item').style;

    web3FashionItems.push({
      type: 'text',
      value: addTextDraft.replace(/\r\n|\r|\n/g, '<br />'),
      style: {
        fontFamily: itemStyle.fontFamily,
        fontSize: itemStyle.fontSize,
        color: itemStyle.color,
      },
    });

    setWeb3FashionItems(web3FashionItems);

    // Reset Add Text
    setAddTextDraft('');
  };

  const onClickAddImage = () => {
    // validation
    if (imageFileName === '') {
      toast('Please choose an image file.');
      return;
    }

    const imageUploadEl = document.getElementById('image-upload');

    uploadFile(imageUploadEl.files[0])
      .then((uploaded) => {
        if (!uploaded) {
          toast('Failed to upload the file. Please try again.');
          return;
        }

        web3FashionItems.push({
          type: 'image',
          value: uploaded,
        });

        setWeb3FashionItems(web3FashionItems);

        // Reset Add Image
        imageUploadEl.value = '';
        setImageFileName('');
      })
      .catch((e) => {
        console.log('e: ', e);
        toast('Failed to upload the file. Please try again.');
        return;
      });
  };

  const onClickAddVideo = () => {
    // validation
    if (videoFileName === '') {
      toast('Please choose a video file.');
      return;
    }

    const videoUploadEl = document.getElementById('video-upload');

    uploadFile(videoUploadEl.files[0])
      .then((uploaded) => {
        if (!uploaded) {
          toast('Failed to upload the file. Please try again.');
          return;
        }

        web3FashionItems.push({
          type: 'video',
          value: uploaded,
        });

        setWeb3FashionItems(web3FashionItems);

        // Reset Add Video
        videoUploadEl.value = '';
        setVideoFileName('');
      })
      .catch((e) => {
        console.log('e: ', e);
        toast('Failed to upload the file. Please try again.');
        return;
      });
  };

  const onClickAddEmbededVideo = () => {
    // validation
    if (embededVideoFileName === '') {
      toast('Please choose a video file.');
      return;
    }

    web3FashionItems.push({
      type: 'embeded',
      value: embededVideoFileName,
    });

    setWeb3FashionItems(web3FashionItems);

    // Reset Add Embeded Video
    setEmbededVideoFileName('');
  };

  const onChangeImageFile = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const pathItems = e.target.value.split('\\');
    setImageFileName(pathItems[pathItems.length - 1]);
  };

  const onChangeVideoFile = (e) => {
    let files = e.target.files || e.dataTransfer.files;
    if (files.length === 0) {
      return;
    }
    const pathItems = e.target.value.split('\\');
    setVideoFileName(pathItems[pathItems.length - 1]);
  };

  const openImageFile = () => {
    document.getElementById('image-upload').click();
  };

  const openVideoFile = () => {
    document.getElementById('video-upload').click();
  };

  const onClickReset = () => {
    setWeb3FashionItems(JSON.parse(designerInfo['web3FashionItems']));
  };

  const onClickSave = () => {
    designerInfo['web3FashionItems'] = JSON.stringify(web3FashionItems);
    dispatch(designerActions.updateProfile({ ...designerInfo }));
  };

  const getMaxYValue = () => {
    const elWrapper = document.getElementById(`web3-fashion-wrapper`);
    const yValues = web3FashionItems.map((item, index) => {
      const el = document.getElementById(`web3-fashion-item-${index}`);
      return el && elWrapper
        ? (el.getBoundingClientRect().bottom - elWrapper.getBoundingClientRect().top) / scale
        : 0;
    });
    return Math.max(...yValues, 400);
  };

  const maxYValue = getMaxYValue();

  useEffect(() => {
    setWrapperHeight((maxYValue + 100) * scale);
  }, [maxYValue]);

  const changeFont = (fontName, fontSize) => {
    var sel = window.getSelection(); // Gets selection
    if (sel.rangeCount) {
      // Creates a new element, and insert the selected text with the chosen font inside
      var e = document.createElement('span');
      if (fontName) {
        e.style = 'font-family:' + fontName + ';';
      }

      if (fontSize) {
        e.style += 'font-size:' + fontSize + ';';
      }

      e.innerHTML = sel.toString();

      var range = sel.getRangeAt(0);
      range.deleteContents(); // Deletes selected text…
      range.insertNode(e); // … and inserts the new element at its place
    }
  };

  const onFocusText = (e) => {
    setCurrentTargetForFont(e.target);
    setShowFont(true);
  };

  const onBlurText = (e, index) => {
    setCurrentTargetForFont(e.target);
    updateText(e.target.innerHTML, index);
  };

  return (
    <div
      className={[
        styles.wrapper,
        web3FashionItems.length > 0 || isEditable ? styles.showBackground : '',
      ].join(' ')}
    >
      {(web3FashionItems.length > 0 || isEditable) && (
        <img src="/images/designer-page/triangle2.png" className={styles.triangle2} />
      )}
      {(isEditable || web3FashionItems.length > 0) && (
        <h1 className={isEditable ? '' : styles.marginBottom}>Web3 Fashion 101</h1>
      )}
      {isEditable && (
        <div className={styles.toolbar}>
          <div className={styles.leftPart}>
            <Button onClick={onClickImage}>IMAGE</Button>
            <Button onClick={onClickVideo}>VIDEO</Button>
            <Button onClick={onClickEmbededVideo}>EMBED VIDEO</Button>
            <Button onClick={onClickText}>TEXT</Button>
          </div>
          <div className={styles.rightPart}>
            <Button onClick={onClickSave}>Save</Button>
            <Button onClick={onClickReset}>Reset</Button>
          </div>
        </div>
      )}
      {isEditable && (
        <div className={styles.addItem}>
          {isShowTextAdd && (
            <div className={styles.addText}>
              <h1>Text</h1>
              <textarea
                id="text-add-item"
                value={addTextDraft}
                style={{ fontFamily: 'Poppins' }}
                onChange={(e) => setAddTextDraft(e.target.value)}
                onFocus={onFocusText}
              />
              <Button className={styles.addButton} onClick={onClickAddText}>
                ADD
              </Button>
            </div>
          )}
          {isShowImageAdd && (
            <div className={styles.addImage}>
              <h1>Image</h1>
              <input
                id="image-upload"
                type="file"
                onChange={onChangeImageFile}
                hidden
                accept=".jpg, .png, .gif"
              />
              <Button className={styles.uploadButton} background="black" onClick={openImageFile}>
                FILE UPLOAD
              </Button>
              <div className={styles.fileName}>
                {imageFileName && imageFileName !== '' ? imageFileName : 'No file chosen'}
              </div>
              <Button className={styles.addButton} onClick={onClickAddImage}>
                ADD
              </Button>
            </div>
          )}
          {isShowVideoAdd && (
            <div className={styles.addVideo}>
              <h1>Video</h1>
              <input
                id="video-upload"
                type="file"
                onChange={onChangeVideoFile}
                hidden
                accept=".mp4, .mov"
              />
              <Button className={styles.uploadButton} background="black" onClick={openVideoFile}>
                FILE UPLOAD
              </Button>
              <div className={styles.fileName}>
                {videoFileName && videoFileName !== '' ? videoFileName : 'No file chosen'}
              </div>
              <Button className={styles.addButton} onClick={onClickAddVideo}>
                ADD
              </Button>
            </div>
          )}
          {isShowEmbededVideoAdd && (
            <div className={styles.addVideo}>
              <h1>Embeded Video</h1>
              <input
                id="embeded-video"
                type="text"
                className={styles.embededVideo}
                value={embededVideoFileName}
                onChange={(e) => setEmbededVideoFileName(e.target.value)}
              />
              <Button className={styles.addButton} onClick={onClickAddEmbededVideo}>
                ADD
              </Button>
            </div>
          )}
        </div>
      )}
      <div
        className={[styles.web3FashionView, 'web3-fashion-wrapper'].join(' ')}
        id="web3-fashion-wrapper"
        style={{
          width: 1920,
          height: wrapperHeight,
          transformOrigin: '0 0',
          transform: `scale(${scale})`,
        }}
      >
        {isEditable && (
          <Moveable
            target={selectedTarget}
            container={null}
            checkInput={isTextEdit}
            ables={[Removable]}
            ref={moveableRef}
            onClickGroup={(e) => {
              selectoRef.current.clickTarget(e.inputEvent, e.inputTarget);
            }}
            props={{
              removable: true,
            }}
            origin={true}
            defaultGroupOrigin={'50% 50%'}
            draggable={true}
            onDrag={({
              target,
              beforeDelta,
              beforeDist,
              left,
              top,
              right,
              bottom,
              delta,
              dist,
              transform,
              clientX,
              clientY,
              translate,
            }) => {
              if (translate[1] >= 0) target.style.transform = transform;
            }}
            onDragEnd={({ target, isDrag, clientX, clientY }) => {
              web3FashionItems[selectedIndex[0]].style = {
                width: target.style.width,
                height: target.style.height,
                transform: target.style.transform,
                transformOrigin: target.style.transformOrigin,
                fontFamily: target.style.fontFamily,
                fontSize: target.style.fontSize,
                color: target.style.color,
              };
              setWeb3FashionItems([...web3FashionItems]);
              onClickTarget(
                document.getElementById(`web3-fashion-item-${selectedIndex}`),
                selectedIndex[0]
              );
            }}
            onDragGroup={(e) => {
              e.events.forEach((ev) => {
                const target = ev.target;
                target.style.transform = ev.transform;
              });
            }}
            onDragGroupEnd={(e) => {
              e.targets.forEach((target) => {
                const itemId = parseInt(target.id.replace('web3-fashion-item-', ''));
                web3FashionItems[itemId].style = {
                  width: target.style.width,
                  height: target.style.height,
                  transform: target.style.transform,
                  transformOrigin: target.style.transformOrigin,
                  fontFamily: target.style.fontFamily,
                  fontSize: target.style.fontSize,
                  color: target.style.color,
                };
              });
            }}
            onRotateGroup={(e) => {
              e.events.forEach((ev) => {
                const target = ev.target;
                target.style.transform =
                  `translate(${ev.drag.beforeTranslate[0]}px, ${ev.drag.beforeTranslate[1]}px)` +
                  ` rotate(${ev.rotate}deg)`;
              });
            }}
            onRotateGroupEnd={(e) => {
              e.targets.forEach((target) => {
                const itemId = parseInt(target.id.replace('web3-fashion-item-', ''));
                web3FashionItems[itemId].style = {
                  width: target.style.width,
                  height: target.style.height,
                  transform: target.style.transform,
                  fontFamily: target.style.fontFamily,
                  fontSize: target.style.fontSize,
                  color: target.style.color,
                };
              });
            }}
            resizable={true}
            renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
            throttleResize={0}
            onResizeStart={({ target, clientX, clientY }) => {}}
            onResize={({ target, width, height, dist, delta, direction, clientX, clientY }) => {
              delta[0] && (target.style.width = `${width}px`);
              delta[1] && (target.style.height = `${height}px`);
            }}
            onResizeEnd={({ target, isDrag, clientX, clientY }) => {
              web3FashionItems[selectedIndex[0]].style = {
                width: target.style.width,
                height: target.style.height,
                transform: target.style.transform,
                transformOrigin: target.style.transformOrigin,
                fontFamily: target.style.fontFamily,
                fontSize: target.style.fontSize,
                color: target.style.color,
              };
              setWeb3FashionItems([...web3FashionItems]);
              onClickTarget(
                document.getElementById(`web3-fashion-item-${selectedIndex[0]}`),
                selectedIndex[0]
              );
            }}
            rotatable={true}
            throttleRotate={0}
            onRotateStart={(e) => {}}
            onRotate={({ target, delta, dist, transform, clientX, clientY }) => {
              target.style.transform = transform;
            }}
            onRotateEnd={({ target, isDrag, clientX, clientY }) => {
              web3FashionItems[selectedIndex[0]].style = {
                width: target.style.width,
                height: target.style.height,
                transform: target.style.transform,
                transformOrigin: target.style.transformOrigin,
                fontFamily: target.style.fontFamily,
                fontSize: target.style.fontSize,
                color: target.style.color,
              };
              setWeb3FashionItems([...web3FashionItems]);
              onClickTarget(
                document.getElementById(`web3-fashion-item-${selectedIndex[0]}`),
                selectedIndex[0]
              );
            }}
          />
        )}
        {web3FashionItems.map((item, index) => {
          if (item.type === 'text') {
            return (
              <div
                className={[
                  styles.target,
                  styles.text,
                  'target',
                  isEditable ? styles.showBorder : '',
                ].join(' ')}
                id={`web3-fashion-item-${index}`}
                key={JSON.stringify(item) + index}
                style={item.style || {}}
                onClick={(e) => onClickTarget(e.target, index)}
                onBlur={(e) => onBlurText(e, index)}
                onFocus={onFocusText}
                contentEditable={isEditable}
                dangerouslySetInnerHTML={{ __html: item.value }}
              ></div>
            );
          } else if (item.type === 'image') {
            return (
              <img
                className={[
                  styles.target,
                  styles.image,
                  'target',
                  isEditable ? styles.showBorder : '',
                ].join(' ')}
                key={JSON.stringify(item) + index}
                id={`web3-fashion-item-${index}`}
                style={item.style || {}}
                onClick={(e) => onClickTarget(e.target, index)}
                src={item.value}
              />
            );
          } else if (item.type === 'video') {
            return (
              <video
                autoPlay
                muted
                loop
                playsInline
                style={item.style || {}}
                className={[
                  styles.target,
                  styles.video,
                  'target',
                  isEditable ? styles.showBorder : '',
                ].join(' ')}
                id={`web3-fashion-item-${index}`}
                key={JSON.stringify(item) + index}
                onClick={(e) => onClickTarget(e.target, index)}
              >
                <source src={item.value} type="video/mp4" />
              </video>
            );
          } else if (item.type === 'embeded') {
            return (
              <div
                style={item.style || {}}
                id={`web3-fashion-item-${index}`}
                key={JSON.stringify(item) + index}
                className={[
                  styles.target,
                  styles.embeded,
                  'target',
                  isEditable ? styles.showBorder : '',
                ].join(' ')}
                onClick={(e) => onClickTarget(e.target, index)}
              >
                <iframe src={item.value}></iframe>
                <div
                  className={[isEditable ? styles.overlay : styles.hidden, 'target-overlay'].join(
                    ' '
                  )}
                />
              </div>
            );
          }
        })}
      </div>
      {isEditable && (
        <Selecto
          ref={selectoRef}
          dragContainer={'.web3-fashion-wrapper'}
          selectableTargets={['.target']}
          hitRate={0}
          selectByClick={false}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          ratio={0}
          onDragStart={(e) => {
            const moveable = moveableRef.current;
            const target = e.inputEvent.target;
            if (
              moveable.isMoveableElement(target) ||
              selectedTarget.some((t) => t === target || t.contains(target)) ||
              target.classList.contains('removable-button') ||
              target.classList.contains('editable-button') ||
              target.classList.contains('clone-button')
            ) {
              e.stop();
            }
          }}
          onDrag={(e) => {}}
          onSelectEnd={(e) => {
            const moveable = moveableRef.current;

            if (e.selected.length > 0 || selectedTarget.length > 1) {
              setSelectedTarget(e.selected);
            }

            const selectedIds = e.selected.map((item) =>
              parseInt(item.id.replace('web3-fashion-item-', ''))
            );
            if (selectedIds.length > 0 || selectedIndex.length > 1) {
              setSelectedIndex(selectedIds);
            }

            if (e.isDragStart) {
              e.inputEvent.preventDefault();
            }
          }}
        ></Selecto>
      )}
      {showFont && <ChooseFont target={currentTargetForFont} onClosed={() => setShowFont(false)} />}
    </div>
  );
};

export default BottomPart;
