// Barcode.jsx
import React from 'react';
import Barcode from 'react-barcode';

const BarcodeComponent = ({ value }) => {
  return <Barcode value={value}   height={30} />;
};

export default BarcodeComponent;
