import React from 'react';
import { Adsense } from '@ctrl/react-adsense';

const MyAd = () => {
  return (
    <Adsense.google
      client='ca-pub-3145740054914889' // แทนที่ด้วย ID ของคุณ
      slot='5913453722' // แทนที่ด้วย Slot ID ของคุณ
      style={{ display: 'block' }}
      format='auto'
    />
  );
};

export default MyAd;