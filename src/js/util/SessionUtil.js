import _ from 'underscore';
import ClientSideStorage from '@component/common/src/util/ClientSideStorage';
import Cookie from '@component/common/src/util/Cookie';

const RCS_KEY = 'richRelevanceRCS';
const isValidSessionId = sessionId => !!(sessionId && typeof sessionId === 'string' && sessionId.length < 100);
const generateSessionID = () => {
  const s4 = () => {
    const date = new Date();
    return ((date.getTime() + Math.random()) * 0x10000).toString(16).substring(1);
  };

  let sessionId = '';

  _.times(4, () => {
    sessionId += s4();
  });

  return sessionId;
};

function getSessionId() {
  const RTD_COOKIE_NAME = 'RTD';

  let rtdCookie = (`${Cookie.get(RTD_COOKIE_NAME) || ''}`).trim();

  if (!isValidSessionId(rtdCookie)) {
    const sessionId = generateSessionID();
    const date = new Date();

    date.setFullYear(date.getFullYear() + 30);
    Cookie.setExpires(date.toUTCString());
    Cookie.set(RTD_COOKIE_NAME, sessionId);

    rtdCookie = sessionId;
  }

  return rtdCookie;
}

function getRCS() {
  return ClientSideStorage.getSession(RCS_KEY);
}

function setRCSIfEmpty(rcsValue) {
  const existingRCS = getRCS();

  if (existingRCS) {
    return existingRCS;
  }

  if (!rcsValue) {
    return rcsValue;
  }

  ClientSideStorage.setSession(RCS_KEY, rcsValue);
  return rcsValue;
}

function getUserID() {
  return Cookie.get('bloomingdales_online_uid');
}

function getRequester() {
  const MEDIUM_START_BREAKPOINT = 600;
  const isSmallScreen = window.innerWidth < MEDIUM_START_BREAKPOINT;

  return isSmallScreen ? 'BCOM-BMEW' : 'BCOM-NAVAPP';
}

function getCoreId() {
  return ClientSideStorage.getSession('cmCoreId6');
}

export {
  getCoreId,
  getRequester,
  getRCS,
  setRCSIfEmpty,
  getSessionId,
  generateSessionID,
  isValidSessionId,
  getUserID,
};
