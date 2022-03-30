import React, { useEffect, useState } from 'react';
import Icon from '@material-ui/core/Icon';
import { InputBase, Fade, Popper, Tooltip, Button, ClickAwayListener } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
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

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);
const useStyles = makeStyles({
  mobilePopper: {
    fontSize: 8,
    width: 204,
  },
  tooltip: {
    width: 162,
    backgroundColor: 'white',
    color: '#111111',
    fontFamily: 'inter',
    fontWeight: 400,
    fontSize: 8,
    padding: '4px 8px',
    textAlign: 'center',
    borderRadius: 0,
    marginLeft: 8,
    lineHeight: '8px',
  },
});
function Input(props) {
  const classes = useStyles();
  const screenWidth = useWindowDimensions().width;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log('screen Width = >', screenWidth);
    screenWidth > 472 ? setIsMobile(false) : setIsMobile(true);
  }, [screenWidth]);

  const { label, required, description, value, onChange, disabled = false } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const handleHover = (event, text) => {
    //setAnchorEl(event.currentTarget);
    setOpen((prev) => !prev);
    setText(text);
  };
  const handleLeave = () => {
    //setAnchorEl(null);
    setOpen(false);
  };
  return (
    <div className="flex flex-col mt-10">
      <div className="flex">
        {!isMobile?(
          <span className="font-inter font-extrabold text-gray-50 text-sm mb-2">{label}</span>
        ):(
          <span className="font-inter font-extrabold text-gray-50 mb-2" style={{fontSize: 14, lineHeight: '22px', fontWeight: 800 }}>{label}</span>
        )}
        {required &&
          (isMobile ? (
            <ClickAwayListener onClickAway={handleLeave}>
              <Tooltip
                title={description}
                placement="right-end"
                open={open}
                classes={{ popper: classes.mobilePopper, tooltip: classes.tooltip }}
              >
                <span
                  className="questionMark"
                  onClick={(e, description) => handleHover(e, description)}
                >
                  ?
                </span>
              </Tooltip>
            </ClickAwayListener>
          ) : (
            <LightTooltip title={description} placement="right">
              <span className="questionMark">?</span>
            </LightTooltip>
          ))}
      </div>
      {!isMobile ? (
        <InputBase
          disabled={disabled}
          value={value}
          onChange={onChange}
          className="pl-3 border-1 border-third bg-white h-9"
        />
      ) : (
        <InputBase
          disabled={disabled}
          value={value}
          onChange={onChange}
          className="pl-3 border-1 border-third bg-white"
          style={{height: 34, color:'#111111', fontSize: 14}}
        />
      )}
    </div>
  );
}

export default Input;
